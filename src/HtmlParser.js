var cheerio = require('cheerio');
var async = require('async');

/**
 * Extract resource links from html dom
 *
 * Tradeoffs/Improvements; TODO
 *
 * @param {string} html - url to request
 * @param {function} clientCallback - callback function to return parsed links as {array} of {string}s
 */
module.exports.extractLinks = function(html, clientCallback) {

  var $dom = cheerio.load(html);
  var links = [];
  async.series([
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


/**
 *  Iterate over dom and add links for given reosurce types
 *
 * @param {dom} dom - url to request
 * @param {object} params - object to specifcy dom element and attirbutes to extract links params.ele & params.attrib
 * @param {links} links - array of links to add discovered resource urls in dom to
 * @param {function} callback - callback function to return when done
 */
function parseDom(dom, params, links, callback) {
  var numOfElements =  dom(params.ele).length;
  if (numOfElements <= 0) callback();
  dom(params.ele).each(function(index, ele) {
  var link = dom(ele).attr(params.attrib);
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
