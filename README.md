In order to run this app:
 
- Install [node.js](https://nodejs.org/en/).
- Clone the repository.
- Install dependencies using `npm install`.
- [Get a bearer token](https://home-assistant.io/components/wink/) for your Wink account.
- Find the lightbulb ID by making the following request and looking for `light_bulb_id`:

```
http -b https://winkapi.quirky.com/users/me/wink_devices "Authorization:Bearer your-bearer-token"
```

- Find the player identifier for the player you want to connect it with.
- Run like this:
 
 ```
 BEARER=bearer-token BULB=bulb-id PLAYER=player-identifier node index.js
 ```
 
- Add the webhook to https://app.plex.tv/web/app#!/account/webhooks
