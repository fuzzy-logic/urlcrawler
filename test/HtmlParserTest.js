
var chai = require('chai')
var expect = chai.expect
var should = chai.should();
var htmlParser = require('../src/HtmlParser.js');



var chai = require('chai')
var expect = chai.expect
var should = chai.should();
var UrlCrawler = require('../src/UrlCrawler.js');
var superagent = require('superagent');
var sinon = require('sinon');





describe('HtmlParserTest.js Tests: ', function() {

    it('extracts <a href> hyperlinks', function() {
        var html = '<html> <head> </head> <body>  <a href="/l1">link1<a> <a href="/l2">link2<a> <a href="/l3">link3<a> </body> </html>';
        var links = htmlParser.extractLinks(html);
        expect(links).to.have.lengthOf(3);
        expect(links).to.include('/l1');
        expect(links).to.include('/l2');
        expect(links).to.include('/l3');
    });
});
