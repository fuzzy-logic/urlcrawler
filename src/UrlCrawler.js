"use strict";


class UrlCrawler {

   constructor(url, http) {
       this.rootUrl = url;
       this.http = http;
   }

   request(callback) {
     this.http.get(this.rootUrl).end(function(err, response) {
       callback(err, {headers: response.headers, content: response.text});
     });
   }
}



module.exports = UrlCrawler;
