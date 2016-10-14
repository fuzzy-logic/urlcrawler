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
       callback(err, {url: url, headers: response.headers, content: response.text});
     });
   }

   /**
    * Start crawling site from root url given in contructor
    *
    * @param {function} callback - callback function to return crawled resources
    */
   crawl(callback) {
     var _this = this;
      var pages = {};
      _this.request(_this.rootUrl, function(err, response1) {
          pages[_this.rootUrl] = response1;
          htmlParser.extractLinks(response1.content, {}, function(links) {
              var responses = 0;
              for (var i in links) {
                  var link = links[i];
                  _this.request(link, function(err, response2) {
                      responses++;
                      pages[response2.url] = response2;
                      if (responses == links.length) callback(null, pages);
                  });
              }
          });
      });
      //
   }
}





module.exports = UrlCrawler;
