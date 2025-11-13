# Java Bot Backend

This Spring Boot app uses **Google Gemini API** for AI feedback generation.

## Environment Setup

1. **Get a free Gemini API key:**
   - Go to https://aistudio.google.com/app/apikeys
   - Click "Create API Key"
   - Copy the key

2. **Add your key to `.env`:**
   - Create a `.env` file in this folder (or use an existing one)
   - Add: `GEMINI_API_KEY=your_key_here`
   - Example:
     ```
     GEMINI_API_KEY=AIza123456789abcdefghijklmnop
     ```

## Security

- **Never commit `.env` with real keys!** It's already in `.gitignore`
- If you accidentally expose a key, regenerate it immediately at https://aistudio.google.com/app/apikeys
- The app will fail fast with a clear error if `GEMINI_API_KEY` is missing (no silent failures)

## Run

**From the Bot folder:**

```powershell
cd 'C:\Users\Asus\Downloads\CodeGenius-main\java-backend\Bot'
./mvnw spring-boot:run
```

Bot will start on `http://localhost:8081`

## API Details

- **Model:** Gemini 1.5 Flash (free tier)
- **Endpoint:** `/bot/chat?prompt=<your_prompt>`
- **Rate Limits:** Free tier allows ~60 requests/minute
- **Billing:** Free forever (with rate limits) or upgrade for higher limits

## Troubleshooting

| Error | Solution |
|-------|----------|
| `GEMINI_API_KEY is not set` | Create `.env` and add your key |
| `429 Too Many Requests` | You've exceeded rate limits; wait a minute or upgrade your plan |
| `400 Bad Request` | Invalid API key or request format; check key validity |

## Cost

- **Free:** 60 requests/minute
- **Paid:** Upgrade at https://console.cloud.google.com to increase limits
