var request = require('superagent');
var Q = require('q');

function loadPage(url) {
  var deferred = Q.defer();

  request.get(url).end(function(error, response) {
    if (error) {
      deferred.reject(new Error(error));
    } else {
      deferred.resolve(response.text);
    }
  });

  return deferred.promise;
}

function loadPages(urls){
  var promises = [];

  urls.forEach(function(url) {
    promises.push(loadPage(url));
  });

  return Q.all(promises);
}

module.exports.loadPage = loadPage;
module.exports.loadPages = loadPages;