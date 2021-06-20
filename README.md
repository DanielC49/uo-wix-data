# About

This is an unofficial NPM Package which includes some functions from the Wix Data API by Wix. The purpose of this package is to use Wix Data (database collections) in a different environment (site or Node.js app). It uses HTTP requests to connect to Wix.

# Installation

`npm install uo-wix-data --save`

# Documentation

```js
const wixData = require("./index.js");
wixData.setup("username", "my-site", "foobar");

// Example
wixData.query("Users").eq("name", "John").find().then((result) => {
    console.log(result.items[0]);
});
```
