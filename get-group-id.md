# How to Get Telegram Group Chat ID

## Method 1: Using the getUpdates API

1. First, delete any webhook that might be active:
   ```
   https://api.telegram.org/bot7750754244:AAFPHhCMNXYQf0cYKjW_pyQCAEt85k73wTA/deleteWebhook
   ```
   You should see: `{"ok":true,"result":true,"description":"Webhook was deleted"}`

2. Add your bot to the Telegram group you want to send messages to
3. In the group, send a message mentioning the bot (e.g., "@your_bot_username hello")
4. Access this URL in your browser (or use curl):
   ```
   https://api.telegram.org/bot7750754244:AAFPHhCMNXYQf0cYKjW_pyQCAEt85k73wTA/getUpdates
   ```
5. Look for the `"chat"` object in the response - it will contain an `"id"` field with a negative number (group chat IDs are always negative)
6. Use this negative number as your group chat ID

Example response when a message was sent to the bot in a group:
```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 123,
        "from": {
          "id": 111111111,
          "is_bot": false,
          "first_name": "User",
          "username": "username"
        },
        "chat": {
          "id": -1001234567890, // This is the group chat ID (note the negative number)
          "title": "My Group",
          "type": "supergroup"
        },
        "date": 1617123456,
        "text": "@your_bot_username hello"
      }
    }
  ]
}
```

## Troubleshooting

If you see an error message like:
```
{
  "ok": false,
  "error_code": 409,
  "description": "Conflict: can't use getUpdates method while webhook is active; use deleteWebhook to delete the webhook first"
}
```

You need to delete the webhook first using step 1 above.

## Method 2: Using a Forwarded Message

If the above method doesn't work:

1. Create a new private chat with @userinfobot on Telegram
2. Forward any message from your group to this bot
3. The bot will reply with information about the forwarded message, including the group ID 