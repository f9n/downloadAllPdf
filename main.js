const request = require('request');
const cheerio = require('cheerio');

console.log("[+] Program Starting");

const url = "https://www.tutorialspoint.com/tutorialslibrary.htm"

request(url, (error, response, html) => {
  let Links = [];
  if(!error){
    const $ = cheerio.load(html);
    var a, title, href, data;
    $('ul.menu li').each(function(){
      data = $(this);
      a = data.children().first();
      title = a.attr('title');
      href = a.attr('href');
      Links.push({title: title, href: href});
    });
  }
  console.log(Links);
});
