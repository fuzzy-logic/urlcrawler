# urlcrawler

Crawls a given Url and reutns structure of a web site.

# Getting Started

Steps to get project up and running...


## Dependencies

You'll need nodejs to run, if not installed you'll need to get it from here:

This project has been tested with node v4.6.0.

https://nodejs.org/en/download/

Once nodejs is working, install urlcrawler depenedencies with the following command:

```
npm install
```




## Run Tests

To take a closer look the tests are in ./test directory. Project source code in ./src Run the test by running the following command:

```
./node_modules/mocha/bin/mocha
```


## Running the crawler

Not yet implemented! TODO!


## Does this work?

Sort of :) Currently the test below proves with a mock web site that the crawler can crawl a very simple contrived website:

```
mocha test/UrlCrawlerTest.js -g 'crawls single hyperlink on each html resource starting from root url going 3 levels deep'
```


# Design tradeoffs, TODOs and improvements

* UrlCrawler.crawl(callback) fucntion somwhat redundant, ideally refactor our and simply ue CrawlUrl(url, callback)
* Crawling via recursive calls not ideal for large sites with many rsources, ideally add worker taking urls off queue 
* Page literal object in UrlCrawler should be defined as class object with tests
* Internal site link logic in HtmlParse far too simplisitic and won't work with link that don't start with leading '/'
* Convert callbacks (far too nested) to promises for improved readiability and comprehension  
* UrlCrawler parses dom object twice for child resources and again for hyperlinks - should do this once
* HtmlParser unable to parse dom in parallel as in memeory with js single thread
* http request stubbing with sinon a litlte awkward, couldn't find anything more succint for mocking http call & resources
* Have not tested crawling circular links
* Idealy set max depth to avoid issues crawling very deep site structures and running out of resources
* Have not enabled config to set an overall timeout and return what ever resources were retrieved
* have not set a per resource timeout for requests
* Have not set a configurable parameter to throttle crawling of sites   
* Have not written a simple shell script to run the crawler from the command line to conveniently output the site map
