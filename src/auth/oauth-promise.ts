//convert oauth methods to promises so we can use async/await syntax
//and keep our code sexier
import { OAuth } from 'oauth';
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import axios from 'axios';

const CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const INSTAGRAM_CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;

let _oauth;
@Injectable()
export class OauthService {
  constructor() {}

  async getOAuthRequestToken(callbackUrl) {
    // console.log('callbackUrl', callbackUrl);
    _oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      CONSUMER_KEY, // consumer key
      CONSUMER_SECRET, // consumer secret
      '1.0',
      callbackUrl,
      'HMAC-SHA1',
    );
    return new Promise((resolve, reject) => {
      _oauth.getOAuthRequestToken(
        (error, oauth_token, oauth_token_secret, results) => {
          // console.log(error, oauth_token, oauth_token_secret, results);
          // console.log(results);
          if (error) {
            reject(error);
          } else {
            resolve({ oauth_token, oauth_token_secret, results });
          }
        },
      );
    });
  }

  async getOAuthAccessToken(
    oauth_token,
    oauth_token_secret,
    oauth_verifier,
    callbackUrl,
  ) {
    _oauth = new OAuth(
      'https://api.twitter.com/oauth/request_token',
      'https://api.twitter.com/oauth/access_token',
      CONSUMER_KEY, // consumer key
      CONSUMER_SECRET, // consumer secret
      '1.0',
      callbackUrl,
      'HMAC-SHA1',
    );
    return new Promise((resolve, reject) => {
      _oauth.getOAuthAccessToken(
        oauth_token,
        oauth_token_secret,
        oauth_verifier,
        (error, oauth_access_token, oauth_access_token_secret, results) => {
          // console.log(oauth_access_token, oauth_access_token_secret, results);
          if (error) {
            reject(error);
          } else {
            resolve({
              oauth_access_token,
              oauth_access_token_secret,
              results,
            });
          }
        },
      );
    });
  }

  async getInstagramAccessToken(code, redirect_uri) {
    const insta_form = new URLSearchParams();
    insta_form.append('client_id', INSTAGRAM_CLIENT_ID);
    insta_form.append('client_secret', INSTAGRAM_CLIENT_SECRET);
    insta_form.append('grant_type', 'authorization_code');
    insta_form.append('redirect_uri', redirect_uri);
    insta_form.append('code', code);

    const result = await axios({
      method: 'POST',
      url: 'https://api.instagram.com/oauth/access_token',
      data: insta_form,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      transitional: {
        forcedJSONParsing: false,
      },
      // responseType: 'json',
      // transformResponse: (data) => {
      //   // transform the response
      //   console.log('data', data);
      //   return data;
      // },
    })
      .then((response) => {
        // console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });

    const stringParts = result.toString().split(' ');
    // console.log('result', stringParts);
    const user_id = stringParts[3].slice(0, -1);
    const jsonObj = JSON.parse(result.toString());

    const url = `https://graph.instagram.com/${user_id}?fields=id,username&access_token=${jsonObj.access_token}`;
    // console.log('url', url);

    const user = await axios.get(url);

    // console.log('user', user.data);

    return user.data;
  }

  async getYoutubeInfo(accessToken) {
    console.log('accessToken', accessToken);
    const result = await axios({
      method: 'GET',
      url: `https://www.googleapis.com/youtube/v3/channels?part=snippet&mine=true`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${accessToken}`,
      },
    })
      .then((response) => {
        console.log(response.data);
        return response.data;
      })
      .catch((err) => {
        console.log(err.response);
        return err;
      });

    return result;
  }
}
