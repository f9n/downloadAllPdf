const request = require('request');
const cheerio = require('cheerio');

console.log("[+] Program Starting");

const domain = "https://www.tutorialspoint.com";
const url = "https://www.tutorialspoint.com/tutorialslibrary.htm"

function Main(domain, url) {
  let Links = [];
  console.log('[+] Scraping TutorialsPoint')
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
    console.log(Links);
  });
}

Main(domain, url);

