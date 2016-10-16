# urlcrawler

Crawls a given Url and returns the structure of a web site.

# Getting Started


## Dependencies

You'll need nodejs to run, if not installed you'll need to get it from here:

This project has been tested with node v4.6.0.

https://nodejs.org/en/download/

Once nodejs is working, install urlcrawler depenedencies with the following command:

```
npm install
```




## Run Tests

To take a closer look the tests are in ./test directory. Project source code is in ./src 

TO run the tests execute the following command:

```
./node_modules/mocha/bin/mocha
```


## Running the crawler from the command line

Not yet implemented! TODO!


## Does this work?

Not really :) Currently the test below passes with mock web site structure demonstrating that the crawler can crawl a very simple contrived website:

```
./node_modules/mocha/bin/mocha test/UrlCrawlerTest.js -g 'url going 3 levels deep'
```


# Design tradeoffs, TODOs and improvements

* UrlCrawler.crawl(callback) function somwhat redundant, ideally refactor our and simply ue CrawlUrl(url, callback)
* Recursive crawling for large sites with many hyperlinks potentially resource intensive, ideally add workers taking urls off queue for better scalability and scheduling
* In case of failure with no error handling in Url Crawler results will not be returned
* Literal object in UrlCrawler to represent page/resource should ideally be defined as a Resource class with corresponding tests
* UrlCrawler crawl methods on class are public, should be made private functions and return a resource object in callbacks
* Resource class could behave as recusrsive node in tree structure 
* Ideally also create a Site object with convenience methods to navigate structure from root Resource node
* Internal  link logic in HtmlParser too simplisitic and won't work with links that don't start with leading '/'
* Convert (rats-)nested callbacks to promises for improved readiability and comprehension  
* UrlCrawler parses dom object twice for child resources and again for hyperlinks - should do this once
* HtmlParser parses dom object several times to get various links types, could use dom stream parses to improve speed
* http request stubbing with sinon a little awkward, couldn't find anything more succint for mocking http call & resources
* Have not tested crawling circular links
* Idealy set max depth to avoid issues crawling very deep site structures and running out of resources
* Enabled config item to set an overall timeout and return any resources retrieved within timeout
* Set a per resource timeout for requests
* Set a configurable parameter to throttle crawling of sites to reduce site resource consumption  
* Write a simple shell script to run the crawler from the command line to conveniently output the site map
* Only tested happy path in unit tests with more time would add tests for exceptiom paths
