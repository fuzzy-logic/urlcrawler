"use strict";

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
     this.http.get(url).end(function(err, response) {
       callback(err, {headers: response.headers, content: response.text});
     });
   }
}



module.exports = UrlCrawler;
