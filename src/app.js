const express = require('express');
const fetch = require('node-fetch');
const { URLSearchParams } = require('url');
const path = require('path');
const querystring = require('querystring');

const app = express();

const redirect_uri = 'http://localhost:3004/authorized';
// MOVE THESE TO ENV VARS
const clientId = process.env.clientId;
const clientSecret = process.env.clientSecret;

// replace ejs with something less gross
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/login', (req, res) => {
  console.log('In login');
  const scopes =
    'user-read-private user-read-email user-read-currently-playing user-read-playback-state';

  res.redirect(
    `https://accounts.spotify.com/authorize?${querystring.stringify({
      response_type: 'code',
      client_id: clientId,
      scope: scopes,
      redirect_uri,
    })}`,
  );
});

app.get('/authorized', (req, res) => {
  console.log('In authorized');

  if (req.error) {
    throw new Error(`Oh no! An error occured: "${req.error}"`);
  }

  const authorizationCode = req.query.code;

  const params = new URLSearchParams();
  params.append('grant_type', 'authorization_code');
  params.append('redirect_uri', redirect_uri);
  params.append('code', authorizationCode);

  fetch(`https://accounts.spotify.com/api/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      redirect_uri,
      Authorization: `Basic ${new Buffer.from(
        `${clientId}:${clientSecret}`,
      ).toString('base64')}`,
    },
    body: params,
    json: true,
  })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Got a non ok response');
    })
    .then(data => {
      process.env.accessToken = data.access_token;
      res.redirect('/accepted');
    });
});

app.get('/accepted', async (req, res) => {
  let songData;

  await fetch(
    `https://api.spotify.com/v1/me/player/currently-playing?market=from_token`,
    {
      method: 'GET',
      'Content-Type': 'application/json',
      headers: {
        Authorization: `Bearer ${process.env.accessToken}`,
      },
    },
  )
    .then(response => {
      if (response.status === 200) {
        return response.json();
      }

      if (response.status === 204) {
        return res.redirect('/not-playing');
      }
    })
    .then(data => {
      if (data) {
        songData = {
          title: data.item.name,
          artists: data.item.artists,
          isPlaying: data.is_playing,
          image: data.item.album.images[2],
        };

        res.render('playing', songData);
      }
    })
    .catch(err => {
      console.log(err);
    });
});

app.get('/not-playing', (req, res) => {
  // could suggest something to play now
  // or show them recently played
  res.render('notPlaying');
});

app.listen(3004, () => {
  console.log(`Example app listening at http://localhost:3004`);
});
