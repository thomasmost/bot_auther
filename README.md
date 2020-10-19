# bot_auther
A lightweight Twitter Authenticator server for quickly obtaining API keys

## Why
A lot of bot authors (hehe) just make a new developer account for each bot. This is impractical if orchestrating multiple bots in conjunction with one another.

## How to Use
Your bot army awaits! Let's walk through it.

### Setup Dependencies
You will need a few things:
1. Node and NPM
2. Ngrok
3. A Twitter developer account

### Instance Setup
1. After cloning the repo, run `npm install`
2. Now add an `.env` file in the repository and fill in your application consumer keys like so:
```env
TWITTER_APP_CONSUMER_KEY=your_key_here
TWITTER_APP_CONSUMER_SECRET=your_secret_here
```

**REMEMBER: Never check your keys into git!** You can get your keys from https://developer.twitter.com/.

### Running the 'Auth-er'
1. After cloning the repo, run `npm install`
2. You can then start the server locally by running `npm start`
3. Make sure ngrok is unzipped to your root directory; run `npm run serve` to tunnel requests to your local server.


