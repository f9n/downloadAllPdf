const request = require('request');
const cheerio = require('cheerio');
const chalk   = require('chalk');
const fs      = require('fs');
const figlet  = require('figlet');
const shell   = require('shelljs');
const CFonts  = require('cfonts');
const logSymbols = require('log-symbols');
//const ProgressBar = require('progress');
const events = require('events');
const eventEmitter = new events.EventEmitter();

const prettyFont = CFonts.render('All|Pdfs!', {
    font: '3d',           //define the font face
    align: 'left',        //define text alignment
    colors: ['yellow'],   //define all colors
    background: 'Black',  //define the background color
    letterSpacing: 1,     //define letter spacing
    lineHeight: 1,        //define the line height
    space: true,          //define if the output text should have empty lines on top and on the bottom
    maxLength: '0'        //define how many character can be on one line
});
const figletFont = chalk.yellow(
    figlet.textSync('All Pdfs', { horizontalLayout: 'full' })
);


/* Downloading with Events */

eventEmitter.on('main', () => {
  shell.exec('clear');
  console.log(prettyFont.string)
  console.log(chalk.blue(`${logSymbols.info} Program Starting With Events`));

  const domain  = "https://www.tutorialspoint.com";
  const url     = "https://www.tutorialspoint.com/tutorialslibrary.htm"
  const time    = parseInt(process.argv[2]) || 8000;
  var   index   = parseInt(process.argv[3]) || 0;

  eventEmitter.emit("scraping", domain, url, time, index); // with events
})

eventEmitter.on('scraping', (domain, url, time, index) => {
  let Links = [];
  console.log(chalk.blue(`${logSymbols.info} Scraping TutorialsPoint`))
  request(url, (error, response, html) => {
    if(!error) {
      const $ = cheerio.load(html);
      var a, title, href, data;
      $('ul.menu li').each(function(){
        data = $(this);
        a = data.children().first();
        title = a.attr('title');
        href = a.attr('href');
        href = domain + href;
        if(title != undefined) {
          Links.push({title: title, href: href});
        } else {
          //console.log("Links Length: " + Links.length + " Title: " + title + " Href: " + href);
        }
      });
    }
    console.log(chalk.blue(`${logSymbols.success} Finished Scraping!`));
    eventEmitter.emit("cleanup", Links);
    eventEmitter.emit("downloadFiles", Links, time, index);
    //downloadFilesWithSetInterval(Links, time, index);
  })
})

eventEmitter.on('cleanup', (Links) => {
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
})

eventEmitter.on('downloadFiles', (links, time, index) => {
  const linksLength = links.length;
  const staticIndex = index;
  var j = 0;
  eventEmitter.on('downloading', (link) => {
    index++;
    console.log(chalk.cyan(`[All]: ${linksLength} [Downloading]: ${index}  [Downloaded]: ${j} `) +
      logSymbols.warning + chalk.yellow(` Downloading  Title: ${chalk.red(link.title)} Link: ${link.href}`))
  })
  eventEmitter.on('downloaded', (link) => {
    j++;
    console.log(chalk.cyan(`[All]: ${linksLength} [Downloading]: ${index}  [Downloaded]: ${j} `) +
      logSymbols.success + chalk.green(` Downloaded   Title: ${chalk.red(link.title)} Link: ${link.href}`));
  })
  setInterval(() => {
    if(index != links.length) {
      eventEmitter.emit('downloadFile', links[index], linksLength, index, j)
    } else {
      console.log(chalk.blue(`${logSymbols.info} Program Ended and Waiting...`));
      if(links.length - staticIndex == j) {
        console.log("Ended!!!");
        process.exit(0);
      }
    }
  }, time );
})

eventEmitter.on('downloadFile', (link, linksLength, index, j) => {
  eventEmitter.emit('downloading', link);
  request
    .get(link.href)
    .on('response', function(resp) {
      console.log(typeof(resp.statusCode));
      if(resp.statusCode == 404) {
        console.log("Link is 404 Title:" + link.title + " Link:" + link.href);
      }
    })
    .pipe(fs.createWriteStream('./pdfs/' + link.href.split("/").pop()))
    .on('close', function(err) {
      eventEmitter.emit('downloaded', link);
    });
})



/* Downloading with Functions */
function Main() {
  shell.exec('clear');
  console.log(figletFont);
  console.log(chalk.blue(`${logSymbols.info} Program Starting with Functions`));

  const domain  = "https://www.tutorialspoint.com";
  const url     = "https://www.tutorialspoint.com/tutorialslibrary.htm"
  const time    = parseInt(process.argv[2]) || 8000;
  var   index   = parseInt(process.argv[3]) || 0;

  CrawlingAndDownloading(domain, url, time, index);
}

function CrawlingAndDownloading(domain, url, time, index) {
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
        if(title != undefined) {
          Links.push({title: title, href: href});
        } else {
          //console.log("Links Length: " + Links.length + " Title: " + title + " Href: " + href);
        }
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
    //downloadFiles(Links);
    downloadFilesWithSetInterval(Links, time, index);
  });
}

function downloadFile(link) {
  eventEmitter.emit('downloading', link)
  request
    .get(link.href)
    .on('response', function(resp) {
      console.log(typeof(resp.statusCode));
      if(resp.statusCode == 404) {
        console.log("Link is 404 Title:" + link.title + " Link:" + link.href);
      }
      //console.log(resp.headers["content-type"]);
    })
    .on('data', function(chunk) {
    })
    .pipe(fs.createWriteStream('./pdfs/' + link.href.split("/").pop()))
    .on('close', function(err) {
      eventEmitter.emit('downloaded', link);
    });
}

function downloadFilesWithSetInterval(links, time, index) {
  const staticIndex = index;
  var j = 0;
  /*
  eventEmitter.on('downloading', function(link) {
    index++;
    console.log(chalk.cyan(`[All]: ${links.length} [Downloading]: ${index}  [Downloaded]: ${j} `) +
      logSymbols.warning + chalk.yellow(` Downloading  Title: ${chalk.red(link.title)} Link: ${link.href}`))
  })
  eventEmitter.on('downloaded', function(link) {
    j++;
    console.log(chalk.cyan(`[All]: ${links.length} [Downloading]: ${index}  [Downloaded]: ${j} `) +
      logSymbols.success + chalk.green(` Downloaded   Title: ${chalk.red(link.title)} Link: ${link.href}`));
  })
  */
  setInterval(function() {
    if(index != links.length) {
      downloadFile(links[index]);
    } else {
      console.log(chalk.blue(`${logSymbols.info} Program Ended and Waiting...`));
      //console.log("Links.length :" + links.length + " type:" + typeof(links.length));
      //console.log("Index: " + staticIndex + " type:" + typeof(staticIndex))
      //console.log("J: " + j + " type:" + typeof(j));
      //console.log(links.length - staticIndex);
      if(links.length - staticIndex == j) {
        console.log("Ended!!!");
        process.exit(0);
      }
    }
  }, time );
}

/*
function downloadFilesSync(links) {
  var len = parseInt(resp.headers["content-length"], 10);
  bar = new ProgressBar(`Downloading ${link.title} [:bar] :rate/bps :percent :etas`, {
    complete: '=',
    incomplete: ' ',
    width: 20,
    total: len
  });
  bar.tick(chunk.length);
}
*/

/* Python style */
if(require.main == module) {
  //Main();
  eventEmitter.emit('main');
}

