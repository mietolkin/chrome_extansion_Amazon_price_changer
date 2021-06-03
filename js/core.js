class ExtensionMessage{
    constructor(context, data){
        this.context = context;
        this.data = data;
    }
};

//To Save Data From storage
function storageSet({key, value}){
    return new Promise((resolve) => {
        chrome.storage.local.set({[key]: value}, function() {
            resolve();
          });
    });
}

function storageSetMultiple(...objects){
    let obj = {};
    objects.map(property => obj[property.key] = property.value);
    
    return new Promise((resolve) => {
        chrome.storage.sync.set(
            obj, 
            () =>{resolve();}
        );
    });
}

//To Read Data From Storage
function storageGet(key){
    return new Promise((resolve) => {
        chrome.storage.local.get([key], function(result) {
            resolve(result[key]);
        });
    });
}

function sendPageMessage(data, specificID = null){
    return new Promise((resolve) =>{
        chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
            if((tabs && tabs.length) || specificID){
                tabID =specificID || tabs[0].id;
                chrome.tabs.sendMessage(tabID, data);
          
                resolve();
            }
        });
    });
}

function elementAppear(selector, all = false, parent = null){
    var cycles = 0;
    return new Promise((resolve) => {
        let id = setInterval(function(){
            cycles++;
            let element;

            if(all == false){
                if(parent != null){
                    element = parent.querySelector(selector);
                }else{
                    element = document.querySelector(selector);
                }
            }else{
                if(parent != null){
                    element = parent.querySelectorAll(selector);
                }else{
                    element = document.querySelectorAll(selector);
                }
            }

            if(all && (element.length > 0 || cycles>100)){
                clearInterval(id);
                resolve(element);
            }
            
            if((element || cycles>100) && all == false){
                clearInterval(id);
                resolve(element);
            }
        }, 100);
    });
}

function forSeconds(seconds){
    return new Promise((resolve) =>{setTimeout(function(){resolve()}, seconds * 1000)});
}

function requestBackground(request){
    return new Promise((resolve) =>{
        var handler = ({context, data}) => {
            if(context == request.context){
                chrome.runtime.onMessage.removeListener(handler);
                resolve(data);
            }
        };
        chrome.runtime.onMessage.addListener(handler);
        chrome.runtime.sendMessage(new ExtensionMessage(request.context, request.data));
    });
}

function executeFunction(functionName, data, context = window) {
    var namespaces = functionName.split(".");
    var func = namespaces.pop();
    for(var i = 0; i < namespaces.length; i++) {
      context = context[namespaces[i]];
    }
    return context[func].call(null, data);
  }