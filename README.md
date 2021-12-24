# About

This is an unofficial NPM Package which includes some functions from the Wix Data API by Wix. The purpose of this package is to use Wix Data (database collections) in a different environment (site or Node.js app). It uses HTTP requests to connect to Wix.

# Installation

`npm install uo-wix-data --save`

Check documentaiton for more steps.

# Documentation

## Getting started

**1.** Create a Wix site (blank template) and enable Developer mode.
**2.** On your wix site create a backend file called `http-functions.js` (if not created already) and inside it put the code from [uowd-http.js](https://github.com/PPTGames/uo-wix-data/blob/main/uowd-http.js).
**3.** In `const wdToken = "1234";` replace `1234` with your secret token.
**4.** On your Node.JS file import uo-wix-data with `const wixData = require("uo-wix-data")` and set up `wixData.setup("username", "my-site", "token")` replacing `username` with your wix username, `my-site` with your site name and `token` with your secret token.

## Example:
```js
const wixData = require("uo-wix-data");
wixData.setup("username", "my-site", "foobar");

// Example
wixData.query("Users").eq("name", "John").find().then((result) => {
    console.log(result.items[0]);
});
```
