# bot_auther
A lightweight Twitter Authenticator server for quickly obtaining API keys

## Why
A lot of bot authors (hehe) just make a new developer account for each bot. This is impractical if orchestrating multiple bots in conjunction with one another.

## How to Use
Your bot army awaits! Let's walk through it.

### Setup
You will need a few things:
1. Node and NPM
2. Ngrok
3. A Twitter developer account

You'll then need to replace the `twitterConsumerKey` and `twitterConsumerSecret` with those of your app's in `app.ts`. **REMEMBER: Never check your keys into git!**

### Running the 'Auth-er'
1. After cloning the repo, run `npm install`
2. You can then start the server locally by running `npm start`
3. Make sure ngrok is unzipped to your root directory; run `npm run serve` to tunnel requests to your local server.


