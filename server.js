var site1 = require('./gandhi.com.mx');
var site2 = require('./casadellibro.com');
var site3 = require('./antartica.cl');
var Q = require('q');
var express = require('express');
var app = express();

app.get('/', function(req, res) {
  var keyword = req.query.q;
  if (!keyword) {
    res.json({
      'error': 'no q query'
    });
  } else {
    Q.all([site1.getResults(keyword),
        site2.getResults(keyword),
        site3.getResults(keyword)
      ])
      .then(function(results) {
        var data = {};

        data['gandhi.com.mx'] = results[0];
        data['casadellibro.com'] = results[1];
        data['antartica.cl'] = results[2];

        res.json(data);
      }).fail(function(error) {
        res.json({
          'error': error
        });
      });
  }



});



var server = app.listen(process.env.PORT || 3000, function() {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});