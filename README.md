# Telegram OpenSea Bot

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd telegram-opensea-bot
```

2. Install dependencies:
```bash
npm install
```

3. Environment Configuration:
- Create a `.env` file in the project root directory
- Add the following environment variables:

```env
TELEGRAM_BOT_TOKEN = 'your_telegram_bot_token'
OPENSEA_API_KEY = 'your_opensea_api_key'

SUPABASE_KEY = 'your_supabase_key'
SUPABASE_URL = 'your_supabase_url'
```

Where:
- `TELEGRAM_BOT_TOKEN`: Your Telegram Bot token (get from [@BotFather](https://t.me/BotFather))
- `OPENSEA_API_KEY`: Your OpenSea API key
- `SUPABASE_KEY`: Your Supabase key
- `SUPABASE_URL`: Your Supabase project URL

## Running the Project

There are two ways to run the project:

1. Run in development mode (with hot reload):
```bash
npm run dev
```

2. Run directly:
```bash
npm start
```

## Additional Commands

- Generate Supabase types:
```bash
npm run gen-types
```

## Important Notes

- Make sure Node.js and npm are installed on your machine
- Never commit the `.env` file to the repository
- Add `.env` to your `.gitignore` file

## Requirements

- Node.js
- npm or yarn
- Telegram Bot Token
- OpenSea API Key
- Supabase Account
