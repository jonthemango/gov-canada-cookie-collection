const fs = require("fs")


let rawdata = fs.readFileSync('output.json');
let data = JSON.parse(rawdata);

let urls = Object.keys(data);
let url;
let key
let rows = `<tr style="font-weight: bold"><td>URL</td> <td>Number of Cookies</td></tr>`
for (let i=0; i<urls.length; i++){
    key = urls[i]

    url = key.replace("JSHandle:","");
    numberOfCookies = data[key]["numberOfCookies"]
    rows += `<tr> 
            <td>${url}</td>
            <td>${numberOfCookies}</td>
           </tr>`

}
fs.writeFile('results.html', `<table>${rows}</table>`, ()=>{})
console.log(rows)