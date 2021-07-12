"use strict";

const Apify = require("apify");
const { log } = Apify.utils;


// 사용자 전역 변수.
const timestamp = new Date().getTime();
const urlBox = [];

// ZNS test
function getRandomInt(min, max) { //min ~ max 사이의 임의의 정수 반환
    return Math.floor(Math.random() * (max - min)) + min;
}

Number.prototype.zeroPad = function() {
    return ('0' + this).slice(-2);
};
// 사용자 전역 변수.

log.setLevel(log.LEVELS.OFF);

/**
 * ProcessItems: Process page items
 */
async function ProcessItems() {
    console.log("테스트22222");

    const requestQueue = await Apify.openRequestQueue();
    var optionDebug = false; // ZNS test
    var ForgrundItemOptionData = [];
    // if( optionDebug ) await Apify.pushData({"debug": 1});

    const input = await Apify.getValue('INPUT');
    if (input.debug) {
        optionDebug = true; // ZNS test
    }

    const crawler = new Apify.PuppeteerCrawler({
        requestQueue,
        launchPuppeteerOptions: {
            useApifyProxy: !optionDebug,
            useChrome: false,
            headless: true,
            stealth: true,
        },
        minConcurrency: 1,
        maxConcurrency: 1,
        handlePageTimeoutSecs: 1800,
        launchPuppeteerFunction: (opts) => {
            //opts.userAgent = Apify.utils.getRandomUserAgent();
            opts.userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";

            return Apify.launchPuppeteer(opts);
        },
        useSessionPool: true,
        sessionPoolOptions: {
            sessionOptions: {
                maxErrorScore: 1,
                errorScoreDecrement: 0,
            }
        },
        handlePageFunction: async({ request, page }) => {
            console.log(request);
            console.log(page);

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

                        // 제트앤에스 추가 2020-07-14  추가
                        if (!itemImage) {
                            itemImage = $("#imgBlkFront").attr("src");
                        }

                        if (!itemProductDetails.length) {
                            itemProductDetails = $("#descriptionAndDetails .a-list-item").text();
                            //html = itemProductDetails;
                        }

                        // 제트앤에스 추가 2020-07-15  상세설명 추가
                        if (!itemProductDetails.length) {
                            itemProductDetails = $('td[class="bucket"] div[class="content"]').text();
                            //html = itemProductDetails;
                        }


                        // 제트앤에스 추가 2020-04-13  상세설명 추가
                        var ItemDescription_ty1 = ItemDescription_ty2 = ItemDescription_ty3 = ItemDescription_ty4 = "";
                        if ($("#feature-bullets .a-unordered-list li").length > 0) {

                            $("#feature-bullets .a-unordered-list li").not("#replacementPartsFitmentBullet").each(function() {
                                var desc_cont = $(this).text().trim();
                                ItemDescription_ty1 += "<p>" + desc_cont + "</p>"; //상세설명1
                            });

                        }
                        // 제트앤에스 추가 2020-04-13  상세설명 추가
                        if ($("#aplus_feature_div div.aplus-v2").length > 0) {
                            ItemDescription_ty2 = $("#aplus_feature_div div.aplus-v2").html(); // 상세설명 2
                        }
                        ItemDescription_ty3 = "<div>" + $("#productDescription p").text() + "</div>";

                        // 제트앤에스 추가 2020-07-14  상세설명 추가
                        if ($("#bookDesc_iframe").length > 0) {
                            ItemDescription_ty4 = $("#bookDesc_iframe").contents().find("body").html(); // 상세설명 4
                        }

                        var itemDescription = "<div>" + ItemDescription_ty1 + "</div>" + "<div>" + ItemDescription_ty2 + "</div>" + "<div>" + ItemDescription_ty3 + "</div>" + "<div>" + ItemDescription_ty4 + "</div>";
                        //console.log(itemDescription);


                        // 허웅 - 이모티콘 제거 추가.
                        itemDescription = $.trim(
                            itemDescription.replace(/[\t\n]+/g, ' ').replace(/([#0-9]\u20E3)|[\xA9\xAE\u203C\u2047-\u2049\u2122\u2139\u3030\u303D\u3297\u3299][\uFE00-\uFEFF]?|[\u2190-\u21FF][\uFE00-\uFEFF]?|[\u2300-\u23FF][\uFE00-\uFEFF]?|[\u2460-\u24FF][\uFE00-\uFEFF]?|[\u25A0-\u25FF][\uFE00-\uFEFF]?|[\u2600-\u27BF][\uFE00-\uFEFF]?|[\u2900-\u297F][\uFE00-\uFEFF]?|[\u2B00-\u2BF0][\uFE00-\uFEFF]?|(?:\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDEFF])[\uFE00-\uFEFF]?/g, '')
                        );


                        var itemSalesStatusType = "";
                        if ($("#availability span").length > 0) {
                            itemSalesStatus = $("#availability span").text().trim();

                            if(itemSalesStatus.indexOf("Currently unavailable") == -1){
                              //판매상태
                              itemSalesStatusType = "Y";
                            }else{
                              //판매중단 상태
                              itemSalesStatusType = "N";
                            }
                        }


                        var priceTest1 = "";
                        var priceTest2 = "";
                        var priceTest3 = "";
                        var priceTest4 = "";
                        var priceTest5 = "";
                        var priceTest6 = "";
                        var priceTest7 = "";
                        var priceTest8 = "";
                        var priceTest9 = "";
                        var priceTest10 = "";
                        var priceTest11 = "";
                        var priceTest12 = "";
                        var priceTest13 = "";

                        if ($("#priceblock_ourprice").length > 0) {
                            var tmp = $("#priceblock_ourprice").text();
                            if (tmp.match("-") !== null) {
                                var tmp2 = tmp.split("-");
                                itemPrice = tmp2['1'].replace(/\$|￥|,|From/g, '').trim();
                                priceTest1 = itemPrice;
                            } else {
                                itemPrice = tmp.replace(/\$|￥|,|From/g, '').trim();
                                priceTest2 = itemPrice;
                            }
                        }



                        //제트앤에스 추가 2020-07-14  추가
                        if (!itemPrice) {
                            console.log("itemPrice1");
                            itemPrice = $("#priceblock_saleprice").text().replace(/\$|￥|,/g, '').replace(/\$|￥|,/g, '').trim();
                            priceTest3 = itemPrice;
                        }

                        if (!itemPrice) {
                          console.log("itemPrice2");
                            itemPrice = $("#newBuyBoxPrice").text().replace(/\$|￥|,/g, '').replace(/\$|￥|,/g, '').trim();
                            priceTest4 = itemPrice;
                        }

                        // 제트앤에스 추가 2020-07-14  추가
                        if (!itemPrice) {
                          console.log("itemPrice3");
                            itemPrice = $('span[class="a-size-medium a-color-price header-price"]').text().replace(/\$|￥|,/g, '').replace(/(?:\r\n|\r|\n)/gm, '').trim();
                            priceTest5 = itemPrice;
                        }
                        if (!itemPrice) {
                          console.log("itemPrice4");
                            itemPrice = $('.a-size-medium span[class="a-color-price"]').text().replace(/\$|￥|,/g, '').trim();
                            priceTest6 = itemPrice;
                        }
                        if (!itemPrice) {
                          console.log("itemPrice5");
                            itemPrice = $('.a-text-center span[class="a-color-price"]').text().replace(/\$|￥|,/g, '').trim();
                            priceTest7 = itemPrice;
                        }

                        // 제트앤에스 추가 기현 2020-08-19 추가
                        if (!itemPrice && $("#priceblock_dealprice").length > 0) {
                          console.log("itemPrice6");
                            itemPrice = $("#priceblock_dealprice").text().replace(/(?:\r\n|\r|\n)/gm, '').replace(/\$|￥|,/g, '').trim();
                            priceTest8 = itemPrice;
                        }

                        if (!itemPrice && $("#price").length > 0) {
                          console.log("itemPrice7");
                            itemPrice = $("#price").text().replace(/(?:\r\n|\r|\n)/gm, '').replace(/\$|￥|,/g, '').trim();
                            priceTest9 = itemPrice;
                        }

                        // 제트앤에스 추가 기현 2020-08-19 추가
                        if (!itemPrice && $("#price_inside_buybox").length > 0) {
                          console.log("itemPrice8");
                            itemPrice = $("#price_inside_buybox").text().replace(/(?:\r\n|\r|\n)/gm, '').replace(/\$|￥|,/g, '').trim();
                            priceTest10 = itemPrice;
                        }

                        // 제트앤에스 추가 기현 2020-11-22
                        if (!itemPrice && $("#comparison_price_row .comparison_baseitem_column").length > 0) {
                          console.log("itemPrice29");
                            itemPrice = $("#comparison_price_row .comparison_baseitem_column").text().replace(/(?:\r\n|\r|\n)/gm, '').replace(/\$|￥|,/g, '').trim();
                            priceTest11 = itemPrice;
                        }

                        // 제트앤에스 추가 허웅 2020-11-23
                        if (!itemPrice && $("#olp_feature_div .a-color-price").length > 0) {
                          console.log("itemPrice10");
                            itemPrice = $("#olp_feature_div .a-color-price").text().replace(/(?:\r\n|\r|\n)/gm, '').replace(/\$|￥|,/g, '').trim();
                            priceTest12 = itemPrice;

                        }

                        // 제트앤에스 추가 허웅 2020-09-01
                        itemPrice = itemPrice.replace("From ", "").replace("US", "");
                        priceTest13 = itemPrice;

                        //console.log("itemPrice::::"+itemPrice);
                        var itemRetailPrice = $(".priceBlockStrikePriceString").length > 0 ? $(".priceBlockStrikePriceString").text().replace(/\$|￥|,/g, '').trim() : itemPrice; //Price before discount

                        // 제트앤에스 추가 허웅 2020-11-22
                        itemRetailPrice = itemRetailPrice.replace("From ", "").replace("US", "");

                        // Get Additional Option Price if it is listed on the page
                        // Option Get

                        /* */
                        $("#variation_color_name li img.imgSwatch").each(function() {
                            additionalOptionText = $(this).attr("alt");
                            additionalOption.push(additionalOptionText);
                        });


                        $(".twisterSwatchPrice").each(function() {
                            additionalOptionPrice.push($(this).text().trim());
                            hasAdditionalOptionPrice = true;
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
                        if ($itemImagesNode.length == 0) { // 2020-07-16 제트앤에스 추가.
                            $itemImagesNode = $("div.imageThumb");
                        }


                        $itemImagesNode.each(function(imgNodeCount, imgItemNode) {
                            var imgItemNodeItem = $(imgItemNode).find("img").attr("src").replace(/\._.*\./i, '.'); // 2020-07-16 제트앤에스 추가.
                            itemImages.push(imgItemNodeItem);
                        });


                        itemName = $.trim(itemName.replace(/[\t\n]+/g, ' '));
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
                            } else if (isModelNum == true) {
                                var itemModelNumData = itemProductDetails[itemPdI].trimStart();

                                if (itemModelNumData != "") {
                                    itemModelNum = itemModelNumData;
                                    isModelNum = false;
                                }
                            } else if (isItemWeight == true) {
                                var itemWeightData = itemProductDetails[itemPdI].trimStart();

                                if (itemWeightData != "") {
                                    itemWeight = itemWeightData;
                                    isItemWeight = false;
                                }
                            } else if (isProductDimensions == true) {
                                var itemProductDimensionsData = itemProductDetails[itemPdI].trimStart();

                                if (itemProductDimensionsData != "") {
                                    itemProductDimensions = itemProductDimensionsData;
                                    isProductDimensions = false;
                                }
                            }


                            if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "asin" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "asin:") {
                                isAsin = true;
                            } else if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "item model number" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "item model number:") {
                                isModelNum = true;
                            } else if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "item weight" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "item weight:" ||
                                itemProductDetails[itemPdI].toLowerCase().trimStart() == "梱包サイズ" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "梱包サイズ :") {
                                isItemWeight = true;
                            } else if (itemProductDetails[itemPdI].toLowerCase().trimStart() == "product dimensions" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "product dimensions:" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "商品モデル番号" || itemProductDetails[itemPdI].toLowerCase().trimStart() == "商品モデル番号 :") {
                                isProductDimensions = true;
                            }
                        }



                        // '梱包サイズ:',
                        // 'Amazon.co.jp での取り扱い開始日:',
                        // 'メーカー:',
                        // 'ASIN:',
                        // '製造元リファレンス\n\n:',
                        // '',
                        // 'カスタマーレビュー:'

                        if ($("#detailBullets_feature_div li").length > 0) {

                            var $prd_detail = $("#detailBullets_feature_div li");
                            $prd_detail.each(function(nodeCount, itemNode) {
                                var item_title = $(itemNode).find("span.detail-bullet-label").text().replace("\n", "").trim();
                                if (!item_title) {
                                    item_title = $(itemNode).find("span.a-text-bold").text().replace("\n", "").trim();
                                }

                                if (item_title == "梱包サイズ:") {
                                    itemWeight = $(itemNode).text();
                                    itemWeight = itemWeight.replace(/\n/g, "");
                                    itemWeight = itemWeight.replace("梱包サイズ:", "").trim();

                                } else if (item_title == "Product Dimensions:") {

                                    itemWeight = $(itemNode).text();
                                    itemWeight = itemWeight.replace(/\n/g, "");
                                    itemWeight = itemWeight.replace(item_title, "").trim();
                                    itemWeight = itemWeight.split("inches;");
                                    itemProductDimensions = itemWeight[0].trim();
                                    itemWeight = itemWeight[1].trim();
                                }

                            });

                        }


                        // 재팬일 경우 무게에  치수(사이즈)도  같이 있습니다.
                        var tmp = new URL(window.location.href);
                        if (tmp.host == "www.amazon.co.jp") {

                            if (itemWeight) {
                                var tmp = itemWeight.split(";");
                                if (tmp[1]) {
                                    itemWeight = tmp[1].trim();
                                }
                                itemProductDimensions = tmp[0].trim();
                            }
                        }



                        if ($("#detail-bullets table div.content li").length) {
                            var $prd_detail = $("#detail-bullets table div.content li");
                            $prd_detail.each(function(nodeCount, itemNode) {
                                var item_title = $(itemNode).find("b").text().trim();
                                if (item_title == "Product Dimensions:") {
                                    itemProductDimensions = $(itemNode).text();
                                    itemProductDimensions = itemProductDimensions.replace("Product Dimensions:", "").trim();
                                } else if (item_title == "Package Dimensions:") {
                                    itemProductDimensions = $(itemNode).text();
                                    itemProductDimensions = itemProductDimensions.replace("Package Dimensions:", "").trim();
                                } else if (item_title == "Shipping Weight:") {
                                    itemWeight = $(itemNode).text();
                                    itemWeight = itemWeight.replace("Shipping Weight:", "").trim();
                                    itemWeight = itemWeight.replace("(View shipping rates and policies)", "")
                                } else if (item_title == "ASIN:") {
                                    itemAsin = $(itemNode).text();
                                    itemAsin = itemAsin.replace("ASIN:", "").trim();
                                } else if (item_title == "ISBN-10:") {
                                    itemAsin = $(itemNode).text();
                                    itemAsin = itemAsin.replace("ISBN-10:", "").trim();
                                } else if (item_title == "ISBN-13:") {
                                    itemAsin = $(itemNode).text();
                                    itemAsin = itemAsin.replace("ISBN-13:", "").replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, '').trim();
                                } else if (item_title == "UPC:") {
                                    itemUPC = $(itemNode).text();
                                    itemUPC = itemUPC.replace("UPC:", "").trim();
                                }

                            });
                        }

                        // 제트앤에스 기현 2020-08-19 추가
                        if (!itemAsin || itemAsin == ":") {
                            var dataAsin = $("#cerberus-data-metrics").attr("data-asin");

                            if(!dataAsin)
                                dataAsin = $("#ASIN").val(); // INPUT

                            if(!dataAsin)
                                dataAsin = '';

                            itemAsin = dataAsin.trim();
                        }


                        if ($("#importantInformation").length) {
                            itemImportantInfo = $("#importantInformation").text();
                            itemImportantInfo = itemImportantInfo.trim();
                            itemImportantInfo = $.trim(itemImportantInfo.replace(/[\t\n]+/g, ' '));
                            //$("#importantInformation").textContent;
                        }


                        if ($(".twisterImages .twisterSlotDiv").length) {
                            $(".twisterImages .twisterSlotDiv").each(function(nodeTwCount, itemTwNode) {
                                if (item_options_price == "") {
                                    item_options_price = $(itemTwNode).text().trim();
                                } else {
                                    item_options_price = item_options_price + ";" + $(itemTwNode).text().trim();
                                }
                                item_options_price = $.trim(item_options_price.replace(/[\t\n]+/g, ' '));
                                item_options_price = item_options_price.split(" ").join("");
                            });
                        }

                        if ($("#feature-bullets").length) {
                            itemProductDescription = $("#feature-bullets").text();
                            itemProductDescription = $.trim(itemProductDescription.replace(/[\t\n]+/g, ' '));
                        }

                        // if ($("#pantryBadge").length) {
                        //     itemShippingType = "Prime Pantry " + itemShippingType;
                        // }



                        // if ($("#bylineInfo_feature_div").length) {
                        //     itemBrand = $("#bylineInfo_feature_div").text();
                        // }

                        if ($("#bylineInfo").length) {
                            //$("#bylineInfo a").remove();
                            $("#bylineInfo script").remove();
                            //$('#bylineInfo table[class="a-normal"]').remove();
                            itemBrand = $("#bylineInfo").text();
                        }

                        if ($("#mbc").length) {
                            itemBrand = $("#mbc").attr("data-brand");
                        }

                        if (itemBrand) {
                            itemBrand = itemBrand.replace(/(?:\r\n|\r|\n)|ブランド:/gm, '');
                        }

                        //if (!itemShippingType || itemShippingType === undefined) { itemShippingType = ""; }

                        if ($(".apm-top").length) {
                            $(".apm-top").each(function(apmIndex, apmObj) {
                                itemFromTheManufacturer = itemFromTheManufacturer + " " + $(apmObj).text().trim();
                            });

                            itemFromTheManufacturer = $.trim(itemFromTheManufacturer.replace(/[\t\n]+/g, ' '));
                            itemFromTheManufacturer = itemFromTheManufacturer.split("               ").join(" ");
                            // itemFromTheManufacturer = itemFromTheManufacturer.replace(/\s/g, " ");
                        }

                        var ItemOption = {};
                        var ItemOption_cont = [];
                        var option_arr = []; // 옵션 데이터
                        var option_infos = [];
                        var option_type_ck = false;


                        //옵션
                        $("form#twister .a-section").each(function(i) {
                            var sum_opt_vls = [];

                            var opt_name = $(this).find('label.a-form-label').text().trim().replace(/\:/g, '');
                            if ($(this).hasClass("variation-dropdown") == true) {
                                var option_vls_obj = $(this).find('.a-native-dropdown'); // 셀럭 박스 옵션
                                option_type_ck = true;
                            } else {
                                var option_vls_obj = $(this).find('ul li');
                                option_type_ck = false;
                            }



                            if (option_type_ck == true) {

                                if (opt_name) option_arr[opt_name] = [];

                                var x = 0;
                                option_vls_obj.find('option').each(function() {

                                    var opt_vls = $(this).attr("data-a-html-content");
                                    if (opt_vls) {
                                        var vls = $(this).val();
                                        sum_opt_vls.push(opt_vls);
                                        option_arr[opt_name][x] = opt_vls;
                                        var opt_itemPrice = "";

                                        option_infos[opt_vls] = {
                                            "price": opt_itemPrice ? opt_itemPrice : itemPrice,
                                            "availability": true
                                        };

                                        x++;
                                    }

                                    //myList.push($(this).value())
                                });


                            } else {

                                var x = 0;
                                if (option_vls_obj.length > 0) { // 옵션 use

                                    if (opt_name) option_arr[opt_name] = [];

                                    option_vls_obj.each(function() {

                                        var opt_vls = '';

                                        if ($(this).find('.a-size-base').length > 0) {
                                            opt_vls = $(this).find('.a-size-base').text();
                                        }
                                        else {
                                            opt_vls = $(this).attr('title');
                                        }

                                        if( opt_vls ) {
                                            opt_vls = opt_vls.replace(/\Click to select|\を選択するにはクリックしてください|을\(를\) 선택하려면 클릭하십시오\./g, '').trim(); // 옵션 내용
                                        }

                                        var opt_itemPrice = "";
                                        var defaultasin = $(this).attr('data-defaultasin'); // id 값 or  있으면 재고있 없으면 재고없
                                        sum_opt_vls.push(opt_vls);
                                        option_arr[opt_name][x] = opt_vls;

                                        if ($(this).find('.twisterSwatchPrice').length > 0) {
                                            opt_itemPrice = $(this).find('.twisterSwatchPrice').text().replace(/\$|￥|,/g, '').trim();
                                        }

                                        option_infos[opt_vls] = {
                                            "price": opt_itemPrice ? opt_itemPrice : itemPrice,
                                            "availability": defaultasin ? true : false,
                                        };
                                        x++;
                                    }); // end foreach

                                }
                            }

                            // 옵션 정보 매핑
                            if (sum_opt_vls.length > 0) {
                                ItemOption_cont.push({
                                    [opt_name]: sum_opt_vls.join(',')
                                });
                            }

                        }); //  end foreach

                        //ItemOption = ItemOption_cont; // 옵션 정보

                        for (var k in ItemOption_cont) { // 옵션 정보
                            //ItemOption.push(ItemOption_cont[k]);
                            Object.assign(ItemOption, ItemOption_cont[k])
                        }
                        //console.log(ItemOption);

                        function combinations(variants) {
                            return (function recurse(keys) {
                                if (!keys.length) return [{}];
                                let result = recurse(keys.slice(1));
                                return variants[keys[0]].reduce((acc, value) =>
                                    acc.concat(result.map(item =>
                                        Object.assign({}, item, {
                                            [keys[0]]: value
                                        })
                                    )), []
                                );
                            })(Object.keys(variants));
                        }
                        // 옵션 데이터
                        var ItemOptionData = [];
                        if (option_arr) {
                            var tmp_option_val = combinations(option_arr);
                            for (var k in tmp_option_val) {
                                for (var k2 in tmp_option_val[k]) {
                                    if (option_infos[tmp_option_val[k][k2]]) {
                                        var ovls = Object.assign(tmp_option_val[k], option_infos[tmp_option_val[k][k2]]);
                                        ItemOptionData.push(ovls);
                                    }
                                }
                            }
                        }

                        // 옵션데이터 중복나오는거 손봐야됨.
                        ItemOptionData = ItemOptionData.filter(function(a) {
                            var key = Object.keys(a).map(function(k) { return a[k]; }).join('|');
                            if (!this[key]) {
                                return this[key] = true;
                            }
                        }, Object.create(null));

                        var urlParams = new URLSearchParams(window.location.href);
                        var amamzon_type = urlParams.get('s');

                        data.push({
                            ItemUrl: window.location.href,
                            ItemCode: itemAsin,
                            ItemTitle: itemName,
                            ItemQty: 200,
                            //ItemStatus: itemPrice && itemRetailPrice ? 'On Sale' : 'Sold Out',
                            //ItemStatus: itemSalesStatus == 'Currently unavailable.' ? 'Sold Out' : 'On Sale',
                            //ItemStatus: (itemSalesStatus.indexOf("Currently unavailable") == -1)?'On Sale1' : 'Sold Out2',


                            ItemStatus: itemSalesStatusType == 'N'?'Sold Out' : 'On Sale',

                            ItemStatusTest1: itemSalesStatus,

                            ItemPriceTest1:priceTest1,
                            ItemPriceTest2:priceTest2,
                            ItemPriceTest3:priceTest3,
                            ItemPriceTest4:priceTest4,
                            ItemPriceTest5:priceTest5,
                            ItemPriceTest6:priceTest6,
                            ItemPriceTest7:priceTest7,
                            ItemPriceTest8:priceTest8,
                            ItemPriceTest9:priceTest9,
                            ItemPriceTest10:priceTest10,
                            ItemPriceTest11:priceTest11,
                            ItemPriceTest12:priceTest12,
                            ItemPriceTest13:priceTest13,

                            BrandName: itemBrand,
                            ItemPrice: itemPrice,
                            ItemRetailPrice: itemRetailPrice,
                            ShippingInfo: amamzon_type == "amazonfresh" ? "Amazon Fresh" : "Amazon Prime",
                            StandardImage: itemImage,
                            OtherImages: itemImages, //  sub image - 작은이미지 여러개
                            ItemDescription: itemDescription, // 상세설명
                            //ItemOption: additionalOption, // 옵션 표현.
                            ItemOption: ItemOption, // 옵션 표현.
                            //ItemOption: [], // 옵션 표현.
                            ItemOptionData: ItemOptionData, // 옵션데이터
                            ItemWeight: itemWeight, // 아이템 중량
                            ItemSize: itemProductDimensions, // 사이즈 ?
                            ItemExpiredate: '',
                            ISBNCode: '',
                            UPCCode: itemUPC,
                            ItemMFGdate: '',
                            ItemModelNo: itemModelNum,
                            ItemMaterial: '',
                            Memo: '',
                            Category: '',
                            pgdta: html
                                //test: test

                        });
                        return data;
                    }

                    //setTimeout(dataOutput = ProcessData(), 5000);
                    //return dataOutput;
                    return ProcessData();
                };


                // 가격 찾기 유틸
                async function priceCatch(fv_name, op_name, opt_match) {


                    var priceblock_ourprice = await page.$('#priceblock_ourprice');

                    if (priceblock_ourprice == null) // 2020-06-26 추가.
                        priceblock_ourprice = await page.$('#priceblock_dealprice');
                    if (priceblock_ourprice == null) // 2020-06-26 추가.
                        priceblock_ourprice = await page.$('#priceblock_saleprice');

                    if (optionDebug) console.log("area_5 -> priceblock_ourprice -> " + (priceblock_ourprice == null ? "del" : "live"));


                    if (priceblock_ourprice != null) {
                        price = await page.evaluate(priceblock_ourprice => priceblock_ourprice.textContent, priceblock_ourprice);
                        price = price.replace(/\$|￥|,/g, '');
                    } else {
                        if (optionDebug) console.log("area_5 -> priceblock_ourprice NOT FOUND!!");
                    }

                    if (price == 0) {
                        // 2차 가격 가져옴
                        var buyNew_noncbb = await page.$('#buyNew_noncbb');

                        if (buyNew_noncbb == null) { // 2020-06-26 추가.
                            buyNew_noncbb = await page.$('#price_inside_buybox');
                        }

                        if (buyNew_noncbb == null) { // 2020-06-26 추가.
                            buyNew_noncbb = await page.$('#unqualifiedBuyBox .a-color-price');
                        }
                        if (buyNew_noncbb == null) { // 2020-07-16 추가.
                            buyNew_noncbb = await page.$('#unqualified-buybox-olp span.a-color-price');
                        }

                        if (buyNew_noncbb != null) {



                            price = await page.evaluate(buyNew_noncbb => buyNew_noncbb.textContent, buyNew_noncbb);

                            price = price.replace(/\$|￥|,/g, '').replace(/[\t\n]+/g, '');
                        } else {
                            if (optionDebug) console.log("area_5 -> buyNew_noncbb NOT FOUND!!");
                        }
                    }

                    if (price == 0) {
                        if (optionDebug) console.log("area_5 ->op_name [" + so + "] -> " + (op_name) + " " + opt_match + " -> priceblock_ourprice NOT FOUND!!");
                    }

                    if (price != 0) { // 소명이 있는 가격만 입력.
                        var tmp = {
                            "opt_special": fv_name,
                            "opt_color": op_name,
                            "opt_name": opt_match,
                            "price": price.replace("\n", '').trim()
                        };

                        ForgrundItemOptionData.push(tmp);

                        if (optionDebug) {
                            console.log(">>>>>>>>>>>>>>>");
                            console.log(tmp);
                            console.log("<<<<<<<<<<<<<<<");
                        }

                    }
                }

                const saveScreen = async(page, key = 'debug-screen') => {
                    const screenshotBuffer = await page.screenshot({ fullPage: true });
                    await Apify.setValue(key, screenshotBuffer, { contentType: 'image/png' });
                };


                var today = new Date();

                var year = today.getFullYear(); // 년도
                var month = today.getMonth() + 1; // 월
                var date = today.getDate(); // 날짜
                var hour = today.getHours();
                var minute = today.getMinutes();
                var second = today.getSeconds();
                var ntime = year + '' + month.zeroPad() + '' + date.zeroPad() + '-' + hour + '' + minute + '' + second;

                // 셀렉박스 클릭
                // 옵션 클릭
                // 가격 가져옴
                // 셀렉박스 클릭
                // ...
                // ------------- 페이지 로딩 확인 -------------
                for (var d = 0; d < 50; d++) {
                    const dropdown = await page.$('.twisterAccess');
                    if (dropdown != null) break;
                    await page.waitFor(100);
                }
                // ------------- 페이지 로딩 확인 -------------

                // 기본룰 변경.
                // await page.waitFor(2000);

                await Apify.utils.puppeteer.injectJQuery(page);


                const feature_div = await page.$('#alternativeOfferEligibilityMessaging_feature_div'); // 로딩바..



                console.log("pageFunction::::");
                console.log(pageFunction);
                // ---------------------------------- LV 1 ----------------------------------  //
                const data = await page.$$eval(".s-result-list .a-section", pageFunction); // 함수 실행~
                // ---------------------------------- LV 1 ----------------------------------  //

                console.log("data!!!!!::::");
                console.log(data);

                if (optionDebug) console.log("area_1 -> pageFunction end!");


                // 중복 아이템코드 검사.
                if (urlBox.includes(data[0].ItemCode)) {
                    console.log(`Duplicate for SKU to ${data[0].ItemCode} continue.`);
                    return;
                }

                // 중복아이템 넣는다.
                await urlBox.push(data[0].ItemCode);



                // Check if this is a blocked request
                if (data[0].pgdta.includes("Sorry! Something went wrong on our end.") || data[0].pgdta.includes("To discuss automated access to Amazon data please contact api-services-support@amazon.com")) {
                    // console.log(data[0].pgdta);
                    // console.log(`Page blocked ${request.url} ..`);
                    throw "Error..";
                } else {
                    data[0].pgdta = "";
                }

                if (optionDebug) {
                    await saveScreen(page, `MAIN_PAGE_${ntime}`);
                    console.log(data);
                }




                // 로딩바구현
                async function _loading_() {

                    for (var d = 0; d < 15; d++) { // 로딩바 체크

                        await page.waitFor(100);

                        if (feature_div == null) {
                            if (optionDebug) console.log("feature_div -> waitFor 1.5 sec... ");
                            await page.waitFor(1400);
                            break;
                        } else {

                            var style = await (await feature_div.getProperty('style')).jsonValue();
                            if (optionDebug) console.log("feature_div -> loading style -> " + JSON.stringify(style));
                            if (Object.keys(style).length === 0) {

                                var t = 200;
                                if (d > 0)
                                    t = 300;

                                await page.waitFor(t);
                                break;
                            }
                        }
                    }
                }







                // 2020-05-18 플레이버 옵션 추가,
                var flavorName = "flavor";
                var flavorButton = data[0].ItemOption["Flavor Name"] ? data[0].ItemOption["Flavor Name"].split(",") : ["one of them"];
                if (flavorButton[0] == "one of them")
                    flavorButton = data[0].ItemOption["Flavor"] ? data[0].ItemOption["Flavor"].split(",") : ["one of them"];
                if (flavorButton[0] == "one of them") {
                    flavorButton = data[0].ItemOption["Design"] ? data[0].ItemOption["Design"].split(",") : ["one of them"];
                    flavorName = "pattern";
                }


                for (var fb in flavorButton) {

                    var fv_name = flavorButton[fb];

                    // 초기화 ------
                    if (fv_name != "one of them") {
                        const flavorNameButton = await page.$(`#${flavorName}_name_${fb} .a-button-text`);
                        if (flavorNameButton != null) { // 스페셜 박스가 존재하면
                            await flavorNameButton.evaluate(flavorNameButton => flavorNameButton.click()); // 순차적 스페셜 박스 선택.
                            if (optionDebug) console.log(`${flavorName}Button -> ` + fb + " -> Click! -> " + fv_name);

                            await _loading_(); // 로딩 체크.

                            // await page.waitFor(getRandomInt( 700 ,  1500));

                            //  ------------------------------------------ test ------------------------------------------
                            // let fileName = `./test_${fb}_${fv_name}.jpeg`;
                            // await page.screenshot({ path: fileName, fullPage: true });
                            // console.log(`Screenshot of ${fileName} saved.`);
                            //  ------------------------------------------ test ------------------------------------------
                        } else {
                            if (optionDebug) console.log(`${flavorName}Button -> FAIL!!!!`);
                        }
                    }



                    // 스타일 옵션을 돌아가면서 클릭해야됩니다.
                    // 스타일 옵션이 품절됐는지도 체크해야됩니다.
                    // 품절 됐을시 가격가져오는부분 패스.
                    // 클릭이 유효할시에 하나씩 클릭해보고 가격부분 가져와야함.

                    var amazonOptionPattern1 = ['Size', 'Style'];
                    var vOptionName_1 = amazonOptionPattern1[0];
                    var vOptionName_2 = amazonOptionPattern1[1];


                    // var tearName = "size_name";
                    var tearName = `${vOptionName_1.toLowerCase()}_name`;
                    var sizeOption = data[0].ItemOption[vOptionName_1] ? data[0].ItemOption[vOptionName_1].split(",") : ["one of them"];
                    if (sizeOption[0] == "one of them") {

                        // amazonOptionPattern1 = amazonOptionPattern1.reverse();

                        tearName = `${vOptionName_2.toLowerCase()}_name`
                        sizeOption = data[0].ItemOption[vOptionName_2] ? data[0].ItemOption[vOptionName_2].split(",") : ["one of them"];
                    }

                    if (optionDebug) console.log("area_2 -> sizeOption -> " + sizeOption.join(",") + " [" + (sizeOption.length) + "ea]");
                    for (var so in sizeOption) {

                        var op_name = sizeOption[so];
                        var price = 0;
                        var initload = false;
                        var opt_match = ""; // ### 옵션 명칭 중요함 ###

                        if (optionDebug) console.log("area_2 -> op_name[" + so + "] -> " + (op_name) + "");

                        if (op_name != "one of them") {


                            const element = await page.$(`#${tearName}_${so}`);
                            if (element == null) { // 2020-06-28 사이즈 박스 존재 유무 체크.
                                if (optionDebug) console.log("area_2 -> Find " + op_name + " Error! ");
                                continue;
                            }

                            // 버튼 클릭여부 확인 ------
                            const elementClass = await page.evaluate(({ tearName, so }) => {
                                const $ = window.$;

                                var element = $("#" + tearName + "_" + so);
                                return element.attr('class');

                            }, { tearName, so }); // function
                            // 버튼 클릭여부 확인 ------

                            if (elementClass.match("Unavailable") ? true : false) {
                                if (optionDebug) {
                                    console.log("area_2 -> " + op_name + " is Not UnAvailable -> Continue!");
                                    console.log(elementClass);
                                }
                                //initload = true;
                                continue;
                            }

                            if (optionDebug) console.log("area_2 -> twisterAccess -> start");

                            await page.waitForSelector('.twisterAccess', { timeout: 30000 });
                            // const twisterAccess = await page.$('.twisterAccess');  // 웨이팅 .. 추출

                            const declarativeText = await page.$(`#${tearName}_${so} .a-size-base`);
                            opt_match = await page.evaluate(declarativeText => declarativeText.textContent, declarativeText); // 현재 옵션 이름 추출
                            opt_match = opt_match.replace(/(?:\r\n|\r|\n)/gm, '').trim();

                            const declarative = await page.$(`#${tearName}_${so} .a-button-text`);
                            if (declarative != null) {

                                if (optionDebug) console.log(`area_2 -> ${op_name} is Available 1 `);
                                await declarative.evaluate(declarative => declarative.click());
                                // await page.waitForNavigation(); // 페이지가 전부 로드된 이후 작업 실행


                                // ------------------------------------------------------------

                                await _loading_(); // 로딩 체크.

                                if (initload) { // 2020-06-26 추가 지연시간
                                    await page.waitFor(1000);
                                    initload = false;
                                }

                                // ------------------------------------------------------------


                                if (optionDebug) console.log("area_3 -> declarativeText(" + (declarativeText == null ? 'del' : 'live') + ") click");


                                // 2020-07-08 추가된내용  ------------------------------------------------------------

                                var amazonOptionPattern1 = ['Color', 'Style'];
                                var vOptionName_1 = amazonOptionPattern1[0];
                                var vOptionName_2 = amazonOptionPattern1[1];


                                // var subTearName = "color_name";
                                var subTearName = `${vOptionName_1.toLowerCase()}_name`;
                                var styleOption = data[0].ItemOption[vOptionName_1] ? data[0].ItemOption[vOptionName_1].split(",") : ["one of them"];
                                if (styleOption[0] == "one of them") {


                                    subTearName = `${vOptionName_2.toLowerCase()}_name`
                                    styleOption = data[0].ItemOption[vOptionName_2] ? data[0].ItemOption[vOptionName_2].split(",") : ["one of them"];
                                }



                                if (optionDebug) console.log("area_3 -> styleOption -> " + (styleOption.length) + "ea");
                                for (var sso in styleOption) {

                                    var color_name = styleOption[sso];

                                    if (color_name != "one of them") {
                                        op_name = color_name; // 보정연산 언제든지 변할수 있음... -- 위에서 변수가 이상하게 내려와 ;;;;

                                        // 버튼 클릭여부 확인 ------
                                        const elementClass = await page.evaluate(({ subTearName, sso }) => {
                                            const $ = window.$;

                                            var element = $("#" + subTearName + "_" + sso);
                                            return element.attr('class');
                                        }, { subTearName, sso }); // function
                                        // 버튼 클릭여부 확인 ------

                                        if (elementClass.match("Unavailable") ? true : false) {
                                            if (optionDebug) console.log("area_3 -> " + op_name + " is Not UnAvailable -> Continue!");
                                            continue;
                                        }

                                        const declarative = await page.$(`#${subTearName}_${so} .a-declarative`); // 해당컬러 확인.
                                        if (declarative != null) {

                                            if (optionDebug) console.log(`area_3 -> ${op_name} is Available `);
                                            await declarative.evaluate(declarative => declarative.click()); // 컬러 클릭.

                                            await _loading_(); // 로딩 체크.


                                        } else {
                                            console.log("area_3 -> Error! -> " + op_name);
                                        }
                                    }

                                    // 2020-07-08 추가된내용  ------------------------------------------------------------



                                    if (optionDebug) console.log("area_5 -> " + opt_match + " -> priceblock_ourprice");


                                    //  ------------------------------------------ test ------------------------------------------
                                    //console.log(ntime);
                                    // This is a Puppeteer function that takes a screenshot of the page and returns its buffer.
                                    // 1번째 방식
                                    // var dir = "./apify_storage/datasets/default";
                                    // mkdirp(dir, function (err) {
                                    //         if (err) {
                                    //                 console.error(err);
                                    //         }
                                    // });
                                    // const fileName = `${dir}/${ntime}_op_name[${so}]_${op_name}_${opt_match}_${i}.jpeg`;
                                    // await page.screenshot({ path: fileName, fullPage: true });
                                    // ------------------------------------------ test ------------------------------------------

                                    if (optionDebug) {
                                        await saveScreen(page, 'test-screen');
                                    }

                                    await priceCatch(fv_name, op_name, opt_match); // 가격추출

                                } // end for
                            } else {
                                console.log("area_2 -> Find .a-button-text Error! -> " + op_name);
                            }

                        } else {
                            if (optionDebug) console.log("area_2 -> " + op_name + " -> PASS v1");

                            // 2020-07-16 임시 추가
                            if (fv_name != "one of them") {
                                await priceCatch(fv_name, op_name, opt_match); // 가격추출
                            }

                        }

                    } // end for
                } // end 플레이버






                // 스페셜 옵션 추가,
                var specialButton = data[0].ItemOption["Special Size"] ? data[0].ItemOption["Special Size"].split(",") : ["one of them"];
                for (var sb in specialButton) {

                    var sp_name = specialButton[sb];

                    // 초기화 ------
                    if (sp_name != "one of them") {
                        const specialSizeType = await page.$(`#special_size_type_${sb} .a-button-text`);
                        if (specialSizeType != null) { // 스페셜 박스가 존재하면
                            await specialSizeType.evaluate(specialSizeType => specialSizeType.click()); // 순차적 스페셜 박스 선택.
                            if (optionDebug) console.log("specialButton -> " + sb + " -> Click! -> " + sp_name);
                            await page.waitFor(getRandomInt(700, 1500));

                            //  ------------------------------------------ test ------------------------------------------
                            // let fileName = `./test_${sb}_${sp_name}.jpeg`;
                            // await page.screenshot({ path: fileName, fullPage: true });
                            // console.log(`Screenshot of ${fileName} saved.`);
                            //  ------------------------------------------ test ------------------------------------------
                        } else {
                            if (optionDebug) console.log("specialButton -> FAIL!!!!");
                        }
                    }
                    // 초기화 ------

                    // 스타일 옵션을 돌아가면서 클릭해야됩니다.
                    // 스타일 옵션이 품절됐는지도 체그해야됩니다.
                    // 품절 됐을시 가격가져오는부분 패스.
                    // 클릭이 유효할시에 하나씩 클릭해보고 가격부분 가져와야함.

                    var styleOption = data[0].ItemOption.Color ? data[0].ItemOption.Color.split(",") : ["one of them"];
                    if (optionDebug) console.log("area_2 -> styleOption -> " + (styleOption.length) + "ea");
                    for (var so in styleOption) {

                        var op_name = styleOption[so];
                        var price = 0;
                        var initload = false;
                        var opt_match = ""; // ### 옵션 명칭 중요함 ###

                        if (op_name != "one of them") {

                            // 버튼 클릭여부 확인 ------
                            const elementClass = await page.evaluate(({ so }) => {
                                const $ = window.$;

                                var element = $("#color_name_" + so);
                                return element.attr('class');
                            }, { so }); // function
                            // 버튼 클릭여부 확인 ------

                            if (elementClass.match("Unavailable") ? true : false) {
                                if (optionDebug) console.log("area_2 -> " + op_name + " is Not UnAvailable -> Continue!");
                                continue;
                            }

                            const declarative = await page.$(`#color_name_${so} .a-declarative`); // 해당컬러 확인.
                            if (declarative != null) {

                                if (optionDebug) console.log(`area_2 -> ${op_name} is Available 2 `);
                                await declarative.evaluate(declarative => declarative.click()); // 컬러 클릭.
                                initload = true;
                            } else {
                                console.log("area_2 -> Error! -> " + op_name);
                            }

                        } else {
                            if (optionDebug) console.log("area_2 -> " + op_name + " -> PASS v2");
                        }

                        // 중간단계 !!!
                        const dropdown = await page.$('#native_dropdown_selected_size_name');
                        const subdropdown0 = await page.$('#native_dropdown_selected_size_name_0');

                        if (dropdown != null && subdropdown0 != null) { // 셀렉트 박스가 존재하면

                            const optbox_cnt = await page.evaluate(dropdown => dropdown.length, dropdown); // 셀렉 박스 갯수 수렴.

                            if (optbox_cnt > 0) {
                                for (var i = 1; i < (optbox_cnt); i++) {

                                    price = 0;

                                    if (optionDebug) console.log("area_3 -> init");



                                    // 초기화 ------
                                    await dropdown.evaluate(dropdown => dropdown.click()); //  셀렉트 박스가 펼쳐짐.
                                    //await page.waitForSelector('#native_dropdown_selected_size_name_0', { timeout: 30000 });
                                    //const subdropdown0 = await page.$('#native_dropdown_selected_size_name_0');
                                    // 초기화 ------

                                    if (optionDebug) console.log("area_3 -> dropdown click done -> " + (dropdown != null ? 1 : 0));

                                    //await dropdown.evaluate(dropdown => dropdown.click()); // 셀렉트 박스가 펼쳐짐.
                                    await page.waitForSelector('#native_dropdown_selected_size_name_' + i, { timeout: 30000 });
                                    const subdropdown = await page.$('#native_dropdown_selected_size_name_' + i); // 순서대로 옵션 원소 추출

                                    if (optionDebug) console.log("area_4 -> subdropdown -> " + (subdropdown != null ? 1 : 0));
                                    opt_match = await page.evaluate(subdropdown => subdropdown.textContent, subdropdown); // 현재 옵션 이름 추출
                                    opt_match = opt_match.replace(/(?:\r\n|\r|\n)/gm, '').trim();


                                    // 버튼 클릭여부 확인 ------
                                    const elementClass = await page.evaluate(({ i }) => {
                                        const $ = window.$;

                                        var element = $("#native_dropdown_selected_size_name_" + i);
                                        return element.parent().attr('class');

                                    }, { i }); // function
                                    // 버튼 클릭여부 확인 ------

                                    if (optionDebug) console.log("area_4 -> subdropdown ok");

                                    if ((elementClass.match("Unavailable") ? true : false)) {

                                        // 비활성 작업건
                                        if (optionDebug) console.log("area_5 -> pass -> " + opt_match);
                                        await subdropdown0.evaluate(subdropdown0 => subdropdown0.click()); // 첫 SELECT 를 클릭함.
                                        await page.waitFor(500);
                                        initload = true;

                                    } else {


                                        // 정상 작업건
                                        await subdropdown.evaluate(subdropdown => subdropdown.click()); // 순서대로 옵션 셀렉션
                                        // await page.waitForNavigation(); // 페이지가 전부 로드된 이후 작업 실행

                                        await _loading_(); // 로딩 체크.

                                        if (initload) { // 2020-06-26 추가 지연시간
                                            await page.waitFor(1000);
                                            initload = false;
                                        }

                                        if (optionDebug) console.log("area_5 -> subdropdown(" + (subdropdown == null ? 'del' : 'live') + ") click -> " + opt_match + " -> priceblock_ourprice search....");

                                        //  ------------------------------------------ test ------------------------------------------
                                        // let fileName = `./test_${i}_${op_name}.jpeg`;
                                        // await page.screenshot({ path: fileName, fullPage: true });
                                        // console.log(`Screenshot of ${fileName} saved.`);
                                        //  ------------------------------------------ test ------------------------------------------

                                        // The record key may only include the following characters: a-zA-Z0-9!-_.'()
                                        // let fileName = request.url.replace(/(\.|\/|:|%|#)/g, "_");
                                        // if (fileName.length > 100) {
                                        //     fileName = fileName.substring(0, 100);
                                        // }
                                        // ------------------------------------------ test ------------------------------------------


                                        await priceCatch(sp_name, op_name, opt_match); // 가격추출

                                        if (price == 0) {
                                            if (optionDebug) console.log("area_5 -> subdropdown(" + (subdropdown == null ? 'del' : 'live') + ") click -> " + opt_match + " -> priceblock_ourprice NOT FOUND!!");
                                        }

                                    }


                                    ///

                                } // end for

                                // 초기화 ------
                                if (optionDebug) console.log("area_6 -> init ok");
                                await dropdown.evaluate(dropdown => dropdown.click()); //  셀렉트 박스가 펼쳐짐.
                                await page.waitForSelector('#native_dropdown_selected_size_name_0', { timeout: 30000 });
                                const subdropdown0 = await page.$('#native_dropdown_selected_size_name_0');
                                await subdropdown0.evaluate(subdropdown0 => subdropdown0.click()); // 첫 SELECT 를 클릭함.
                                // await page.waitFor(1000);
                                // 초기화 ------
                            }
                        } // page done
                        else {
                            if (optionDebug) console.log("area_6 -> The program did not run! ");
                        }
                    }

                    //console.log(`Screenshot FAIL of ${request.url}`);
                }



                // 패자부활전 1
                if (ForgrundItemOptionData.length == 0) {


                    if (optionDebug) console.log("패자부활전1");


                    // 스타일 옵션... 추후 바뀔수도 있음...
                    var tearName = "style_name";
                    var styleOption = data[0].ItemOption.Style ? data[0].ItemOption.Style.split(",") : ["one of them"];
                    for (var so in styleOption) {

                        var op_name = styleOption[so];
                        var price = 0;
                        var opt_match = ""; // ### 옵션 명칭 중요함 ###

                        if (optionDebug) console.log("area_2 -> op_name[" + so + "] -> " + (op_name) + "");

                        if (op_name != "one of them") {


                            const element = await page.$(`#${tearName}_${so}`);
                            if (element == null) { // 2020-06-28 사이즈 박스 존재 유무 체크.
                                if (optionDebug) console.log("area_2 -> Find " + op_name + " Error! ");
                                continue;
                            }

                            // 버튼 클릭여부 확인 ------
                            const elementClass = await page.evaluate(({ tearName, so }) => {
                                const $ = window.$;

                                var element = $("#" + tearName + "_" + so);
                                return element.attr('class');

                            }, { tearName, so }); // function
                            // 버튼 클릭여부 확인 ------

                            // if( elementClass.match("Unavailable") ? true : false ) {
                            //     if( optionDebug ) {
                            //         console.log("area_2 -> " + op_name +" is Not UnAvailable -> Continue!" );
                            //         console.log(elementClass);
                            //     }
                            //     //initload = true;
                            //     continue;
                            // }

                            if (optionDebug) console.log("area_2 -> twisterAccess -> start");

                            await page.waitForSelector('.twisterAccess', { timeout: 30000 });
                            // const twisterAccess = await page.$('.twisterAccess');  // 웨이팅 .. 추출

                            const declarativeText = await page.$(`#${tearName}_${so} .a-size-base`);
                            opt_match = await page.evaluate(declarativeText => declarativeText.textContent, declarativeText); // 현재 옵션 이름 추출
                            opt_match = opt_match.replace(/(?:\r\n|\r|\n)/gm, '').trim();

                            const declarative = await page.$(`#${tearName}_${so} .a-button-text`);
                            if (declarative != null) {

                                if (optionDebug) console.log(`area_2 -> ${op_name} is Available 3 `);
                                await declarative.evaluate(declarative => declarative.click());
                                // await page.waitForNavigation(); // 페이지가 전부 로드된 이후 작업 실행


                                // ------------------------------------------------------------

                                await _loading_(); // 로딩 체크.

                                // 2020-06-26 추가 지연시간
                                await page.waitFor(200);

                                // 핸드 옵션 추가,
                                var handButton = data[0].ItemOption["Hand Orientation"] ? data[0].ItemOption["Hand Orientation"].split(",") : ["one of them"];
                                // console.log(handButton);
                                for (var hd in handButton) {

                                    var hd_name = handButton[hd];
                                    fv_name = hd_name;


                                    // 초기화 ------
                                    if (hd_name != "one of them") {
                                        const handType = await page.$(`#hand_orientation_${hd} .a-button-text`);
                                        if (handType != null) { // 스페셜 박스가 존재하면


                                            // 버튼 클릭여부 확인 ------
                                            const elementClass = await page.evaluate(({ hd }) => {
                                                const $ = window.$;

                                                var element = $("#hand_orientation_" + hd);
                                                return element.attr('class');
                                            }, { hd }); // function
                                            // 버튼 클릭여부 확인 ------

                                            if (elementClass.match("Unavailable") ? true : false) {
                                                if (optionDebug) console.log("area_fail.. -> " + hd_name + " is Not UnAvailable -> Continue!");
                                                continue;
                                            }


                                            await handType.evaluate(handType => handType.click()); // 순차적 스페셜 박스 선택.
                                            if (optionDebug) console.log("handButton -> " + hd + " -> Click! -> " + hd_name);
                                            await page.waitFor(getRandomInt(2000));



                                            //  ------------------------------------------ test ------------------------------------------
                                            // let fileName = `./test_${hd}_${hd_name}.jpeg`;
                                            // await page.screenshot({ path: fileName, fullPage: true });
                                            // console.log(`Screenshot of ${fileName} saved.`);
                                            //  ------------------------------------------ test ------------------------------------------
                                        } else {
                                            if (optionDebug) console.log("handButton -> FAIL!!!!");
                                        }
                                    }


                                    // ------------------------------------------------------------


                                    // 컬러 옵션... 추후 바뀔수도 있음...
                                    var subTearName = "color_name";
                                    var colorOption = data[0].ItemOption.Color ? data[0].ItemOption.Color.split(",") : ["one of them"];
                                    for (var sso in colorOption) {

                                        var color_name = colorOption[sso];
                                        if (color_name != "one of them") {

                                            op_name = color_name; // 보정연산 언제든지 변할수 있음... -- 위에서 변수가 이상하게 내려와 ;;;;

                                            // 버튼 클릭여부 확인 ------
                                            const elementClass = await page.evaluate(({ subTearName, sso }) => {
                                                const $ = window.$;

                                                var element = $("#" + subTearName + "_" + sso);
                                                return element.attr('class');
                                            }, { subTearName, sso }); // function
                                            // 버튼 클릭여부 확인 ------

                                            if (elementClass.match("Unavailable") ? true : false) {
                                                if (optionDebug) console.log("area_3 -> " + op_name + " is Not UnAvailable -> Continue!");
                                                continue;
                                            }

                                            const declarative = await page.$(`#${subTearName}_${sso} .a-declarative`); // 해당컬러 확인.
                                            if (declarative != null) {

                                                if (optionDebug) console.log(`area_3 -> ${op_name} is Available `);
                                                await declarative.evaluate(declarative => declarative.click()); // 컬러 클릭.

                                                await _loading_(); // 로딩 체크.


                                            } else {
                                                console.log("area_3 -> Error! -> " + op_name);
                                            }
                                        }


                                        if (optionDebug) console.log("area_5 -> " + opt_match + " -> priceblock_ourprice");

                                        await priceCatch(fv_name, op_name, opt_match); // 가격추출

                                    } // end for

                                } // end Hand Orientation

                            } else {
                                console.log("area_2 -> Find .a-button-text Error! -> " + op_name);
                            }
                        } else {
                            if (optionDebug) console.log("area_2 -> " + op_name + " -> PASS v2");
                        }

                    } // end for




                } // end IF 패자부활전 1



                // 패자부활전 2
                if (ForgrundItemOptionData.length == 0) {

                    if (optionDebug) console.log("패자부활전2");

                    // 중간단계 !!!
                    const dropdown = await page.$('#native_dropdown_selected_team_name');
                    if (dropdown != null) { // 셀렉트 박스가 존재하면

                        const optbox_cnt = await page.evaluate(dropdown => dropdown.length, dropdown); // 셀렉 박스 갯수 수렴.
                        if (optbox_cnt > 0) {
                            for (var i = 1; i < (optbox_cnt); i++) {

                                price = 0;

                                // 초기화 ------
                                await dropdown.evaluate(dropdown => dropdown.click()); //  셀렉트 박스가 펼쳐짐.
                                await page.waitForSelector('#native_dropdown_selected_team_name_0', { timeout: 30000 });
                                // 초기화 ------

                                if (optionDebug) console.log("area_3 -> dropdown click done -> " + (dropdown != null ? 1 : 0));


                                // 버튼 클릭여부 확인 ------
                                const elementClass = await page.evaluate(({ i }) => {
                                    const $ = window.$;

                                    var element = $("#native_dropdown_selected_team_name_" + i);
                                    return element.parent().attr('class');

                                }, { i }); // function
                                // 버튼 클릭여부 확인 ------


                                if ((elementClass.match("Unavailable") ? true : false)) {

                                    // 비활성 작업건
                                    if (optionDebug) {
                                        console.log("area_2 -> " + op_name + " is Not UnAvailable -> Continue!");
                                        console.log(elementClass);
                                    }
                                    continue;

                                } else {


                                    // 정상 작업건
                                    //await dropdown.evaluate(dropdown => dropdown.click()); // 셀렉트 박스가 펼쳐짐.
                                    await page.waitForSelector('#native_dropdown_selected_team_name_' + i, { timeout: 30000 });
                                    const subdropdown = await page.$('#native_dropdown_selected_team_name_' + i); // 순서대로 옵션 원소 추출

                                    if (optionDebug) console.log("area_4 -> subdropdown -> " + (subdropdown != null ? 1 : 0));
                                    opt_match = await page.evaluate(subdropdown => subdropdown.textContent, subdropdown); // 현재 옵션 이름 추출
                                    opt_match = opt_match.replace(/(?:\r\n|\r|\n)/gm, '').trim();

                                    if (optionDebug) console.log("area_4 -> subdropdown ok");


                                    await subdropdown.evaluate(subdropdown => subdropdown.click()); // 순서대로 옵션 셀렉션
                                    // await page.waitForNavigation(); // 페이지가 전부 로드된 이후 작업 실행

                                    await _loading_(); // 로딩 체크.

                                    if (optionDebug) console.log("area_5 -> subdropdown(" + (subdropdown == null ? 'del' : 'live') + ") click -> " + opt_match + " -> priceblock_ourprice search....");

                                    await priceCatch(sp_name, op_name, opt_match); // 가격추출
                                }
                            }



                        } // page done
                        else {
                            if (optionDebug) console.log("area_6 -> The program did not run! ");
                        }

                    }

                } // 패자부활전 2


                // 패자부활전 3
                if (ForgrundItemOptionData.length == 0) {


                    if (optionDebug) console.log("패자부활전3");


                    // 스타일 옵션... 추후 바뀔수도 있음...
                    var tearName = "color_name";
                    var styleOption = data[0].ItemOption.Color ? data[0].ItemOption.Color.split(",") : ["one of them"];
                    for (var so in styleOption) {

                        var op_name = styleOption[so];
                        var price = 0;
                        var opt_match = ""; // ### 옵션 명칭 중요함 ###

                        if (optionDebug) console.log("area_2 -> op_name[" + so + "] -> " + (op_name) + "");

                        if (op_name != "one of them") {


                            const element = await page.$(`#${tearName}_${so}`);
                            if (element == null) { // 2020-06-28 사이즈 박스 존재 유무 체크.
                                if (optionDebug) console.log("area_2 -> Find " + op_name + " Error! ");
                                continue;
                            }

                            // 버튼 클릭여부 확인 ------
                            const elementClass = await page.evaluate(({ tearName, so }) => {
                                const $ = window.$;

                                var element = $("#" + tearName + "_" + so);
                                return element.attr('class');

                            }, { tearName, so }); // function
                            // 버튼 클릭여부 확인 ------

                            if (optionDebug) console.log("area_2 -> twisterAccess -> start");

                            await page.waitForSelector('.twisterAccess', { timeout: 30000 });
                            // const twisterAccess = await page.$('.twisterAccess');  // 웨이팅 .. 추출

                            const declarative = await page.$(`#${tearName}_${so} .a-button-text`);
                            if (declarative != null) {

                                if (optionDebug) console.log(`area_2 -> ${op_name} is Available 3 `);
                                await declarative.evaluate(declarative => declarative.click());
                                // await page.waitForNavigation(); // 페이지가 전부 로드된 이후 작업 실행


                                // ------------------------------------------------------------

                                await _loading_(); // 로딩 체크.

                                // 컬러라서 색다르게 뽑아본다..
                                const declarativeText = await page.$(`#${tearName}_${so} .imgSwatch`);
                                opt_match = await page.evaluate(declarativeText => declarativeText.alt, declarativeText); // 현재 옵션 이름 추출
                                opt_match = opt_match.replace(/(?:\r\n|\r|\n)/gm, '').trim();

                                if (optionDebug) console.log("area_5 -> " + opt_match + " -> priceblock_ourprice");

                                await priceCatch(fv_name, op_name, opt_match); // 가격추출

                            } else {
                                console.log("area_2 -> Find .a-button-text Error! -> " + op_name);
                            }
                        } else {
                            if (optionDebug) console.log("area_2 -> " + op_name + " -> PASS v2");
                        }

                    } // end for

                } // end IF 패자부활전 3





                if (optionDebug) {
                    console.log("area -> END");
                    console.log("--------------------------");
                    console.log(ForgrundItemOptionData);
                    console.log("--------------------------");
                }





                // 가격이 존재할때만 덮어씌어져야함.
                if (ForgrundItemOptionData.length > 0) {
                    for (var key in data[0].ItemOptionData) {

                        data[0].ItemOptionData[key]['price'] = 0;
                        data[0].ItemOptionData[key]['availability'] = false;

                        for (var Fprkey in ForgrundItemOptionData) {

                            if (data[0].ItemOptionData[key]['Flavor Name'] &&
                                data[0].ItemOptionData[key]['Flavor Name'] != ForgrundItemOptionData[Fprkey]['opt_special']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Flavor'] &&
                                data[0].ItemOptionData[key]['Flavor'] != ForgrundItemOptionData[Fprkey]['opt_special']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Special Size'] &&
                                data[0].ItemOptionData[key]['Special Size'] != ForgrundItemOptionData[Fprkey]['opt_special']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Hand Orientation'] &&
                                data[0].ItemOptionData[key]['Hand Orientation'] != ForgrundItemOptionData[Fprkey]['opt_special']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Team Name'] &&
                                data[0].ItemOptionData[key]['Team Name'] != ForgrundItemOptionData[Fprkey]['opt_special']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Design'] &&
                                data[0].ItemOptionData[key]['Design'] != ForgrundItemOptionData[Fprkey]['opt_special']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Color'] &&
                                data[0].ItemOptionData[key]['Color'] != ForgrundItemOptionData[Fprkey]['opt_color']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Size'] &&
                                data[0].ItemOptionData[key]['Size'] != ForgrundItemOptionData[Fprkey]['opt_name']
                            ) continue;

                            if (data[0].ItemOptionData[key]['Style'] &&
                                data[0].ItemOptionData[key]['Style'] != ForgrundItemOptionData[Fprkey]['opt_name']
                            ) continue;


                            /*
                            console.log( dd[Fprkey]['opt_special'] + " == " + c.ItemOptionData[key]['Hand Orientation'] );
                            console.log( dd[Fprkey]['opt_color'] + " == " + c.ItemOptionData[key]['Color'] );
                            console.log( dd[Fprkey]['opt_name'] + " == " + c.ItemOptionData[key]['Size'] );
                            console.log( "=====>"  );
                            //console.log( c.ItemOptionData[key] );
                            console.log( key );
                            console.log( "___________"  );
                            console.log( ";;;;;;;;;;"  );
                            */


                            var p = ForgrundItemOptionData[Fprkey]['price'];

                            if (p != 0) {
                                data[0].ItemOptionData[key]['price'] = p;
                                data[0].ItemOptionData[key]['availability'] = true;
                            }

                        }
                    }
                }


                //console.log(data[0].ItemOptionData);
                // return false;


                // if (request.userData.shippingtype) {
                //     //data[0].ShippingType = request.userData.shippingtype + " " + request.userData.shippingtype;
                // }
                // Store the results to the default dataset.
                console.log(`ItemTitle ==>  ${data[0].ItemTitle} ..`);

                await Apify.pushData(data);




            } else if (request.userData.pagetype == "CATEGORY_PAGING") {
                console.log(`Processing paging pages ${request.url} ..`);
                await ProcessPhrase(request.url, false, '', request.userData.npage);
            }
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async({ request }) => {
            console.log(`Request ${request.url} failed too many times`);
            console.log(request);

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
        handlePageFunction: async({ request, page }) => {
            if (request.userData.pagetype == "CATEGORY_PAGING") {
                console.log(`Processing paging pages ${request.url} ..`);
                await ProcessPhrase(request.url, false);
            }
        },
        handleFailedRequestFunction: async({ request }) => {
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
async function ProcessPhrase(startUrl, getPaging, pagenum, npage) {
    console.log("테스트1111@1");


    const env = await Apify.getEnv()
    console.log("env::");
    console.log(env);

    const input = [{
        "url": startUrl,
        "headers": {
            //"User-Agent": Apify.utils.getRandomUserAgent()
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36"
        }
    }]
    console.log(input);
    //console.log("npage" + npage);



    const requestQueue = await Apify.openRequestQueue();
    console.log(requestQueue);
    const requestList = new Apify.RequestList({
        sources: input,
    });
    console.log(requestList);
    await requestList.initialize();

    const crawler = new Apify.CheerioCrawler({
        requestList,
        minConcurrency: 10,
        maxConcurrency: 50,
        maxRequestRetries: 2,
        useApifyProxy: true,
        handlePageTimeoutSecs: 60,
        handlePageFunction: async({ request, html, $ }) => {
            console.log(`ProcessPhrase: Cheerio Processing ${request.url} ..`);

            if (html.indexOf("Sorry! Somenthig went wrong on our end.") > -1 || html.indexOf("To discuss automated access to Amazon data please contact api-services-support@amazon.com") > -1) {
                // console.log(`Info: Website is blocked..`)
                throw "Error"
            }


            // const input = await Apify.getValue('INPUT');
            const input = global.inputData;
            if (input.directurl) {

                var directurl = input.directurl;

                // ZNS test
                // 선택 옵션
                // var prdUrl = "https://www.amazon.com/Nutricost-N-Acetyl-L-Cysteine-Veggie-Capsules/dp/B07983MH53/ref=sr_1_303?dchild=1&keywords=Glutathione&qid=1590120117&sr=8-303";
                // var prdUrl = "https://www.amazon.com/Coromega-Supplement-Omega-3s-Absorption-Softgels/dp/B000FFQATA/ref=sr_1_41?dchild=1&keywords=Kids+Omega+3&qid=1594881118&sr=8-41";
                // var prdUrl = "https://www.amazon.com/Superfoods-Variaci%C3%B3n-para-ni%C3%B1os-1/dp/B06XYTMP82/ref=sr_1_57_sspa?dchild=1&keywords=Kids+Omega+3&qid=1594882934&sr=8-57-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUEyV1RBOEtBMEJaUlRSJmVuY3J5cHRlZElkPUEwNTMyNjA1MjJVQjQ5OE1EVE00WCZlbmNyeXB0ZWRBZElkPUEwMTc0Nzk5MTlKRzBTTFVKSUdGTCZ3aWRnZXROYW1lPXNwX2J0ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=";


                // 단일 옵션
                // var prdUrl = "https://www.amazon.com/Mini-Melissa-Ultragirl-Princess-Toddler/dp/B07P927Y5S/ref=sr_1_17?dchild=1&keywords=Mini+Melissa&qid=1587865864&sr=8-17";
                // 단일 + 복합 옵션
                // var prdUrl = "https://www.amazon.com/Mini-Melissa-Girls-Toddler-Orange/dp/B01015QOGC/ref=sr_1_2?dchild=1&keywords=Mini%2BMelissa&qid=1587741866&sr=8-2&th=1&psc=1";
                // var prdUrl = "https://www.amazon.com/Calvin-Klein-Microfiber-Stretch-Multipack/dp/B01G3CQVQ0/ref=sr_1_9?dchild=1&keywords=CK+Boys+Underwear&qid=1593067533&sr=8-9";

                // 단일 + 복합 + 스페셜 옵션
                // var prdUrl = "https://www.amazon.com/Mini-Melissa-Campana-Zig-Zag/dp/B077FHGNG6/ref=sr_1_15?dchild=1&keywords=Mini+Melissa&qid=1587865864&sr=8-15";
                // var prdUrl = "https://www.amazon.com/Mini-Melissa-Campana-Zig-Zag/dp/B077FHGNG6/ref=sr_1_15?dchild=1&keywords=Mini+Melissa&qid=1587865864&sr=8-15";
                // var prdUrl = "https://www.amazon.com/Alex-Vando-Shirts-Regular-Sleeve/dp/B0721PL5W1?pf_rd_r=98VZ13MQM75BV2DRR9PQ&pf_rd_p=ad021af6-b7b0-4b98-946a-3a6865266868&pd_rd_r=70e62963-12ef-417d-aff0-49b5b0f70309&pd_rd_w=A765n&pd_rd_wg=v2ceE&ref_=pd_gw_unk&th=1";

                // 역대급
                // var prdUrl = "https://www.amazon.com/Crocs-3945-LITTLES-FUCHSIA-2-P-Classic-Clogs/dp/B07Y5XDZQP?pf_rd_r=Y67X6MS8W5SJJS8T9VHD&pf_rd_p=d073d332-fd9e-516e-867f-8035888d62ed&pd_rd_r=77d5bc2f-9535-4bc9-9993-f009fedcc9f6&pd_rd_w=G9Pz6&pd_rd_wg=0kXZm&ref_=pd_gw_ri";
                // var prdUrl = "https://www.amazon.com/Wilson-A2000-Infield-Baseball-Glove/dp/B07FQS5TN4/ref=sr_1_21?dchild=1&keywords=baseball+glove&qid=1594791125&sr=8-21";

                // 2020-05-18 신규 - 플레이버 옵션 추가
                // var prdUrl = "https://www.amazon.com/Hills-Instant-Cappuccino-Salted-Caramel/dp/B01N4NXBME/ref=sr_1_167_sspa?dchild=1&keywords=Big%2BTrain%2BCoffee&qid=1589601148&sr=8-167-spons&th=1";
                // var prdUrl = "https://www.amazon.com/Universal-Jurassic-Microfiber-Comforter-Bedding/dp/B07HC6CJNV/ref=sr_1_82_sspa?dchild=1&keywords=Jurassic+World+Figures&qid=1594093740&sr=8-82-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUExUEgwQUQzME83NldSJmVuY3J5cHRlZElkPUEwNTc1Nzc4MzNaVjZBQjQwV01JQiZlbmNyeXB0ZWRBZElkPUEwMDMxOTIzMVJKVFA4TE9TNVpEUSZ3aWRnZXROYW1lPXNwX210ZiZhY3Rpb249Y2xpY2tSZWRpcmVjdCZkb05vdExvZ0NsaWNrPXRydWU=";

                // 2020-07-08 신규 - 스타일 옵션 추가
                // var prdUrl = "https://www.amazon.com/Melissa-Doug-Pretend-Kitchen-Dispenser/dp/B00BH0TSGY/ref=sxin_7?ascsubtag=amzn1.osa.0ed8a91a-0b38-4152-8d1e-b0b916a5dcb5.ATVPDKIKX0DER.en_US&creativeASIN=B00BH0TSGY&cv_ct_cx=Melissa+And+Doug&cv_ct_id=amzn1.osa.0ed8a91a-0b38-4152-8d1e-b0b916a5dcb5.ATVPDKIKX0DER.en_US&cv_ct_pg=search&cv_ct_wn=osp-single-source&dchild=1&keywords=Melissa+And+Doug&linkCode=oas&pd_rd_i=B00BH0TSGY&pd_rd_r=c2693cb1-3192-4162-8fdb-4f5863067faa&pd_rd_w=y3j6t&pd_rd_wg=zPqAB&pf_rd_p=ad792221-7c05-4384-852b-971b142fa109&pf_rd_r=PHAP94HW5FD9V89S3CR0&qid=1594179965&sr=1-4-72d6bf18-a4db-4490-a794-9cd9552ac58d&tag=scripps-spellingbee-20";


                // 2020-07-14 신규 - 탭형 옵션 추가
                // var prdUrl = "https://www.amazon.com/dp-B01HCZJB7S/dp/B01HCZJB7S/ref=mt_other?_encoding=UTF8&me=&qid=1594629935";
                // var prdUrl = "https://www.amazon.com/Phonics-Phonemic-Awareness-Analysis-Teachers-dp-0134169786/dp/0134169786/ref=mt_other?_encoding=UTF8&me=&qid=1594629935";
                // var prdUrl = "https://www.amazon.com/PowerNet-Weighted-Training-Technique-Coordination/dp/B01MRUYXPM/ref=sr_1_20?dchild=1&keywords=sklz%2Bbaseball&qid=1594790392&sr=8-20&th=1";

                // 2020-07-14 신규 문제
                // var prdUrl = "https://www.amazon.com/Nordic-Naturals-Ultimate-Omega-Junior/dp/B004UJCIZM/ref=sr_1_2?dchild=1&keywords=Kids%2BOmega%2B3&qid=1594626111&sr=8-2&th=1";
                // var prdUrl = "https://www.amazon.com/Hooked-Phonics-Learn-Read-Readers/dp/1940384168/ref=sr_1_154?dchild=1&keywords=Phonics&qid=1594778520&sr=8-154";

                // 이모티콘.
                // var prdUrl = "https://www.amazon.com/Black-Rifle-Coffee-Company-Ground/dp/B07DT75MS5/ref=sr_1_107_sspa?dchild=1&keywords=Big+Train+Coffee&qid=1589601125&sr=8-107-spons&psc=1&spLa=ZW5jcnlwdGVkUXVhbGlmaWVyPUFZV1ZNUDhESzhGQUEmZW5jcnlwdGVkSWQ9QTAzMTQ3ODExOE0yTUFCTTQ3REkxJm";
                // var prdUrl = "https://www.amazon.com/Calvin-Klein-Microfiber-Stretch-Multipack/dp/B01G3CQVQ0/ref=sr_1_7?dchild=1&keywords=CK+Boys+Underwear&qid=1593753398&sr=8-7";

                // 2020-11-22 허웅 - DB 연동.
                for( var k in directurl ){

                    var prdUrl = `${decodeURIComponent( directurl[k])}`;

                    // console.log("======================");
                    // console.log(prdUrl);
                    // console.log("======================");
                    // return false;

                    await requestQueue.addRequest(new Apify.Request({ url: prdUrl, userData: { sourceUrl: prdUrl, pagetype: "ITEM_PAGE", shippingtype: "C", "amamzon_type": 's' } }));
                }
                return false;
                // ZNS test

            }


            var data = [];

            function getUrlParameter(name) {
                name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
                var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
                var results = regex.exec(location.search);
                return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
            };


            //ZNS  추가  아마존 일반상품 Fresh 상품 구분
            var tmp = new URL(request.url);
            var amamzon_type = tmp.searchParams.getAll("i"); // 추가됨..
            var country_code_tmp = tmp.host.split('.');

            //  https://www.amazon.de 독일 url
            //  https://www.amazon.it  이탈리아 url
            //  https://www.amazon.sg  싱가폴 url

            var country_code = "us"; // 디폴트 미국

            if (country_code_tmp['3'] == 'jp') {
                country_code = country_code_tmp['3']; // 2020-08-24 기현  JP 일본 아마존 코드 뽑기.. 근대 이방법 완벽하지 않음..  다른 국가 추가 될시 코드 수정 되야 하는 부분임 ..  추후 다른 국가 추가 될시  url로 어느 국가인지 잡을수 있는 코드 필요
            }

            // // =================================
            // var $itemRowContainer = $(".s-result-list").find("div[data-asin]");
            // console.log($itemRowContainer.length);
            // var $itemRowContainer_ = $(".s-result-list .a-section");
            // console.log($itemRowContainer_.length);
            // return;
            // // =================================
            // console.log(html);
            // return;

            var $itemRowContainer = $(".s-result-list").find("div[data-asin]");

            $itemRowContainer.each(function(nodeCount, itemNode) {


                if ($(itemNode).attr("data-asin")) {

                    var $urlnode = $(itemNode).find("span[data-component-type='s-product-image'] a");
                    var itemUrl = $urlnode.attr("href");

                    var $primenode = $(itemNode).find("span[class='aok-relative s-icon-text-medium s-prime'] i");
                    var itemShippingType = $primenode.attr("aria-label");

                    // Amazon プライム ---> 아마존 프라임

                    // 2020-08-24  기현 아마존  shiptype 통일 -
                    if (itemShippingType == 'Amazon プライム') { // 일본
                        itemShippingType = "Amazon Prime";
                    }

                    //2020-04-11 클라이언트 요청사항. 프라임만 넣기. // 2020-04-16 클라이언트 요청사항 아마존 일반상품 fresh 상품 구분
                    if (amamzon_type[0] == "amazonfresh") {
                        data.push({ Url: itemUrl, ShippingType: itemShippingType });
                    } else {

                        //2020-10-05 기현 주석  ※ 정승주님 요청 prime 제품 아니여도 모두 수집되도록 요청
                        //if (itemShippingType == "Amazon Prime") {
                        data.push({ Url: itemUrl, ShippingType: itemShippingType });
                        //}

                    }
                }

            });

            //return;




            // var $itemRowContainer_v2 = $(".s-result-list .a-section");

            // $itemRowContainer_v2.each(function(nodeCount, itemNode) {
            //     var itemUrl = $(itemNode).find(".sg-row:nth-child(2)").find(".sg-col-inner").find("a.a-link-normal").attr("href");
            //     var itemShippingType = $(itemNode).find(".a-icon-prime").attr("aria-label");
            //     if (!itemShippingType) { itemShippingType = ""; }

            //     data.push({Url: itemUrl, ShippingType: itemShippingType});
            // });

            // // =================================
            // if (templateType == "V2") {
            //     var $itemRowContainer = $(".s-result-list").find("div[data-asin]");

            //     $itemRowContainer.each(function(nodeCount, itemNode) {
            //         var $urlnode = $(itemNode).find("span[data-component-type='s-product-image'] a");
            //         var itemUrl = $urlnode.attr("href");
            //         var itemShippingType = "";

            //         data.push({Url: itemUrl, ShippingType: itemShippingType});
            //     })
            // }
            // else {
            //     var $itemRowContainer = $(".s-result-list .a-section");

            //     $itemRowContainer.each(function(nodeCount, itemNode) {
            //         var itemUrl = $(itemNode).find(".sg-row:nth-child(2)").find(".sg-col-inner").find("a.a-link-normal").attr("href");
            //         var itemShippingType = $(itemNode).find(".a-icon-prime").attr("aria-label");
            //         if (!itemShippingType) { itemShippingType = ""; }

            //         data.push({Url: itemUrl, ShippingType: itemShippingType});
            //     });
            // }
            // // =================================

            // 2020-08-24  기현 추가 나라별 url
            var amazon_url_list = { "us": "https://www.amazon.com", "jp": "https://www.amazon.co.jp" };


            for (const itemData of data) { // # 상품 URL 리스팅 입력.

                //var prdUrl = "https://www.amazon.com" + itemData.Url;
                var prdUrl = amazon_url_list[country_code] + itemData.Url; //  2020-08-24  기현  변경

                // 중복제거 하는 아이템을 그냥 만들자 ....
                // const url = new URL(prdUrl);
                // url.searchParams.set("qid", timestamp);
                // url.searchParams.set("sr", "");
                // url.searchParams.set("ref", "");
                // prdUrl = url.toString();

                var itemShippingType = itemData.ShippingType;


                if (itemData && itemData.Url) {
                     await requestQueue.addRequest(new Apify.Request({ url: prdUrl, userData: { sourceUrl: prdUrl, pagetype: "ITEM_PAGE", shippingtype: itemShippingType, "amamzon_type": amamzon_type[0], npage: npage ? npage : 1 } }));
                }
            }



            // Paging 리스팅 입력.
            if (getPaging) {
                var page_arr = pagenum.split('-');
                if (page_arr[0].toLowerCase() != "auto" || !page_arr[0]) { // no start pages  Will end page go
                    var lastpgNode = $(".a-pagination .a-last").prev();
                    var stpg = 1;
                    var lastpg = lastpgNode.text();
                } else {
                    var stpg = page_arr['0'];
                    var lastpg = page_arr['1'];
                }

                for (var pgI = stpg; pgI <= lastpg; pgI++) {
                    prdUrl = request.url + "&page=" + pgI;

                    await requestQueue.addRequest(new Apify.Request({ url: prdUrl, userData: { sourceUrl: prdUrl, pagetype: "CATEGORY_PAGING", npage: pgI } }));
                }
            }

            /* ZNS
            if (getPaging) {
                var lastpgNode = $(".a-pagination .a-last").prev();
                var lastpg = lastpgNode.text();
                var pgIndex = [];

                for (var pgI = 2; pgI <= lastpg; pgI++) {
                    pgIndex.push(pgI);
                }

                // Add paging urls to the queue
                for (const pgIdx of pgIndex) {
                    prdUrl = request.url + "&page=" + pgIdx;
                    await requestQueue.addRequest(new Apify.Request({ url: prdUrl, userData: { sourceUrl: prdUrl, pagetype: "CATEGORY_PAGING" } }));
                }
            }
            */
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async({ request, error }) => {
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
        handlePageFunction: async({ request, html, $ }) => {
            console.log(`ProcessCategories: Cheerio Processing ${request.url} ..`);

            $("#merchandised-content .a-column a").each(function() {
                var prdUrl = "https://www.amazon.com" + $(this).attr("href");
                outputUrls.push(prdUrl);
            });
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async({ request, error }) => {
            console.log(`Request ${request.url} failed twice. ${error}`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();
    return outputUrls;
}



async function Blank_test_cw(startUrl) {

    console.log("startUrl===>" + startUrl);

    const env = await Apify.getEnv()
    const input = [{
        "url": startUrl
    }]

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
        handlePageFunction: async({ request, html, $ }) => {
            console.log(`product_detail____: Cheerio Processing ${request.url} ..`);
        },

        // This function is called if the page processing failed more than maxRequestRetries+1 times.
        handleFailedRequestFunction: async({ request, error }) => {
            console.log(`Request ${request.url} failed twice. ${error}`);
        },
    });

    // Run the crawler and wait for it to finish.
    await crawler.run();
    //return outputUrls;
}

module.exports = {
    ProcessPhrase: ProcessPhrase,
    ProcessCategories: ProcessCategories,
    ProcessSubCategory: ProcessSubCategory,
    ProcessPagedUrls: ProcessPagedUrls,
    ProcessItems: ProcessItems,
    Blank_test_cw: Blank_test_cw,
}
