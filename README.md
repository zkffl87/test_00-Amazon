# Amazon Scraper
This scraper crawls through the pages based on either searchPhrase. If searchPhrase is present in the input then it takes that. To include all the pages under paging (eg. page 2, 3 etc) set the value of includepaging to true. This will however take a longer time to crawl.    

```
{
    "url": "https://www.amazon.com/s?k=",
    "searchPhrase": "iphone 6s 64gb",
    "includepaging": false
}
```