//http://www.casadellibro.com/busqueda-generica?busqueda=9788408136644
var host = 'http://www.casadellibro.com';
var uri = '/busqueda-generica?busqueda=';
var url = host + uri;

var cheerio = require('cheerio');
var utils = require('./utils');
var debug = require('debug')('bs:casadellibro.com');


module.exports.getResults = function getResults(keyword) {
  var searchUrl = url + keyword;
  debug('search url', searchUrl);


  return utils.loadPage(searchUrl)
    .then(parseLinks)
    .then(utils.loadPages)
    .then(parseResults);
};


function parseLinks(html) {
  $ = cheerio.load(html);

  var links = [];

  $('.mod-list-item').each(function() {
    var link = host + $(this).children('.txt').children('.title-link').attr('href');
    links.push(link);
  });

  return links;
}


function parseResults(pages) {
  debug('parseResults');
  var data = [];
  pages.forEach(function(html) {
    if (parseResult(html)) {
      data.push(parseResult(html));
    }
  });

  return data;
}


function parseResult(html) {
  $ = cheerio.load(html);
  var data = {};
  $('.book-header-2-title-device').html('');
  data.Title = $('.list-pag .book-header-2 .book-header-2-title').text().trim();
  data.Autor = $('.list-pag .book-header-2 .book-header-2-subtitle-author').text().trim();

  var $info = $('.list-pag .book-header-2-info');
  var $leftInfo = $info.children('.left');
  var $leftInfoItems = $leftInfo.find('li');

  $leftInfoItems.each(function() {
    var text = $(this).text();
    debug($(this).text());
    if (text.search("ISBN") + 1) {
      data.ISBN = text.replace('ISBN:', '').trim();
    }
    if (text.search("Nº de páginas:") + 1) {
      data.Number_pages = parseInt(text.replace('Nº de páginas:', '').replace('págs.', '').trim(), 10);
    }
  });

  if (!data.Title) {
    data = false;
  }

  return data;
}