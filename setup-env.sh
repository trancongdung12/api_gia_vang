#!/bin/bash

# Create .env file with Telegram credentials
cat > .env << EOL
TELEGRAM_BOT_TOKEN=7750754244:AAFPHhCMNXYQf0cYKjW_pyQCAEt85k73wTA
# For private chats, use a positive number (e.g., 5992512669)
# For group chats, use a negative number (e.g., -1001234567890)
TELEGRAM_CHAT_ID=-4699052411
EOL

echo ".env file created with your updated Telegram credentials"
echo "Note: To send messages to a group chat, update TELEGRAM_CHAT_ID in .env with your group's chat ID (negative number)"
echo "See get-group-id.md for instructions on how to get your group chat ID" 