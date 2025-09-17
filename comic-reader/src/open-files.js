import JSZip from "jszip";
"use strict";



var fs = require("fs");
var JSZip = require("jszip");



fs.readFile("AF 15 (2).zip", function(err, data) {
    if (err) throw err;
    JSZip.loadAsync(data).then(function (zip) {
        // ...
    });
});

