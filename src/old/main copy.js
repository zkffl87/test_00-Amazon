/**
 * This example demonstrates how to use PuppeteerCrawler in combination with RequestQueue
 * to recursively scrape Hacker News website (https://news.ycombinator.com)
 * using headless Chrome / Puppeteer.
 * The crawler starts with a single URL, finds links to next pages,
 * enqueues them and continues until no more desired links are available.
 * The results are stored to the default dataset. In local configuration,
 * the results are stored as JSON files in `./apify_storage/datasets/default`
 */

const Apify = require('apify');
const app = require('../pageprocessor');

Apify.main(async () => {

    console.log(`Starting AmazonScraper actor`);
    
    const input = await Apify.getValue('INPUT');

    if (!input || !input.url) throw new Error('INPUT must contain url and searchPhrase or category');
    var includepaging = input.includepaging;

    if (input.searchPhrase)
    {
        let searchUrl = input.url + encodeURIComponent(input.searchPhrase);
        console.log(`Searching from phrase ${searchUrl}`);            
        await app.ProcessPhrase(searchUrl, includepaging);
        // await app.ProcessPagedUrls();
        await app.ProcessItems();
    }
    else if (input.categoryurl) {
        console.log(`Searching from category ${input.categoryurl}`);            
        var outputUrls = await app.ProcessCategories(input.categoryurl);
        await app.ProcessSubCategory(outputUrls, includepaging);
        // await app.ProcessPagedUrls();
        await app.ProcessItems();
    }
    else {
        throw new Error('INPUT must contain either searchPhrase or category');
    }

    // QA Scripts
    // const requestQueue = await Apify.openRequestQueue();
    // await requestQueue.addRequest(new Apify.Request({ url: "https://www.amazon.com/dp/B06VVB64ZN/ref=pantry_car_hybr_sut1ome?fpw=pantry", userData: { sourceUrl: "", pagetype: "ITEM_PAGE" } }));
    // await requestQueue.addRequest(new Apify.Request({ url: "https://www.amazon.com/Babyganics-Mineral-Sunscreen-Stick-47oz/dp/B00H48JXNG", userData: { sourceUrl: "", pagetype: "ITEM_PAGE" } }));
    // await requestQueue.addRequest(new Apify.Request({ url: "https://www.amazon.com/Nutrivein-Liposomal-Glutathione-Setria%C2%AE-600mg/dp/B07RR81H3Y", userData: { sourceUrl: "", pagetype: "ITEM_PAGE" } }));
    // await app.ProcessItems();

});
