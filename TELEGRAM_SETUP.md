# Telegram Bot Setup Guide

## Creating a Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather).
2. Start a chat with BotFather by clicking "Start" or typing "/start".
3. Type "/newbot" to create a new bot.
4. Provide a name for your bot (e.g., "Gold Price Tracker").
5. Provide a username for your bot (must end with "bot", e.g., "gold_price_tracker_bot").
6. BotFather will provide you with a token. This is your `TELEGRAM_BOT_TOKEN`.
7. Save this token to use in your application.

## Getting Your Chat ID

### Method 1: Using a Bot

1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram.
2. Start a chat with this bot.
3. The bot will reply with your account information, including your ID.
4. Use this ID as your `TELEGRAM_CHAT_ID`.

### Method 2: For Group Chats

If you want to send messages to a group:

1. Add your bot to the group.
2. Send a message in the group.
3. Access the following URL in your browser, replacing `{TOKEN}` with your bot token:
   ```
   https://api.telegram.org/bot{TOKEN}/getUpdates
   ```
4. Look for the "chat" object and find the "id" field. This is your group chat ID.
5. Use this ID as your `TELEGRAM_CHAT_ID`.

## Setting Up Environment Variables

Create a `.env` file in the root directory of your project with the following content:

```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
```

Replace `your_bot_token_here` with your actual bot token and `your_chat_id_here` with your actual chat ID.

## Testing Your Bot

1. Start your application:
   ```bash
   yarn run start:dev
   ```
2. Access the manual trigger endpoint:
   ```
   GET http://localhost:3000/trigger-update
   ```
3. Check your Telegram chat to see if you receive the gold price update.

## Troubleshooting

- If you don't receive messages, ensure your bot token and chat ID are correct.
- Make sure your bot has permission to send messages in the chat.
- Check the application logs for any error messages. 