
//Please install dependencies before running and testing this code with Nodejs (v16.9.1)
const puppeteer = require('puppeteer');
const fs = require('fs');


var codes = [];
var resultsObj = {};
var resultsArr = [];
var errors = {};

fs.readFile('input.csv', 'utf8', function(err, data){
    if (err) { console.log(err); }
    codes = data.match(/\d+/ig);
	console.log(data, codes);
	//When the steps are complete, this will display in the terminal window
	run().then(() => {		
		console.log(resultsObj, errors);
		var csv = "UNSPSC Code,Description\n" + resultsArr.reduce((x,y)=> x+"\n"+y);
		fs.writeFile("output.csv", csv, (err) => {
		  if (err) {console.log(err);}
		  console.log("Written to ./output.csv");
		});
	}).catch(error => console.log(error));
});

async function run() {
  // Create a new browser. By default, the browser is headless,
  // which means it runs in the background and doesn't appear on
  // the screen. Setting `headless: false` opens up a browser
  // window so you can watch what happens.

const browser = await puppeteer.launch({ headless: false, args: ['']});

//Creates a new Window
const page = await browser.newPage();

//Navigates to the required page
const url = await page.goto('https://www.unspsc.org/search-code');

/*
// request interception - ignore this for now
await page.setRequestInterception(true);
const search = await page.type("#dnn_ctr1535_UNSPSCSearch_txtsearchCode", codes[0], {delay: 100} );
await page.click("#dnn_ctr1535_UNSPSCSearch_btnSearch");
const xRequest = await new Promise(resolve => {
    page.on('request', interceptedRequest => {
        interceptedRequest.abort();     //stop intercepting requests
        resolve(interceptedRequest);
    });
});
console.log(xRequest);
*/

for (let i=0; i < codes.length; i++){
	var counter = 0;
	try {
		await page.goto('https://www.unspsc.org/search-code');
		await page.click("#dnn_ctr1535_UNSPSCSearch_txtsearchCode");
		const search = await page.type("#dnn_ctr1535_UNSPSCSearch_txtsearchCode", codes[i], {delay: 100} );
		await page.click("#dnn_ctr1535_UNSPSCSearch_btnSearch");
		await page.waitForSelector("#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView td", {timeout: 2000});
		//await page.waitForNavigation();
		const unspscCodeVal =  await page.$eval('#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView td', el => el.innerText);
		const unspscTitleVal =  await page.$eval('#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView td:nth-child(2)', el => el.innerText);
		console.log('UNSPSC Code: ' + unspscCodeVal, '\tDescription name: ' + unspscTitleVal); // Shows search results
		resultsObj[codes[i]] = [unspscCodeVal, unspscTitleVal];
		resultsArr.push([unspscCodeVal, unspscTitleVal]);
	} catch (e) {
		await page.goto('https://www.unspsc.org/search-code');
		//const res = await page.$eval("#dnn_ctr1535_UNSPSCSearch_txtsearchCode", el => {el.value="";} );
		errors[codes[i]] = [e]
	}
}
await browser.close();
}
