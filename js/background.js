/////Variables////////////////////////////////

var extensionValue = "Test value";
let linkAPI = "https://api.coindesk.com/v1/bpi/currentprice.json"; // API Link
let PriceToUsd = null; // Will get data from API
let currencies = null; // Will get data from convert function


chrome.runtime.onMessage.addListener(
    function (message, sender) {
        executeFunction(message.context, { message, sender });
    }
);

///Functions//////////////////////////////////

async function getBackgroundInfo({ message, sender }) {
    //For popup response
    chrome.extension.sendMessage(new ExtensionMessage(message.context, { extensionValue }));

    //for Content script response
    sendPageMessage(new ExtensionMessage(message.context, { extensionValue }), sender.tab.id);
};

async function getBackgroundMessage({ message, sender }) {

    currenciesUSD = currencies.bpi.GBP.rate_float;

    console.log(currenciesUSD);

    priceToUsd = Math.ceil((Number(message.data.price.slice(1)) / currencies.bpi.USD.rate_float * currencies.bpi.GBP.rate_float) * 100) / 100;
};


async function requestBackground({ message, sender }) {

    console.log(message.data);

    sendPageMessage(new ExtensionMessage(message.context, { price: `${priceToUsd}` }), sender.tab.id)


};
///////////////////////////////////////////


////Get currencies Data from API//////////////////////

async function sendRequest(method, url, body = 0) {
    return fetch(url).then(response => { return response.json(); });
}

sendRequest('GET', linkAPI).then(data => {

    currencies = data;
    console.log(currencies)
});
//////////////////////////////////////////////