# bot_auther
A lightweight Twitter Authenticator server for quickly obtaining API keys

## Why
A lot of bot authors (hehe) just make a new developer account for each bot. This is impractical if orchestrating multiple bots in conjunction with one another.

## How to Use
Your bot army awaits! Let's walk through it.

### Setup Dependencies
You will need just a couple things:
1. Node and NPM
3. A Twitter developer account

### Instance Setup
1. After cloning the repo, run `npm install`
2. Now add an `.env` file in the repository and fill in your application consumer keys like so:
```env
TWITTER_APP_CONSUMER_KEY=your_key_here
TWITTER_APP_CONSUMER_SECRET=your_secret_here
```

**REMEMBER: Never check your keys into git!** You can get your keys from https://developer.twitter.com/.

3. Set up three-legged OAuth in your Twitter app and set the expected callback url matches your route in the server; by default it's `http://localhost:8080/sessions/callback`

### Running the 'Auth-er'
1. After cloning the repo, run `npm install`
2. You can then start the server locally by running `npm start`
3. Log into your bot's twitter account and then navigate to `localhost:8080`
4. You'll be directed back to Twitter's authorization page; hit 'Authorize' to retrieve keys to that account.
