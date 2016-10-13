var cheerio = require('cheerio');
var async = require('async');

/**
 * Parse HTML data and return linked resources for web crawling
 *
 */
module.exports.extractLinks = function(html, clientCallback) {

  var $dom = cheerio.load(html);
  var links = [];
  async.parallel([
      function(asyncCallback) {
        parseDom($dom, {ele: 'a', attrib: 'href'}, links, asyncCallback);
      },
      function(asyncCallback) {
        parseDom($dom, {ele: 'script', attrib: 'src'}, links, asyncCallback);
      },
      function(asyncCallback) {
        parseDom($dom, {ele: 'img', attrib: 'src'}, links, asyncCallback);
      }
  ], function(err, results) {
      clientCallback(links);
  });
}

function parseDom($dom, params, links, callback) {
  var numOfElements =  $dom(params.ele).length;
  if (numOfElements <= 0) callback();
  $dom(params.ele).each(function(index, ele) {
  var link = $dom(ele).attr(params.attrib);
  if (isInternalLink(link)) {
    links.push(link);
  }
  if (index ==  numOfElements -1) {
    callback();
  }
});
}




function isInternalLink(hyperlink) {
  if (hyperlink && hyperlink.indexOf('/') === 0) {
    return true;
  }
  return false;
}
