package com.bot.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/bot")
@CrossOrigin(origins = "*")
public class BotController {

    private final Logger log = LoggerFactory.getLogger(BotController.class);
    private final RestTemplate restTemplate;
    private final String geminiUrl;
    private final String geminiModel;
    private final String geminiKey;

    public BotController(RestTemplate restTemplate,
                         @Value("${gemini.api.url}") String geminiUrl,
                         @Value("${gemini.model}") String geminiModel,
                         @Qualifier("geminiApiKey") String injectedGeminiKey) {
        this.restTemplate = restTemplate;
        this.geminiUrl = geminiUrl;
        this.geminiModel = geminiModel;
        this.geminiKey = injectedGeminiKey;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(@RequestBody Map<String, Object> payload) {
        try {
            // Extract the candidate's answer
            String candidateAnswer = payload.get("prompt") == null ? "" : payload.get("prompt").toString().trim();
            String question = payload.get("question") == null ? "(unknown question)" : payload.get("question").toString().trim();

            if (candidateAnswer.isBlank()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Candidate answer (prompt) is missing or empty"));
            }

            if (geminiKey == null || geminiKey.isBlank()) {
                log.warn("Gemini API key not configured; returning fallback feedback.");
                String local = generateLocalFeedback(candidateAnswer);
                return ResponseEntity.ok(Map.of("answer", local, "note", "local_fallback"));
            }

            // Build a concise evaluation prompt — feedback <=150 words
            String concisePrompt = String.format(
                    """
                    You are an interviewer bot. Evaluate the candidate's answer concisely — total response must not exceed 150 words.
                    Structure your response as:
                    - Summary (2–3 sentences)
                    - Subject Matter Expertise: score 0–10
                    - Communication Skills: score 0–10
                    - Key Improvement Tip: one short actionable suggestion.
                    Do not restate the question; be factual and short.

                    Question: %s
                    Candidate's Answer: %s
                    """,
                    question,
                    candidateAnswer
            );

            // Build request body matching Gemini API shape
            Map<String, Object> part = Map.of("text", concisePrompt);
            Map<String, Object> partsContainer = Map.of("parts", List.of(part));
            Map<String, Object> content = Map.of("contents", List.of(partsContainer));

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("x-goog-api-key", geminiKey);
            headers.setAccept(Collections.singletonList(MediaType.APPLICATION_JSON));

            String endpoint = String.format("%s/models/%s:generateContent", trimTrailingSlash(geminiUrl), geminiModel);
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(content, headers);

            log.info("Sending concise feedback request to Gemini (masked key).");
            ResponseEntity<Map> response = restTemplate.postForEntity(endpoint, request, Map.class);

            if (!response.getStatusCode().is2xxSuccessful()) {
                log.error("Gemini returned non-2xx: {} body: {}", response.getStatusCode(), response.getBody());
                return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                        .body(Map.of("error", "Gemini API error", "status", response.getStatusCode(), "body", response.getBody()));
            }

            Map respBody = response.getBody();
            if (respBody != null) {
                String botText = extractTextFromResp(respBody);
                if (botText == null || botText.isBlank()) {
                    botText = respBody.toString();
                }
                return ResponseEntity.ok(Map.of("answer", botText));
            }

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Empty response from Gemini"));

        } catch (HttpClientErrorException httpEx) {
            String body = httpEx.getResponseBodyAsString();
            log.error("Gemini HTTP error: {} body: {}", httpEx.getStatusCode(), maskApiKey(body), httpEx);
            return ResponseEntity.status(HttpStatus.BAD_GATEWAY)
                    .body(Map.of("error", "Gemini HTTP error", "status", httpEx.getStatusCode(), "body", body));
        } catch (Exception ex) {
            log.error("Unhandled error in /bot/chat", ex);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Internal server error", "message", ex.getMessage()));
        }
    }

    private String trimTrailingSlash(String s) {
        return s == null ? "" : s.endsWith("/") ? s.substring(0, s.length() - 1) : s;
    }

    private String maskApiKey(String input) {
        if (input == null) return null;
        return input.replaceAll("([A-Za-z0-9-_]{8})([A-Za-z0-9-_]+)([A-Za-z0-9-_]{4})", "$1***$3");
    }

    @SuppressWarnings("unchecked")
    private String extractTextFromResp(Map respBody) {
        if (respBody == null) return null;

        // 1) candidates -> [{ content: { parts: [{text: "..."}] } }] OR candidate directly has text
        Object candidates = respBody.get("candidates");
        if (candidates instanceof List) {
            List candList = (List) candidates;
            if (!candList.isEmpty()) {
                Object first = candList.get(0);
                if (first instanceof Map) {
                    Map firstMap = (Map) first;
                    // candidate.content -> parts -> first -> text
                    Object content = firstMap.get("content");
                    if (content instanceof Map) {
                        Map contentMap = (Map) content;
                        Object parts = contentMap.get("parts");
                        if (parts instanceof List && !((List) parts).isEmpty()) {
                            Object p0 = ((List) parts).get(0);
                            if (p0 instanceof Map && ((Map) p0).get("text") != null) {
                                return ((Map) p0).get("text").toString();
                            }
                        }
                    }
                    // candidate may also have "text" or "message" directly
                    if (firstMap.get("text") != null) return firstMap.get("text").toString();
                    if (firstMap.get("message") != null) return firstMap.get("message").toString();
                }
                // fallback: toString of first candidate
                return first.toString();
            }
        }

        // 2) outputs -> [{ content: [{ parts: [{ text: "..." }] }] }]
        Object outputs = respBody.get("outputs");
        if (outputs instanceof List) {
            List outList = (List) outputs;
            if (!outList.isEmpty()) {
                Object firstOut = outList.get(0);
                if (firstOut instanceof Map) {
                    Map outMap = (Map) firstOut;
                    Object content = outMap.get("content");
                    if (content instanceof List && !((List) content).isEmpty()) {
                        Object c0 = ((List) content).get(0);
                        if (c0 instanceof Map) {
                            Object parts = ((Map) c0).get("parts");
                            if (parts instanceof List && !((List) parts).isEmpty()) {
                                Object p0 = ((List) parts).get(0);
                                if (p0 instanceof Map && ((Map) p0).get("text") != null) {
                                    return ((Map) p0).get("text").toString();
                                }
                            }
                            // try direct text field
                            if (((Map) c0).get("text") != null) return ((Map) c0).get("text").toString();
                        }
                    }
                    // fallback to some common fields
                    if (outMap.get("text") != null) return outMap.get("text").toString();
                    if (outMap.get("message") != null) return outMap.get("message").toString();
                }
                return firstOut.toString();
            }
        }

        // 3) top-level "content" -> parts -> text
        Object content = respBody.get("content");
        if (content instanceof Map) {
            Map cMap = (Map) content;
            Object parts = cMap.get("parts");
            if (parts instanceof List && !((List) parts).isEmpty()) {
                Object p0 = ((List) parts).get(0);
                if (p0 instanceof Map && ((Map) p0).get("text") != null) {
                    return ((Map) p0).get("text").toString();
                }
            }
        } else if (content instanceof List) {
            List cList = (List) content;
            if (!cList.isEmpty()) {
                Object first = cList.get(0);
                if (first instanceof Map && ((Map) first).get("parts") instanceof List) {
                    Object p0 = ((List) ((Map) first).get("parts")).get(0);
                    if (p0 instanceof Map && ((Map) p0).get("text") != null) return ((Map) p0).get("text").toString();
                } else {
                    return first.toString();
                }
            }
        }

        // 4) check common simple keys
        if (respBody.get("text") != null) return respBody.get("text").toString();
        if (respBody.get("message") != null) return respBody.get("message").toString();

        // final fallback
        return respBody.toString();
    }

    // ✅ Local fallback heuristic feedback
    private String generateLocalFeedback(String prompt) {
        if (prompt == null || prompt.isBlank()) return "No input provided.";

        String lower = prompt.toLowerCase();
        int wordCount = lower.split("\\s+").length;

        int expertise = 5; // baseline
        int communication = 5;

        if (lower.contains("mongo")) expertise += 2;
        if (lower.contains("express")) expertise += 1;
        if (lower.contains("react")) expertise += 1;
        if (lower.contains("node")) expertise += 1;

        if (wordCount < 5) {
            expertise = Math.max(1, expertise - 3);
            communication = Math.max(1, communication - 3);
        } else if (wordCount < 20) {
            expertise = Math.max(1, expertise - 1);
        }

        expertise = Math.min(10, Math.max(0, expertise));
        communication = Math.min(10, Math.max(0, communication));

        return String.format(
                "Local feedback (short)\nSubject Matter Expertise: %d/10\nCommunication: %d/10\nTip: Expand explanations and include examples.",
                expertise, communication
        );
    }
}
