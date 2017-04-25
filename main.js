const request = require('request');
const cheerio = require('cheerio');
const chalk   = require('chalk');
const fs      = require('fs');
const figlet  = require('figlet');
const shell   = require('shelljs');
const CFonts  = require('cfonts');
const logSymbols = require('log-symbols');

const prettyFont = CFonts.render('All|Pdfs!', {
  font: '3d',        //define the font face
	align: 'left',        //define text alignment
	colors: ['yellow'],   //define all colors
	background: 'Black',  //define the background color
	letterSpacing: 1,     //define letter spacing
	lineHeight: 1,        //define the line height
	space: true,          //define if the output text should have empty lines on top and on the bottom
	maxLength: '0'        //define how many character can be on one line
})

shell.exec('clear');
console.log(prettyFont.string)
/*
console.log(
  chalk.yellow(
    figlet.textSync('All Pdfs', { horizontalLayout: 'full' })
  )
);
*/

console.log(chalk.blue(`${logSymbols.info} Program Starting`));

const domain = "https://www.tutorialspoint.com";
const url = "https://www.tutorialspoint.com/tutorialslibrary.htm"

function Main(domain, url) {
  let Links = [];
  console.log(chalk.blue(`${logSymbols.info} Scraping TutorialsPoint`))
  request(url, (error, response, html) => {
    if(!error){
      const $ = cheerio.load(html);
      var a, title, href, data;
      $('ul.menu li').each(function(){
        data = $(this);
        a = data.children().first();
        title = a.attr('title');
        href = a.attr('href');
        href = domain + href;
        Links.push({title: title, href: href});
      });
    }
    console.log(chalk.blue(`${logSymbols.success} Finished Scraping!`));
    console.log(chalk.blue(`${logSymbols.info} Clean Up the links`));
    var lastSlashIndex, niceLink, value;
    for(let link of Links) {
      lastSlashIndex = link.href.lastIndexOf('/');
      niceLink = link.href.substr(0, lastSlashIndex)
      link.href = niceLink;
      lastSlashIndex = link.href.lastIndexOf('/');
      value = link.href.substr(lastSlashIndex);
      link.href = link.href + value + '_tutorial.pdf';
    }
    //console.log(Links);
    console.log(chalk.yellow(`${logSymbols.warning} Downloading Pdfs...`))
    //downloadFile(Links[0].href)
    //downloadFiles(Links);
    downloadFilesWithSetInterval(Links);
  });
}

function downloadFile(link) {
    //console.log(link);
    //console.log(link.split("/"));
    //console.log(link.split("/").pop());
    console.log(logSymbols.success + chalk.green(` Downloaded  Title: ${chalk.red(link.title)} Link: ${link.href}`))
    intervalId = setInterval(function() { process.stdout.write('.'); }, 1000);
    request(link.href)
      .pipe(fs.createWriteStream(link.href.split("/").pop()))
      .on('close', function(err) {
        process.stdout.write('done!\n');
        clearInterval(intervalId);
      });
}
function downloadFiles(links) {
    for(let link of links) {
        downloadFile(link.href);
    }
}

function downloadFilesWithSetInterval(links) {
  var i = 0;
  setInterval(function() {
    downloadFile(links[i]);
    i++;
  }, 8000 );
}

Main(domain, url);

