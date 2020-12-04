# Bot Auther
A lightweight Twitter Authenticator server for quickly obtaining API keys

## Why
A lot of bot authors just make a new developer account for each bot. This is impractical if orchestrating multiple bots in conjunction with one another.

## How to Use
Your bot army awaits! Let's walk through it.

### Setup Dependencies
You will need just a couple things:
1. Node and NPM
2. A Twitter developer account

### Instance Setup
1. After cloning the repo, run `npm install`
2. Now add a `.env` file in the repository and fill in your application consumer keys like so:
```env
TWITTER_APP_CONSUMER_KEY=your_key_here
TWITTER_APP_CONSUMER_SECRET=your_secret_here
```

**REMEMBER: Never check your keys into git!** You can get your keys from https://developer.twitter.com/.

3. Set up three-legged OAuth in your Twitter app and set the expected callback url to match your route in the server; by default it's `http://localhost:8080/sessions/callback`

### Running the 'Auth-er'
Make sure you've completed the steps in [Instance Setup](#instance-setup). You're now ready to authenticate some bots!

1. Start the server locally by running `npm start`
2. Log into your bot's twitter account and then navigate to `localhost:8080`
3. You'll be directed back to Twitter's authorization page; hit 'Authorize' to retrieve keys to that account.
4. The application's `/home` route will display the keys for your currently logged in Twitter account.
5. Navigate to `/` and hit 'Reset Session' before repeating the process with a new bot.

Questions? Go ahead and [open an issue!](https://github.com/thomasmost/bot_auther/issues/new)

Happy automating!

## Credits

Major thanks go to [Juan González](https://gist.github.com/JuanJo4) for the original OAuth implementation in Express. This tool ports his work to Koa and adds a basic interface, documentation, and security recommendations.

Here's the original gist this was based on: https://gist.github.com/JuanJo4/e408d9349b403523aeb00f262900e768
