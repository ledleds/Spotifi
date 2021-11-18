# Spotifi

Just playing around with an electron app to manage Spotify in the toolbar for Mac.

It uses the [Authorization Code Flow](https://developer.spotify.com/documentation/general/guides/authorization/code-flow/) to gain access to a users Spotify currently playing and playback states.

## Setup

You'll need to create an app in Spotify's developer Portal, [here](https://developer.spotify.com/).
With this you can populate the secrets below.

Your app in Spotify will need the following redirect URLs: 

http://localhost:3004/authorized

http://localhost:3004/accepted

## Required Environment Variables

**clientId**: ID of your app in Spotify

**clientSecret**: Secret for your app in Spotify

## Running

`npm start`
