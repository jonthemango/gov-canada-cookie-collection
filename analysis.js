const fs = require("fs")
var moment = require('moment');

let rawdata = fs.readFileSync('output.json');
let data = JSON.parse(rawdata);

let urls = Object.keys(data);
let url;
let key
let rows = `<tr style="font-weight: bold"><td>URL</td> <td>Number of Cookies</td> <td>Cookies</td></tr>`
for (let i=0; i<urls.length; i++){
    key = urls[i]

    url = key.replace("JSHandle:","");
    numberOfCookies = data[key]["numberOfCookies"]

    let cookie;
    let cookieRow = `<tr style="font-weight: bold"><td>Size</td> <td>Expiry Date</td> <td>Secure</td> <td>Session</td></tr>`
    for (let j=0; j<data[key]["cookies"].length; j++){
        cookie = data[key]["cookies"][j];
        cookieRow += `<tr><td>${cookie.size}</td> <td>${moment.unix(cookie.expires).format('MMMM Do YYYY, h:mm:ss a')}</td> <td>${cookie.secure}</td> <td>${cookie.session}</td></tr>`
    }
    cookieRow = `<table class="table">${cookieRow}</table>`
    rows += `<tr> 
            <td><a href="${url}" >${url}</a></td>
            <td>${numberOfCookies}</td>
            <td>${cookieRow}</td>
           </tr>`

}
fs.writeFile('results.html', 
`<head><link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous"></head>
<table class="table">${rows}</table>`, ()=>{})
console.log(rows)