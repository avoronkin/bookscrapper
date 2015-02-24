//http://www.gandhi.com.mx/catalogsearch/result/?q=9786071106377
var host = 'http://www.gandhi.com.mx/';
var uri = 'catalogsearch/result/?q=';
var url = host + uri;

var cheerio = require('cheerio');
var utils = require('./utils');
var Q = require('q');
var debug = require('debug')('bs:gandhi.com.mx');


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

  $('.products-grid .item').each(function() {
    var link = $(this).children('.product-name').children('a').attr('href');
    links.push(link);
  });

  return links;
}


function parseResults(pages) {
  return pages.map(parseResult);
}


function parseResult(html) {
  $ = cheerio.load(html);
  var data = {};
  data.Title = $('.product-name').text().trim();

  var $table = $('#product-attribute-specs-table');
  var $infos = $table.find('tr');


  $infos.each(function() {
    var text = $(this).text();
    debug($(this).text());
    if (text.search("ISBN") + 1) {
      data.ISBN = text.replace('ISBN', '').trim();
    }
    if(text.search("Autor") + 1){
      data.Autor = text.replace('Autor', '').trim();
    }
    if(text.search("Número de páginas") + 1){
      data.Number_pages = parseInt(text.replace('Número de páginas', '').trim(), 10);
    }
  });

  return data;
}