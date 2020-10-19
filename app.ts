import bodyParser from 'koa-bodyparser';
import Koa from 'koa';
import Router from 'koa-router';
import { OAuth } from 'oauth';
import session from 'koa-session';
import { inspect } from 'util';

// Get your credentials here: https://dev.twitter.com/apps
const _twitterConsumerKey = 'twitterConsumerKey';
const _twitterConsumerSecret = 'twitterConsumerSecret';

const consumer = new OAuth(
  'https://twitter.com/oauth/request_token',
  'https://twitter.com/oauth/access_token',
  _twitterConsumerKey,
  _twitterConsumerSecret,
  '1.0A',
  'http://127.0.0.1:8080/sessions/callback',
  'HMAC-SHA1',
);

const app = new Koa();
const router = new Router();

app.use(bodyParser());

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
    ctx.body = 'You are signed in: ' + inspect(parsedData.screen_name);
  }
});

app.use(router.routes()).use(router.allowedMethods());

app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa.sess' /** (string) cookie key (default is koa.sess) */,
  /** (number || 'session') maxAge in ms (default is 1 days) */
  /** 'session' will result in a cookie that expires when session/browser is closed */
  /** Warning: If a session cookie is stolen, this cookie will never expire */
  maxAge: 86400000,
  autoCommit: true /** (boolean) automatically commit headers (default true) */,
  overwrite: true /** (boolean) can overwrite or not (default true) */,
  httpOnly: true /** (boolean) httpOnly or not (default true) */,
  signed: true /** (boolean) signed or not (default true) */,
  rolling: false /** (boolean) Force a session identifier cookie to be set on every response. The expiration is reset to the original maxAge, resetting the expiration countdown. (default is false) */,
  renew: false /** (boolean) renew session when session is nearly expired, so we can always keep user logged in. (default is false)*/,
  secure: true /** (boolean) secure cookie*/,
};

app.use(session(CONFIG, app));

app.listen(8080, function () {
  console.log('Listening on port 8080');
});
