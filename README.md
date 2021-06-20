# About

This is an unofficial NPM Package which includes some functions from the Wix Data API by Wix. The purpose of this package is to use Wix Data (database collections) in a different environment (site or Node.js app). It uses HTTP requests to connect to Wix.

# Installation

`npm install uo-wix-data --save`

Check documentaiton for more steps.

# Documentation

On your wix site create a backend file called `http-functions.js` and inside it put the code that is in [uowd-http.js](https://github.com/PPTGames/uo-wix-data/blob/main/uowd-http.js).

**Example:**
```js
const wixData = require("uo-wix-data");
wixData.setup("username", "my-site", "foobar");

// Example
wixData.query("Users").eq("name", "John").find().then((result) => {
    console.log(result.items[0]);
});
```
