//http://www.antartica.cl/antartica/servlet/LibroServlet?action=searchLibros&busqueda=shirley
var host = 'http://www.antartica.cl';
var uri = '/antartica/servlet/LibroServlet?action=searchLibros&busqueda=';
var url = host + uri;

var cheerio = require('cheerio');
var utils = require('./utils');
var debug = require('debug')('bs:antartica.cl');


module.exports.getResults = function getResults(keyword) {
  var searchUrl = url + keyword;
  debug('search url', searchUrl);

  return utils.loadPage(searchUrl)
    .then(parseUrls)
    .then(utils.loadPages)
    .then(parseResults);
};


function parseUrls(html) {
  $ = cheerio.load(html);

  var urls = [];

  $('.txtTitulosSubCategoria').each(function() {
    urls.push(host + $(this).attr('href'));
  });

  debug('results urls', urls);

  return urls;
}


function parseResults(pages) {
  return pages.map(parseResult);
}


function parseResult(html) {
  $ = cheerio.load(html);

  var data = {
    ISBN: $('.txt .txt').eq(1).text().replace('ISBN:', '').trim(),
    Autor: $('.editorial a').text().trim(),
    Title: $('.txtTitulosRutaSeccionLibros').eq(0).text().trim(),
    Number_pages: parseInt($('.txt .txt').eq(2).text().replace('Número de páginas:', '').trim(), 10)
  };

  debug('result data', data);

  return data;
}