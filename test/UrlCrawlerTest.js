
var chai = require('chai')
var expect = chai.expect
var should = chai.should();
var UrlCrawler = require('../src/UrlCrawler.js');
var superagent = require('superagent');
var sinon = require('sinon');





describe('UrlCrawler.js Tests: ', function() {

    it('calls back with expetcted resource response for given url request', function(done) {
        var url = 'http://site/';
        var html = '<html> <head> </head> <body> a simple page </body> </html>';
        var stub = stubSuperAgent(url, html);
        var urlCrawler = new UrlCrawler(url, superagent);

        urlCrawler.request(function(err, response) {
          expect(response.content).to.equal(html);
          expect(stub.called).to.equal(true);
          expect(stub.calledWith(url)).to.equal(true);
          done();
        });
    });

});



/**
 * Stub Super agent 'get' to return test data
 */
function stubSuperAgent(url, html) {
  var httpApi = {
    get: function() {
      return this;
    },
    end: function(cb) {
        cb(null, {headers: {}, text: html});
    }
  }
  var stub = sinon.stub(superagent, 'get').withArgs(url).returns(httpApi);
  return stub;
}
