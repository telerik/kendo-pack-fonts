#! /usr/bin/env node

var fs = require("fs");

var MIME = "application/x-font-ttf";
var FONTS = JSON.parse(fs.readFileSync("fonts.json", { encoding: "utf8" }));

function generate(spec) {
    var buffer = fs.readFileSync(spec.src);
    var data = buffer.toString("base64");
    return `\
(function(n,d,s){\
while(n>0)d[--n]=s.charCodeAt(n);\
document.write("\
@font-face{\
font-family:'${spec.fontFamily}';\
font-weight:${spec.fontWeight};\
font-style:${spec.fontStyle};\
src:url('"+URL.createObjectURL(new Blob([d],{type:"${MIME}"}))+"')format('truetype');\
}\\n");\
})(${buffer.length},new Uint8Array(${buffer.length}),atob("${data}"));`;
}

console.log("%s", "document.write('<style>');");
FONTS.forEach(function(font){
    console.log("%s", generate(font));
});
console.log("%s", "document.write('</style>');");
