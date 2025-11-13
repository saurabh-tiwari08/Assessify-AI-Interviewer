package com.bot.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

@Configuration
public class BotConfig {
    // load .env if present
    private final Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();

    // prefer system env, else .env
    private final String apiKey = System.getenv("GEMINI_API_KEY") != null
            ? System.getenv("GEMINI_API_KEY")
            : dotenv.get("GEMINI_API_KEY");

    @Bean
    public RestTemplate getTemplate() {
        return new RestTemplate();
    }

    @Bean("geminiApiKey")
    public String geminiApiKey() {
        return apiKey;
    }
}
