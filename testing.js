const wixData = require("./index.js")
    .setup("pptgamespt", "example-site", "foobar");

wixData.bulkInsert("Accounts", [
    {
        name: "Jeremy",
        points: 10
    },
    {
        name: "Laura",
        points: 25
    }
]).then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
});