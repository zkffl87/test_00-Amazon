/**
 * This actor crawls through the amazon pages and gets the results based on the input
 */

const Apify = require('apify');
const app = require('./src/pageprocessor');
const cheerio = require('cheerio');

Apify.main(async() => {


    console.log("차단당했습니다.");
    //return;

    const input = await Apify.getValue('INPUT');
    console.log(input);
    if (!input || !input.url) throw new Error('INPUT must contain url and searchPhrase');
    console.log("inputurl:::"+input.url);
    global.inputData = await Apify.getInput(); // 필수
    console.log(global);
    console.log(global.inputData);


    var includepaging = input.includepaging;
    console.log("includepaging::"+includepaging);
    var includepagenum = input.pages;
    console.log("includepagenum:::"+includepagenum);

    var str = input.url;
    var res = str.match(/_KEYWORD_/g);
    var addurl = "";

    if (res) { // AMAMZON FRESH
        var inputurl = str.replace("_KEYWORD_", encodeURIComponent(input.searchPhrase));
    } else { // NOMAL
        var inputurl = input.url + encodeURIComponent(input.searchPhrase);
    }

    //2020-10-05 기현 주석  ※ 정승주님 요청 prime 제품 아니여도 모두 수집되도록 요청
    // prime 검색 get 값 ( 아마존 사이트의 left menu 검색필터를 뜻함)
    // &rh=p_85%3A2470955011 --> 미국 .com
    // &rh=p_76%3A2227292051 --> 일본 .jp
    if (input.Is_Prime == true) { // 아마존 프라임 검색 유무 컨트롤

        if (inputurl.match('www.amazon.co.jp') !== null) { // 일본 .jp
            var addurl = "&rh=p_76%3A2227292051";
        } else { // 미국 .com
            var addurl = "&rh=p_85%3A2470955011";
        }
    }


    inputurl = inputurl + addurl;

    console.log(inputurl);
    return false;
    //if(input.targeturl) {
    //inputurl = "https://www.naver.com";

    // "https://www.amazon.com/s?k=broccoli+florets&i=amazonfresh&disableAutoscoping=true"; Amazon Fresh
    // inputurl = input.url + encodeURIComponent(input.searchPhrase);
    //}


    if (input.searchPhrase) {

        if (input.pages.toLowerCase() != "auto") {
            includepaging = true;
        }

        await app.ProcessPhrase(inputurl, includepaging, includepagenum);
        await app.ProcessItems();
        //await app.Blank_test_cw(url);

    } else {
        throw new Error('INPUT must contain searchPhrase');
    }



});
