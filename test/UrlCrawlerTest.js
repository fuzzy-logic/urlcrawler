
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

        // Stub http agent request for url http://testsite/ with content from file three-hyperlinks.html
        var stub = sandbox.stub(superagent, 'get');
        stubResource(stub, url, 'three-hyperlinks.html');
        var urlCrawler = new UrlCrawler(url, superagent);

        // Call crawler and assert test expectations
        urlCrawler.request(url, function(err, response) {
          // assert content matches html in three-hyperlinks.html file loaded by stubbed html agent via sinon
          expect(response.content).to.contain('<html>');
          expect(response.content).to.contain('<title>sample test page</title>');
          expect(response.content).to.contain('</html>');
          expect(stub.called).to.equal(true);
          expect(stub.calledWith(url)).to.equal(true);
          done();
        });
    });

    it('crawls 3 hyperlinks from root url resource 1 level deep', function(done) {
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

          // assert that the stubbed http agent was called with rootUrl and returns expected content
          expect(stub.calledWith(rootUrl)).to.equal(true);
          expect(results[rootUrl].content).to.contain('<title>sample test page</title>');

          // assert that the stubbed http agent was called with /link1 found in rootUrl html and returns expected content
          expect(stub.calledWith(link1)).to.equal(true);
          expect(results[link1].content).to.contain('<title>link 1</title>');

          // etc.. /link2 as above
          expect(stub.calledWith(link2)).to.equal(true);
          expect(results[link2].content).to.contain('<title>link 2</title>');

          // etc.. /link3 as above
          expect(stub.calledWith(link3)).to.equal(true);
          expect(results[link3].content).to.contain('<title>link 3</title>');

          done();
        });
    });


    it('crawls single hyperlink on each html resource starting from root url going 3 levels deep', function(done) {
        var page1 = 'http://testsite/page1';
        var page2 = '/page2';
        var page3 = '/page3';

        // Structure of hyoper links in resources: page1 -> page2 -> page3
        // If this test passes we have retieved a simple contrived structuce of the site
        var stub = sandbox.stub(superagent, 'get');
        stubResource(stub, page1, 'page1.html');
        stubResource(stub, page2, 'page2.html');
        stubResource(stub, page3, 'page3.html');

        var urlCrawler = new UrlCrawler(page1, superagent);
        urlCrawler.crawl(function(err, results) {

          expect(stub.calledWith(page1)).to.equal(true);
          expect(results[page1].content).to.contain('<title>page 1</title>');
            // assert that page1 has expected child resources to reflect structure of site
          expect(results[page1].resources).to.have.lengthOf(3);
          expect(results[page1].resources).to.contain('/page2');
          expect(results[page1].resources).to.contain('/page3');
          expect(results[page1].resources).to.contain('/js/script1.js');

          expect(stub.calledWith(page2)).to.equal(true);
          expect(results[page2].content).to.contain('<title>page 2</title>');
            // assert that page2 has expected child resources to reflect structure of site
          expect(results[page2].resources).to.have.lengthOf(2);
          expect(results[page2].resources).to.contain('/page3');
          expect(results[page2].resources).to.contain('/js/script2.js');

          expect(stub.calledWith(page3)).to.equal(true);
          expect(results[page3].content).to.contain('<title>page 3</title>');
          // assert that page3 has expected child resources to reflect structure of site
          expect(results[page3].resources).to.have.lengthOf(1);
          expect(results[page3].resources).to.contain('/js/script3.js');


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
