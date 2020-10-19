import dotenv from 'dotenv';

import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import Router from 'koa-router';
import { OAuth } from 'oauth';
import session from 'koa-session';
import { inspect } from 'util';

dotenv.config();

// Get your credentials here: https://developer.twitter.com/
const { TWITTER_APP_CONSUMER_KEY, TWITTER_APP_CONSUMER_SECRET } = process.env;

if (!TWITTER_APP_CONSUMER_KEY || !TWITTER_APP_CONSUMER_SECRET) {
  throw Error(
    'Missing required configuration; did you remember to add your .env file?',
  );
}

const consumer = new OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  TWITTER_APP_CONSUMER_KEY,
  TWITTER_APP_CONSUMER_SECRET,
  '1.0A',
  'http://localhost:8080/sessions/callback',
  'HMAC-SHA1',
);

const app = new Koa();
const router = new Router();

app.use(bodyParser());

app.keys = ['some secret hurr'];

app.use(session(app));

router.get('/home', async (ctx) => {
  ctx.body = `
<div>
  <div>
    Access Token: ${ctx.session?.oauthAccessToken}
  </div>
  <div>
    Access Secret: ${ctx.session?.oauthAccessTokenSecret}
  </div>
</div>
`;
  return;
});

router.get('/sessions/connect', async function (ctx) {
  console.log('Beginning handshake');

  const [error, oauthToken, oauthTokenSecret, results] = await new Promise(
    (resolve) => {
      if (!ctx.session) {
        ctx.status = 500;
        ctx.body = 'Missing session';
        return;
      }
      consumer.getOAuthRequestToken(function (
        error,
        oauthToken,
        oauthTokenSecret,
        results,
      ) {
        resolve([error, oauthToken, oauthTokenSecret, results]);
      });
    },
  );

  if (!ctx.session) {
    ctx.status = 500;
    ctx.body = 'Missing session';
    return;
  }
  if (error) {
    ctx.status = 500;
    ctx.body = 'Error getting OAuth request token : ' + inspect(error);
  } else {
    ctx.session.oauthRequestToken = oauthToken;
    ctx.session.oauthRequestTokenSecret = oauthTokenSecret;
    console.log('Double check on 2nd step');
    console.log('------------------------');
    console.log('<<' + ctx.session.oauthRequestToken);
    console.log('<<' + ctx.session.oauthRequestTokenSecret);
    ctx.redirect(
      'https://twitter.com/oauth/authorize?oauth_token=' +
        ctx.session.oauthRequestToken,
    );
  }
});

router.get('/sessions/callback', async function (ctx) {
  if (!ctx.session) {
    ctx.status = 500;
    ctx.body = 'Missing session';
    return;
  }
  console.log('------------------------');
  console.log('>>' + ctx.session.oauthRequestToken);
  console.log('>>' + ctx.session.oauthRequestTokenSecret);
  console.log('>>' + ctx.query.oauth_verifier);
  const [
    error,
    oauthAccessToken,
    oauthAccessTokenSecret,
    result,
  ] = await new Promise((resolve) => {
    if (!ctx.session) {
      ctx.status = 500;
      ctx.body = 'Missing session';
      return;
    }
    consumer.getOAuthAccessToken(
      ctx.session.oauthRequestToken,
      ctx.session.oauthRequestTokenSecret,
      ctx.query.oauth_verifier,
      function (error, oauthAccessToken, oauthAccessTokenSecret, result) {
        resolve([error, oauthAccessToken, oauthAccessTokenSecret, result]);
      },
    );
  });
  if (!ctx.session) {
    ctx.status = 500;
    ctx.body = 'Missing session';
    return;
  }
  if (error) {
    ctx.status = 500;
    ctx.body =
      ('Error getting OAuth access token : ' +
        inspect(error) +
        '[' +
        oauthAccessToken +
        ']' +
        '[' +
        oauthAccessTokenSecret +
        ']' +
        '[' +
        inspect(result) +
        ']',
      500);
  } else {
    console.log(`access_token: ${oauthAccessToken}`);
    console.log(`access_secret: ${oauthAccessTokenSecret}`);
    ctx.session.oauthAccessToken = oauthAccessToken;
    ctx.session.oauthAccessTokenSecret = oauthAccessTokenSecret;

    ctx.redirect('/home');
  }
});

router.get(/\//, async (ctx) => {
  console.log('wildcard');
  if (!ctx.session) {
    ctx.status = 500;
    ctx.body = 'Missing session';
    return;
  }
  const [error, data, response] = await new Promise((resolve) => {
    if (!ctx.session) {
      ctx.status = 500;
      ctx.body = 'Missing session';
      return;
    }
    consumer.get(
      'https://api.twitter.com/1.1/account/verify_credentials.json',
      ctx.session.oauthAccessToken,
      ctx.session.oauthAccessTokenSecret,
      function (error, data, response) {
        resolve([error, data, response]);
      },
    );
  });
  if (error) {
    //console.log(error)
    ctx.redirect('/sessions/connect');
  } else {
    const parsedData = JSON.parse(data as string);
    ctx.body = 'You are signed in as: ' + inspect(parsedData.screen_name);
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.listen(8080, function () {
  console.log('Listening on port 8080');
});
