var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
iimPlayCode("URL GOTO=https://ksa-numbers.com/");
while (true) {
    var number = getRandomLen(8);
    iimDisplay("Number: " + number);
    iimPlayCode("TAG POS=1 TYPE=INPUT:SEARCH ATTR=NAME:number CONTENT=05" + number);
    iimPlayCode("TAG POS=1 TYPE=BUTTON ATTR=ID:sbutton&&CLASS:silverBtn&&DIR:rtl&&ONCLICK:loading()");
    iimPlayCode("WAIT SECONDS=5");
    var results = window.document.querySelectorAll('.odd.resultRow');
    if (results.length) {
        var macro = "CODE:";
        macro += "SET !ERRORIGNORE YES" + jsLF;
        macro += "SET !EXTRACT {{number}}" + jsLF;
        for (var index = 0; index < results.length; index++)
            macro += "ADD !EXTRACT {{result" + index + "}}" + jsLF;
        macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=KSANumbers.csv" + jsLF;
        iimSet("number", "05" + number);
        for (var index = 0; index < results.length; index++)
            iimSet("result" + [index], results[index].innerText);
        iimPlay(macro);
        iimPlayCode("REFRESH");
    } else
        iimPlayCode("REFRESH");
    iimPlayCode("WAIT SECONDS=" + getRandomInt(1, 5));
}

function getRandomLen(len) {
    len += 2;
    return Math.random().toString().slice(2, len);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}