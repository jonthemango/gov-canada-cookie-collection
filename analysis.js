const fs = require("fs")
var moment = require('moment');

let rawdata = fs.readFileSync('output.json');
let data = JSON.parse(rawdata);

let urls = Object.keys(data);
let url;
let key
let rows = `<tr style="font-weight: bold"><thead><td scope="col">URL</td> <td scope="col">Number of Cookies</td> <td scope="col">Cookies</td></tr></thead>`

let sum = 0;
let maxCookies = {value:0, url: ""};
let maxSize = {value:0, url: "", name: ""};
let maxExpiry = {value: 0, url: "", name: ""};

for (var i=0; i<urls.length; i++){
    key = urls[i]

    url = key.replace("JSHandle:","");
    numberOfCookies = data[key]["numberOfCookies"]
    if (numberOfCookies != undefined) sum += numberOfCookies;
    if (numberOfCookies > maxCookies.value) {
        maxCookies = {value: numberOfCookies, url}
    }

    let cookie;
    let cookieRow = `<thead><tr style="font-weight: bold"><td>Name</td><td scope="col">Size</td> <td scope="col">Expiry Date</td> <td scope="col">Secure</td> <td scope="col">Session</td></tr></thead>`
    for (let j=0; j<data[key]["cookies"].length; j++){
        cookie = data[key]["cookies"][j];
        if (cookie.size > maxSize.value){
            maxSize = {value: cookie.size, url, name: cookie.name}
        }
        
        if (cookie.expires != -1) expires = moment.unix(cookie.expires).format('MMMM Do YYYY, h:mm:ss a')
        else expires = "When Session Ends"
        if (cookie.expires > maxExpiry.value){
            maxExpiry = {url, value: cookie.expires, name: cookie.name};
        }
        cookieRow += `<tr><td>${cookie.name}</td><td>${cookie.size}</td> <td>${expires}</td> <td>${cookie.secure}</td> <td>${cookie.session}</td></tr>`
    }
    cookieRow = `<table class="table table-striped">${cookieRow}</table>`
    rows += `<tr> 
            <td><a href="${url}" >${url}</a></td>
            <td>${numberOfCookies}</td>
            <td>${cookieRow}</td>
           </tr>`
}
fs.writeFile('results.html', 
`<head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></head>
<div class="container">
<ul class="list-group">
  <li class="list-group-item">Average Cookies: ${sum/i}</li>
  <li class="list-group-item">URL with most cookies: ${maxCookies.value}<br> <a href="${maxCookies.url}">${maxCookies.url}</a></li>
  <li class="list-group-item">URL with largest cookie value: ${maxSize.value}<br> Name: ${maxSize.name} <br> <a href="${maxSize.url}">${maxSize.url}</a></li>
  <li class="list-group-item">URL with largest expiry date: ${moment.unix(maxExpiry.value).format('MMMM Do YYYY, h:mm:ss a')}<br> Name: ${maxExpiry.name} <br><a href="${maxExpiry.url}">${maxExpiry.url}</a> </li>
</ul>
<table class="table">${rows}</table></div>`, ()=>{})
console.log(rows)