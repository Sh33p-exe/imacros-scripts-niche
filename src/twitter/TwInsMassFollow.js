var jsLF = "\n";
var i, retcode, errtext, button;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
while (true) {
    var macro = "CODE:";
    macro += "SET !TIMEOUT_STEP 3" + jsLF;
    if (window.location.href.indexOf("mobile.twitter.com") >= 0) {
        macro += "TAG POS=3 TYPE=DIV ATTR=TXT:Follow" + jsLF;
    } else if (window.location.href.indexOf("instagram.com/p/") >= 0) {
        button = window.document.querySelectorAll('._qv64e._gexxb._4tgw8._njrw0');
        window.document.querySelector('._sw8c3').innerHTML = "Likes | Followed: " + count + " | Remaining: " + button.length;
        // macro += "TAG POS=2 TYPE=BUTTON ATTR=TXT:Follow" + jsLF;
        button[0].click();
        button[0].scrollIntoView();
        iimPlayCode("EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" KEYS=\"[34]\"");
    } else {
        alert("Open Mobile Twitter or Instagram Photo/Video!");
        break;
    }
    retcode = iimPlay(macro);
    if (retcode >= 0) {
        iimDisplay("Followed: " + count);
        window.scrollBy(0, 400);
        iimPlayCode("WAIT SECONDS=" + getRandomInt(2, 4));
        count++;
    } else {
        iimDisplay("Waiting for more users...");
        iimPlayCode("WAIT SECONDS=" + getRandomInt(5, 10));
    }
}
///////////////////////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}