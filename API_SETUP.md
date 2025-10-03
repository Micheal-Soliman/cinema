# OMDb API Setup Instructions

## Getting Your Free API Key

1. **Visit OMDb API Website**
   - Go to [http://www.omdbapi.com/apikey.aspx](http://www.omdbapi.com/apikey.aspx)

2. **Choose Free Tier**
   - Select "FREE! (1,000 daily limit)"
   - Enter your email address
   - Check the agreement checkbox
   - Click "Submit"

3. **Check Your Email**
   - You'll receive an email with your API key
   - The key will look something like: `12345678`

4. **Add API Key to Project**
   - Create a `.env.local` file in the root directory
   - Add this line: `NEXT_PUBLIC_OMDB_API_KEY=your_actual_api_key_here`
   - Replace `your_actual_api_key_here` with your real API key

## Your API Key Setup

**Your API Key:** `d7ef3458`

Create a `.env.local` file with:
```bash
NEXT_PUBLIC_OMDB_API_KEY=d7ef3458
```

**Important:** Make sure to activate your key first by clicking the activation link in your email!

## Important Notes

- The `.env.local` file should NOT be committed to version control
- The API key is free but limited to 1,000 requests per day
- If you exceed the limit, you'll get a 401 error
- The app will show "your-api-key-here" as a placeholder if no key is provided

## Testing the API

Once you have your API key set up:
1. Start the development server: `npm run dev`
2. Open the app in your browser
3. Try searching for a movie like "Batman" or "Avengers"
4. If the API key is working, you should see movie results

## Troubleshooting

- **No results showing**: Check if your API key is correct in `.env.local`
- **"Request limit exceeded"**: You've hit the daily 1,000 request limit
- **"Invalid API key"**: Double-check your API key is correct and active
