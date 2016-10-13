
var chai = require('chai')
var expect = chai.expect
var should = chai.should();
var htmlParser = require('../src/HtmlParser.js');
var fs = require('fs');



describe('HtmlParserTest.js Tests: ', function() {
  
    it('extracts multiple <a href> hyperlinks', function(done) {
        loadHtml('three-hyperlinks.html', function(html) {
          htmlParser.extractLinks(html, function(links) {
            expect(links).to.have.lengthOf(3);
            expect(links).to.include('/l1');
            expect(links).to.include('/l2');
            expect(links).to.include('/l3');
            done();
          });
        });

    });

    it('extracts multiple resource type links', function(done) {
        loadHtml('multi-resource-links.html', function(html) {
          htmlParser.extractLinks(html, function(links) {
            expect(links).to.have.lengthOf(9);
            expect(links).to.include('/l1');
            expect(links).to.include('/l2');
            expect(links).to.include('/l3');
            expect(links).to.include('/js/script1.js');
            expect(links).to.include('/js/script2.js');
            expect(links).to.include('/js/script3.js');
            expect(links).to.include('/img/logo-sml.png');
            expect(links).to.include('/img/logo-med.png');
            expect(links).to.include('/img/logo-lrg.png');
            done();
          });

        });
    });
});


function loadHtml(filename, callback) {
  fs.readFile(__dirname + '/../test-resources/html/' + filename, function (err, data) {
  if (err) {
    throw err;
  }
  callback(data);
  });
}
