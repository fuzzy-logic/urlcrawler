var cheerio = require('cheerio');
var async = require('async');
var logger = require('sexylog');

/**
 * Extract resource links from html dom
 *
 * Tradeoffs/Improvements; TODO
 *
 * @param {string} html - url to request
 * @param {function} clientCallback - callback function to return parsed links as {array} of {string}s
 */
module.exports.extractLinks = function(html, types, clientCallback) {

  var $dom = cheerio.load(html);
  var links = [];
  var parseTypeFunctions = [];
  if (! types || Object.keys(types).length <= 0) {
    types = {a: 'href', script: 'src', img: 'src'};
  }
  logger.trace('extractLinks() types=', JSON.stringify(types));
  var  i = 0;
  for (var ele in types) {

      var createParserCallForElement = function(elementName, attribute)  {
        return function(asyncCallback) {
          parseDom($dom, {ele: elementName, attrib: attribute}, links, asyncCallback);
        }
      }
      parseTypeFunctions[i++] = createParserCallForElement(ele, types[ele]);
  }
  logger.trace('extractLinks() parseTypeFunctions=', JSON.stringify(parseTypeFunctions));
  async.series(parseTypeFunctions, function(err, results) {
    logger.debug('extractLinks() done. links=', JSON.stringify(links));
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

  logger.trace('parseDom(), params=' + JSON.stringify(params));
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


function createParserCallForElement() {

}

function isInternalLink(hyperlink) {
  if (hyperlink && hyperlink.indexOf('/') === 0) {
    return true;
  }
  return false;
}
