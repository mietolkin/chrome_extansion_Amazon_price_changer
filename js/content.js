init();

async function init() {
    // Geting ID of price block///////////////////////////////////

    let price = document.getElementById("priceblock_ourprice");
    let price2 = document.getElementById("price_inside_buybox");

    //////////////////////////////////////////////////////////////


    /////////////////// Sending price to background /////////////
    chrome.runtime.sendMessage(new ExtensionMessage(config.keys.getBackgroundMessage, { price: `${price.innerHTML}` }))
    /////////////////////////////////////////////////////////////

    /////////////////// Getting data from background ///////////
    let result = await requestBackground(new ExtensionMessage(config.keys.requestBackground, { message: "Request to background" }))
    console.log(result.price);
    ////////////////////////////////////////////////////////////

    // Display price on the page////////////////////////////////
    price.innerHTML = "£" + result.price;
    price2.innerHTML = "£" + result.price;
    ///////////////////////////////////////////////////////////
}