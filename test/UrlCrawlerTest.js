
var chai = require('chai')
var expect = chai.expect
var should = chai.should();
var UrlCrawler = require('../src/UrlCrawler.js');
var superagent = require('superagent');
var sinon = require('sinon');
var fs = require('fs');





describe('UrlCrawler.js Tests: ', function() {

  var sandbox;

  beforeEach(function () {
      // use sinon sandboxes to ensure each test has own fixture data
      sandbox = sinon.sandbox.create();
  });

  afterEach(function () {
      // reset sinon after each test
      sandbox.restore();
  });

    it('calls back with expetcted resource response for given url request', function(done) {
        var url = 'http://testsite/';
        var stub = sandbox.stub(superagent, 'get');
        stubResource(stub, url, 'three-hyperlinks.html');
        var urlCrawler = new UrlCrawler(url, superagent);

        urlCrawler.request(url, function(err, response) {
          expect(response.content).to.contain('<html>');
          expect(response.content).to.contain('<title>sample test page</title>');
          expect(response.content).to.contain('</html>');
          expect(stub.called).to.equal(true);
          expect(stub.calledWith(url)).to.equal(true);
          done();
        });
    });

    it('crawls hyperlinks in resource and returns all links and content', function(done) {
        var rootUrl = 'http://testsite/';
        var link1 = '/link1';
        var link2 = '/link2';
        var link3 = '/link3';

        var stub = sandbox.stub(superagent, 'get');
        stubResource(stub, rootUrl, 'three-hyperlinks.html');
        stubResource(stub, link1, 'link1.html');
        stubResource(stub, link2, 'link2.html');
        stubResource(stub, link3, 'link3.html');

        var urlCrawler = new UrlCrawler(rootUrl, superagent);
        urlCrawler.crawl(function(err, results) {

          expect(stub.calledWith(rootUrl)).to.equal(true);
          expect(results[rootUrl].content).to.contain('<title>sample test page</title>');

          expect(stub.calledWith(link1)).to.equal(true);
          expect(results[link1].content).to.contain('<title>link 1</title>');

          expect(stub.calledWith(link2)).to.equal(true);
          expect(results[link2].content).to.contain('<title>link 2</title>');

          expect(stub.calledWith(link3)).to.equal(true);
          expect(results[link3].content).to.contain('<title>link 3</title>');

          done();
        });
    });

});



/**
 * Stub Super agent 'get' to return test data
 */
function stubResource(stub, url, file) {
  var httpApi = {
    get: function() {
      return this;
    },
    end: function(cb) {
      fs.readFile(__dirname + '/../test-resources/html/' + file, function read(err, data) {
        if (err) {
            throw err;
        }
        cb(null, {headers: {status: 200}, text: data.toString()});
      });
    }
  }
  stub.withArgs(url).returns(httpApi);
  return stub;
}
