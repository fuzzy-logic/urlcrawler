"use strict";

var htmlParser = require('../src/HtmlParser.js');

/**
 * Crawl a website from given url
 *
 * @constructor
 * @param {string} url - root url to star crawling from
 * @param {string} http - superagent object require('superagent');
 */
class UrlCrawler {



   constructor(url, http) {
       this.rootUrl = url;
       this.http = http;
       this.pages = {};
   }

   /**
    * Request an indivudual resource via url
    *
    * @param {string} url - url to request
    * @param {function} callback - callback function to return url resource as response
    */
   request(url, callback) {
     //console.log('request() url=' + url);
     this.http.get(url).end(function(err, response) {
       callback(err, {url: url, headers: response.headers, content: response.text, resources: []});
     });
   }

   /**
    * Start crawling site from root url given in contructor
    *
    * @param {function} callback - callback function to return crawled resources
    */
   crawl(callback) {
     var _this = this;
     var cb = function() {
       logger.debug('******** crawl() all links retrievied, done.');
       callback(null, _this.pages);
     }
     this.crawlUrl(_this.rootUrl, cb);
   }

   /**
    * Start crawling hyperlinks from given url
    * @param {string} url - url to start crawling from
    * @param {function} callback - callback function to return crawled resources (with no parameters)
    */
   crawlUrl(link, clientCallback) {
     logger.debug('crawlUrl() link=' + link);
     logger.debug('crawlUrl() pages=' + Object.keys(this.pages).length);
     var _this = this;
      _this.request(link, function(err, response) {
          _this.pages[link] = response;
          // Extract links to all resource types eg: hyperlinks, scripts, images and add as child resources to page
          htmlParser.extractLinks(response.content, {}, function(links) {
              var responses = 0;
              var page = _this.pages[response.url];
              for (var link in links) {
                page.resources.push(links[link]);
              }
          });

          // Extract just links to only <a href> hyperlinks to crawl recursively
          htmlParser.extractLinks(response.content, {a: 'href'}, function(links) {
              var responses = 0;
              for (var i in links) {
                  var link = links[i];
                  _this.crawlUrl(link, function() {
                      responses++;
                      if (responses == links.length) clientCallback();
                  });
              }
              if (links.length == 0 ) clientCallback();
          });

      });
   }
}





module.exports = UrlCrawler;
