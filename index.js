
//Please uncomment and install dependencies before running this code
//Github does not accept copy of Chromium, its a large file
//const puppeteer = require('puppeteer');
const xlsx = require("xlsx");
const fs = require('fs');

//When the steps are complete, this will display in the terminal window
run().then(() => console.log('Done')).catch(error => console.log(error));


async function run() {
  // Create a new browser. By default, the browser is headless,
  // which means it runs in the background and doesn't appear on
  // the screen. Setting `headless: false` opens up a browser
  // window so you can watch what happens.

const browser = await puppeteer.launch({ headless: false, args: ['--start-fullscreen']});


//Creates a new Window
const page = await browser.newPage();

//Navigates to the required page
const url = await page.goto('https://www.unspsc.org/search-code');


const code = ["42182007", "12161500", "42182009", "42182010", "42182011", "42182012"];


/*
///Amirjon need your help to fix this. If possible this should read from an excel file rows or as a JSON object.
for(let i = 0; i < code.length; i++) {
  const search = await page.type("#dnn_ctr1535_UNSPSCSearch_txtsearchCode", code[i], {delay: 100} );
  console.log(code[i]);
}
/*

/*

function findByIndex(index) {
  return index === 1
}

let myPosition = code.find((index) => findByIndex(index));

console.log(myPosition);


*/
//Clicks the search code field
await page.click("#dnn_ctr1535_UNSPSCSearch_txtsearchCode");

const search = await page.type("#dnn_ctr1535_UNSPSCSearch_txtsearchCode", code[1], {delay: 100} );

await page.click("#dnn_ctr1535_UNSPSCSearch_btnSearch");

await new Promise(resolve => setTimeout(resolve, 1000));

//const response = await page.goto('https://www.unspsc.org/search-code');

// Display UNSPSC Code details
const unspscCodeVal =  await page.$eval('#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView td', el => el.innerText);
console.log('UNSPSC Code: ' + unspscCodeVal); // Shows search results

// Display UNSPSC Title details
const unspscTitleVal =  await page.$eval('#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView td:nth-child(2)', el => el.innerText);
console.log('Description name: ' + unspscTitleVal); // Shows search results


//await page.waitForSelector('#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView')
//let element = await page.$('td')
//let value = await page.evaluate(el => el.textContent, element)

//console.log('This should show contents of td:' + )

///show td data
/*
await new Promise(resolve => setTimeout(resolve, 2000));
const textDataArr = await page.evaluate(() => {
    const element = document.querySelector('#dnn_ctr1535_UNSPSCSearch_gvDetailsSearchView td'); // select thrid row td element like so
    return element && element.innerText; // will return text and undefined if the element is not found
});
console.log(textDataArr);
*/

console.log('Did you see the TD results?!');

await new Promise(resolve => setTimeout(resolve, 1000));

//Once the search is done and the results are displayed creates the excel tables
//Creates two columns UNSPSC Code and Description and stores it in ws_data

var ws_name = "UNSPSC.xlsx";

/* make worksheet */
var ws_data = [
  [ "UNSPSC Code", "Description"],
  [unspscCodeVal, unspscTitleVal]
];

//save to xlsx file
const wb = xlsx.utils.book_new();
const ws = xlsx.utils.aoa_to_sheet(ws_data);
xlsx.utils.book_append_sheet(wb,ws);
xlsx.writeFile(wb, ws_name);

await new Promise(resolve => setTimeout(resolve, 1000));

//await page.tracing.start();
//await page.goto(url);

//const trace = JSON.parse(await page.tracing.stop());

await browser.close();
}
