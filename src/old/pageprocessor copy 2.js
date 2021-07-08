"use strict";

const Apify = require("apify");
const { log } = Apify.utils;

log.setLevel(log.LEVELS.OFF);

/**
 * ProcessItems: Process page items
 */
async function ProcessItems() {
    const requestQueue = await Apify.openRequestQueue();
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchPuppeteerOptions: { 
            useApifyProxy: true,
            stealth: true,
            headless: true,
            // sloMo: 2500,
            apifyProxySession: `amzn_${Math.floor(Math.random() * 100000000)}`,
            userAgent: Apify.utils.getRandomUserAgent()
        },
        // maxRequestsPerCrawl: 10,
        handlePageFunction: async ({ request, page }) => {

            await page.waitFor(2000);
            await Apify.utils.puppeteer.injectJQuery(page);

            if (request.userData.pagetype == "ITEM_PAGE") {
                console.log(`Processing page ${request.url} ..`);

                // A function to be evaluated by Puppeteer within the browser context.
                const pageFunction = (context) => {

                    function ProcessData() {
                        const data = [];
    
                        var itemName = $("#productTitle").text();
                        var itemBrand = "";
                        var itemPrice = "";
                        var itemImage = $("#imgTagWrapperId img").attr("src");
                        var itemImages = [];
                        var itemDescription = $("#productDescription p").text();
                        var itemAsin = "";
                        var itemModelNum = "";
                        var itemWeight = "";
                        var itemProductDetails = $(".prodDetTable .a-size-base").text();
                        var additionalOption = []; // $("#variation_color_name li img.imgSwatch").attr("alt");
                        var itemRetailPrice = $(".priceBlockStrikePriceString").text(); //Price before discount
                        var additionalOptionText = "";
                        var additionalOptionPriceText = "";
                        var additionalOptionPrice = [];
                        var hasAdditionalOptionPrice = false;
                        var itemSellerCode = $("#sellerProfileTriggerId").text();
                        var itemShippingType = "";
                        var itemProductDimensions = "";
                        var itemImportantInfo = "";
                        var itemUPC = "";
                        var item_options_price = "";
                        var itemProductDescription = "";
                        var itemSalesStatus = "";
                        var itemFromTheManufacturer = "";
                        var html = $('body').html();

                        if ($("#availability span").length) {
                            itemSalesStatus = $("#availability span").text().trim();
                        }

                        if ($("#priceblock_ourprice").length) {
                            itemPrice = $("#priceblock_ourprice").text();
                        }

                        // Get Additional Option Price if it is listed on the page
                        $(".twisterSwatchPrice").each(function() {
                            additionalOptionPrice.push($(this).text().trim());
                            hasAdditionalOptionPrice = true;
                        });

                        $("#variation_color_name li img.imgSwatch").each(function() {

                            additionalOptionText = $(this).attr("alt");
                            additionalOption.push(additionalOptionText);

                            // if (hasAdditionalOptionPrice == false) {

                            //     var $btn = $(this).closest("button");
                            //     $btn.trigger("click");
                            //     // $(this).closest("button").trigger("click");

                            //     var additionalOptionPriceFromAttr = 0;

                            //     // Introduce sync delay to get content. (Tried setTimeOut as well)
                            //     for(var loopI=0; loopI < 5000; loopI++) {
                            //         additionalOptionPriceFromAttr = "" + $("#cerberus-data-metrics").attr("data-asin-price");
                            //     }
    
                            //     additionalOptionPrice.push(additionalOptionPriceFromAttr);
                            // }
                        });

                        var additionalOptionSize = [];
                        $("#variation_size_name .a-size-base").each(function() {
                            var prodSize = $(this).text();
                            additionalOptionSize.push(prodSize);
                        });

                        $(".imageThumbnail").each(function(imageThumbnailIndex, imageThumbnailObj) {
                            $(imageThumbnailObj).trigger("click");
                        });
    
                        var $itemImagesNode = $("li.image");
                        
                        $itemImagesNode.each(function(imgNodeCount, imgItemNode) {
                            var imgItemNodeItem = $(imgItemNode).find("img").attr("src");
                            itemImages.push(imgItemNodeItem);
                        })

                        itemName = $.trim(itemName.replace(/[\t\n]+/g,' '));
                        itemDescription = $.trim(itemDescription.replace(/[\t\n]+/g,' '));
                        // itemAsin = $.trim(itemAsin.replace(/[\t\n]+/g,' '));
    
                        itemProductDetails = itemProductDetails.split("\n");
    
                        var isAsin = false;
                        var isModelNum = false;
                        var isItemWeight = false;
                        var isProductDimensions = false;

                        for (itemPdI = 0; itemPdI < itemProductDetails.length; itemPdI++) { 
    
                            if (isAsin == true) {
                                var itemAsinData = itemProductDetails[itemPdI].trimStart();
                                
                                if (itemAsinData != "") {
                                    itemAsin = itemAsinData;
                                    isAsin = false;
                                }
                            }
                            else if (isModelNum == true) {
                                var itemModelNumData = itemProductDetails[itemPdI].trimStart();
                                
                                if (itemModelNumData != "") {
                                    itemModelNum = itemModelNumData;
                                    isModelNum = false;
                                }
                            }
                            else if (isItemWeight == true) {
                                var itemWeightData = itemProductDetails[itemPdI].trimStart();
                                
                                if (itemWeightData != "") {
                                    itemWeight = itemWeightData;
                                    isItemWeight = false;
                                }
                            }
                            else if (isProductDimensions == true) {
                                var itemProductDimensionsData = itemProductDetails[itemPdI].trimStart();
                                
                                if (itemProductDimensionsData != "") {
                                    itemProductDimensions = itemProductDimensionsData;
                                    isProductDimensions = false;
                                }
                            }
    
                            if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "asin") {
                                isAsin = true;
                            }
                            else if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "item model number") {
                                isModelNum = true;
                            }
                            else if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "item weight") {
                                isItemWeight = true;
                            }    
                            else if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "product dimensions") {
                                isProductDimensions = true;
                            }    
                        }

                        if ($("#importantInformation").length) {
                            itemImportantInfo = $("#importantInformation").text();
                            itemImportantInfo = itemImportantInfo.trim();
                            itemImportantInfo = $.trim(itemImportantInfo.replace(/[\t\n]+/g,' '));
                            //$("#importantInformation").textContent;
                        }

                        if ($("#detail-bullets table div.content li").length) {
                            var $prd_detail = $("#detail-bullets table div.content li");
                            $prd_detail.each(function(nodeCount, itemNode) {
                                var item_title = $(itemNode).find("b").text().trim();
                                if (item_title == "Product Dimensions:") {
                                    itemProductDimensions = $(itemNode).text();
                                    itemProductDimensions = itemProductDimensions.replace("Product Dimensions:", "").trim()
                                }
                                else if (item_title == "Shipping Weight:") {
                                    itemWeight = $(itemNode).text();
                                    itemWeight = itemWeight.replace("Shipping Weight:", "").trim()
                                    itemWeight = itemWeight.replace("(View shipping rates and policies)", "")
                                }
                                else if (item_title == "ASIN:") {
                                    itemAsin = $(itemNode).text();
                                    itemAsin = itemAsin.replace("ASIN:", "").trim()
                                }
                                else if (item_title == "UPC:") {
                                    itemUPC = $(itemNode).text();
                                    itemUPC = itemUPC.replace("UPC:", "").trim()
                                }
                                
                            });
                        }             

                        if ($(".twisterImages .twisterSlotDiv").length) {
                            $(".twisterImages .twisterSlotDiv").each(function(nodeTwCount, itemTwNode) {
                                if (item_options_price == "") {
                                    item_options_price = $(itemTwNode).text().trim();
                                }
                                else {
                                    item_options_price = item_options_price + ";" + $(itemTwNode).text().trim();
                                }
                                item_options_price = $.trim(item_options_price.replace(/[\t\n]+/g,' '));
                                item_options_price = item_options_price.split(" ").join("");
                            });
                        }

                        if ($("#feature-bullets").length) {
                            itemProductDescription = $("#feature-bullets").text();
                            itemProductDescription = $.trim(itemProductDescription.replace(/[\t\n]+/g,' '));
                        }

                        if ($("#pantryBadge").length) {
                            itemShippingType = "Prime Pantry " + itemShippingType;
                        }

                        if ($("#bylineInfo").length) {
                            itemBrand = $("#bylineInfo").text();
                        }

                        if ($("#mbc").length) {
                            itemBrand = $("#mbc").attr("data-brand");
                        }
        
                        if (!itemShippingType || itemShippingType === undefined) { itemShippingType = ""; }
                        
                        if($(".apm-top").length) {
                            $(".apm-top").each(function(apmIndex, apmObj) {
                                itemFromTheManufacturer = itemFromTheManufacturer + " " + $(apmObj).text().trim();
                            });

                            itemFromTheManufacturer = $.trim(itemFromTheManufacturer.replace(/[\t\n]+/g,' '));
                            itemFromTheManufacturer = itemFromTheManufacturer.split("               ").join(" ");
                            // itemFromTheManufacturer = itemFromTheManufacturer.replace(/\s/g, " ");
                        }

                        data.push({
                            itemUrl: window.location.href,
                            ItemTitle: itemName,
                            ItemPrice: itemPrice,
                            StandardImage: itemImage,
                            OtherImages: itemImages,
                            ItemDescription: itemDescription,
                            Category: '',
                            ItemQty: '',
                            ExpireDate: '',
                            BrandName: itemBrand,
                            IndustrialCode: '',
                            AdditionalOption: additionalOption,
                            AdditionalOptionSize: additionalOptionSize,
                            AdditionalOptionPrice: additionalOptionPrice,
                            RetailPrice: itemRetailPrice,
                            ItemCode: itemAsin,
                            ManufactureDate: '',
                            ModelNm: itemModelNum,
                            Weight: itemWeight,
                            ShippingType: itemShippingType,
                            ProductSize: itemProductDimensions,
                            SellerCode: itemSellerCode,
                            Material: '',
                            Asin: itemAsin,
                            ProductDescription: itemProductDescription,
                            ImportantInformation: itemImportantInfo,
                            UPC: itemUPC,
                            OptionPrice: item_options_price,
                            SalesStatus: itemSalesStatus,
                            FromTheManufacturer: itemFromTheManufacturer,
                            pgdta: html
                        });
        
                        return data;        
                    }

                    setTimeout(dataOutput=ProcessData(), 5000);
                    return dataOutput;
                };
    
                const data = await page.$$eval(".s-result-list .a-section", pageFunction);
                // data request.userData.shippingtype
                
                // Check if this is a blocked request
                if (data[0].pgdta.includes("Sorry! Something went wrong on our end.") || data[0].pgdta.includes("To discuss automated access to Amazon data please contact api-services-support@amazon.com")) {
                    // console.log(data[0].pgdta);
                    throw "Error"
                }
                else {
                    data[0].pgdta = "";
                }



                if (request.userData.shippingtype) {
                    data[0].ShippingType = request.userData.shippingtype + " " + request.userData.shippingtype;
                }
                
                // Store the results to the default dataset.
                await Apify.pushData(data);
            }
            else if (request.userData.pagetype == "CATEGORY_PAGING") {
                console.log(`Processing paging pages ${request.url} ..`);
                await ProcessPhrase(request.url, false);
            }
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed too many times`);
            await Apify.pushData({
                '#debug': Apify.utils.createRequestDebugInfo(request),
            });
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    console.log('Crawler finished.');
}

/**
 * Process Sub Categories
 * @param {string} urls 
 */
async function ProcessSubCategory(urls, getPaging) {
    for (const url of urls) { 
        await ProcessPhrase(url, getPaging);
    }
}

/**
 * Extract item urls for all pages
 */
async function ProcessPagedUrls() {
    const requestQueue = await Apify.openRequestQueue();
    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchPuppeteerOptions: { headless: true },
        // maxRequestsPerCrawl: 10,
        handlePageFunction: async ({ request, page }) => {
            if (request.userData.pagetype == "CATEGORY_PAGING") {
                console.log(`Processing paging pages ${request.url} ..`);
                await ProcessPhrase(request.url, false);
            }
        },
        handleFailedRequestFunction: async ({ request }) => {
            console.log(`Request ${request.url} failed too many times`);
            await Apify.pushData({
                '#debug': Apify.utils.createRequestDebugInfo(request),
            });
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();

    console.log('Crawler finished.');
}

/**
 * Process phrases
 * @param {string} startUrl 
 */ 
async function ProcessPhrase(startUrl, getPaging) {
    const env = await Apify.getEnv()
    const input = [{
        "url": startUrl
    }]

    const requestQueue = await Apify.openRequestQueue();
    const requestList = new Apify.RequestList({
        sources: input,
    });
    await requestList.initialize();

    const crawler = new Apify.CheerioCrawler({
        requestList,
        minConcurrency: 10,
        maxConcurrency: 50,
        maxRequestRetries: 2,
        useApifyProxy: true,
        handlePageTimeoutSecs: 60,        
        handlePageFunction: async ({ request, html, $ }) => {
            console.log(`ProcessPhrase: Cheerio Processing ${request.url} ..`);

            if (html.indexOf("Sorry! Something went wrong on our end.") > -1 || html.indexOf("To discuss automated access to Amazon data please contact api-services-support@amazon.com") > -1) {
                console.log(`Info: Website is blocked..`)
                throw "Error"
            }

            var data = [];

            var $itemRowContainer = $(".s-result-list .a-section");
            
            $itemRowContainer.each(function(nodeCount, itemNode) {
                var itemUrl = $(itemNode).find(".sg-row:nth-child(2)").find(".sg-col-inner").find("a.a-link-normal").attr("href");
                var itemShippingType = $(itemNode).find(".a-icon-prime").attr("aria-label");
                if (!itemShippingType) { itemShippingType = ""; }

                data.push({Url: itemUrl, ShippingType: itemShippingType});
            });

            // var itemUrl = $(itemNode).find("h2 a").attr("href");
            //     // var itemUrl = $(itemNode).find(".sg-row:nth-child(2)").find(".sg-col-inner").find("a.a-link-normal").attr("href");
            //     var itemShippingType = $(itemNode).find(".a-icon-prime").attr("aria-label");

            for (const itemData of data) {
                var prdUrl = "https://www.amazon.com" + itemData.Url;
                var itemShippingType = itemData.ShippingType

                if (itemData && itemData.Url) {
                    await requestQueue.addRequest(new Apify.Request({ url: prdUrl, userData: { sourceUrl: prdUrl, pagetype: "ITEM_PAGE", shippingtype: itemShippingType } }));
                }
            }

            // Paging
            if (getPaging) {
                var lastpgNode = $(".a-pagination .a-last").prev();
                var lastpg = lastpgNode.text();
                var pgIndex = [];
    
                for (var pgI=2; pgI <= lastpg; pgI++ ) {
                    pgIndex.push(pgI);
                }
    
                // Add paging urls to the queue
                for (const pgIdx of pgIndex) {
                    prdUrl = request.url + "&page=" + pgIdx;
                    await requestQueue.addRequest(new Apify.Request({ url: prdUrl, userData: { sourceUrl: prdUrl, pagetype: "CATEGORY_PAGING" } }));
                }    
            }
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({ request, error }) => {
            console.log(`Request ${request.url} failed multiple times. ${error}`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();
}

/**
 * Process categories
 * @param {string} startUrl 
 */
async function ProcessCategories(startUrl) {
    const env = await Apify.getEnv()
    const input = [{
        "url": startUrl
    }]

    var outputUrls = [];

    // const requestQueue = await Apify.openRequestQueue();

    const requestList = new Apify.RequestList({
        sources: input,
    });
    await requestList.initialize();

    // Create an instance of the CheerioCrawler class - a crawler
    // that automatically loads the URLs and parses their HTML using the cheerio library.
    const crawler = new Apify.CheerioCrawler({

        // Let the crawler fetch URLs from our list.
        requestList,

        // The crawler downloads and processes the web pages in parallel, with a concurrency
        // automatically managed based on the available system memory and CPU (see AutoscaledPool class).
        // Here we define some hard limits for the concurrency.
        minConcurrency: 10,
        maxConcurrency: 50,

        // On error, retry each page at most once.
        maxRequestRetries: 1,

        // Increase the timeout for processing of each page.
        handlePageTimeoutSecs: 60,

        // This function will be called for each URL to crawl.
        // It accepts a single parameter, which is an object with the following fields:
        // - request: an instance of the Request class with information such as URL and HTTP method
        // - html: contains raw HTML of the page
        // - $: the cheerio object containing parsed HTML
        handlePageFunction: async ({ request, html, $ }) => {
            console.log(`ProcessCategories: Cheerio Processing ${request.url} ..`);

            $("#merchandised-content .a-column a").each(function(){
                var prdUrl = "https://www.amazon.com" + $(this).attr("href");
                outputUrls.push(prdUrl);
            });
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async ({ request, error }) => {
            console.log(`Request ${request.url} failed twice. ${error}`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();
    return outputUrls;
}

module.exports = {
    ProcessPhrase: ProcessPhrase,
    ProcessCategories: ProcessCategories,
    ProcessSubCategory: ProcessSubCategory,
    ProcessPagedUrls: ProcessPagedUrls,
    ProcessItems: ProcessItems,
}
