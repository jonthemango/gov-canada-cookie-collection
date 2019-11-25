const puppeteer = require('puppeteer')
const fs = require("fs")


const getCookies = async (url, browser) => {
    try{
        page = await browser.newPage()
        await page.goto(url)
        const cookies = await page.cookies()
        //console.log(url, cookies)
        await page.close()
        return cookies
    } catch (error){
        return {error}
    }

}

(async () => {
    browser = await puppeteer.launch({headless: false}) // launch chrome
    const context = await browser.createIncognitoBrowserContext();
    page = await browser.newPage() // create a new page
    await page.goto("https://www.canada.ca/en/government/dept.html") // visit the government of Canada website for departments
    links = await page.$$('td > a') // get all links in the page
    let cookies = {} // cookie object
    sum = 0 
    for (let i=0; i<links.length; i++){ // for each link tag, get its href property, go to the site, and get its cookies, compute the average cookies
        link = links[i];
        link = await link.getProperty("href")
        cookies[link] = {}
        cookies[link]["cookies"] = await getCookies(link._remoteObject.value, context)
        cookies[link]["numberOfCookies"] = {} 
        cookies[link]["numberOfCookies"] = cookies[link]["cookies"].length;
        sum += cookies[link]["numberOfCookies"]
        cookies["SUMMARY"] = {
            "totalCookies": sum,
            "averageCookies": sum / (i+1) 
        }
        fs.writeFile('./myfile', JSON.stringify(cookies), (er)=> { // write to a file 
            console.log("error",er);
        })
    }
    await browser.close()
    return cookies
    
})().then(cookies => {
    
}).catch(err => {
    console.log(err, "err")
}).finally(_=>{

})

