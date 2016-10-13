var cheerio = require('cheerio');

module.exports.extractLinks = function(html) {
  var links = [];
  var $ = cheerio.load(html);
  var hrefs = $('a');
  for (var i = 0 ; i < hrefs.length ; i++) {
      var link = hrefs[i].attribs.href;
      if (isInternalLink(link)) {
        links.push(link);
      }
  }
  return links;
}

function isInternalLink(hyperlink) {
  if (hyperlink && hyperlink.indexOf('/') === 0 && hyperlink.indexOf('http') !== 0) {
    return true;
  }
  return false;
}
