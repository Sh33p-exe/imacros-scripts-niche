////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface
////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description This function will activate built-in iMacros Debug for every single step with more advanced algorithm to track changes
 * Also it adds a support for iMacros Developer Tools, which makes the script debug easy with a little knowledge in HTML Basics and Developer Tools.
 */
function onDebug() {
    if (EASY_DEBUG_MODE) {
        window.console.log(`%ciMacros DEBUG MODE IS ACTIVATED`, 'background: red; color: white');
        let first_time = 0;
        if (!first_time) {
            iimPlayCode("SET !USERAGENT " + USER_AGENT_STRING + "\n");
            first_time = 1;
        }
        activate_debugg = "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES";
        return activate_debugg;

    }
}
var jsLF = "\n";
var i, retcode, errtext, xtweet;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;

//For Windows paths only!
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';
var imdown = imfolder + '\\Downloads\\';
var immacros = imfolder + '\\Macros\\';

var tweet = "CODE:" + onDebug();
tweet += "SET !ERRORIGNORE YES" + jsLF;
tweet += "URL GOTO=https://mobile.twitter.com/compose/tweet" + jsLF;
tweet += "TAG POS=1 TYPE=INPUT:FILE ATTR=ACCEPT:image/jpeg,image/png,image/webp,image/gif&&CLASS:*&&MULTIPLE:&&TYPE:file CONTENT=" + imdown + "tw.jpg" + jsLF;
tweet += "TAG POS=1 TYPE=TEXTAREA ATTR=AUTOCAPITALIZE:sentences&&AUTOCOMPLETE:on&&AUTOCORRECT:on&&PLACEHOLDER:*&&DATA-TESTID:tweet-textarea&&DIR:auto&&TXT: CONTENT={{xtweet}}" + jsLF;
tweet += "URL GOTO=javascript:document.querySelectorAll('div[role=\"button\"]')[1].click();" + jsLF;

var ucopy = prompt("Copy Tweets From Account:");

while (true) {
    iimPlayCode("URL GOTO=https://mobile.twitter.com/" + ucopy);

    iimPlayCode("WAIT SECONDS=5");
    var c_tw = window.document.querySelectorAll('div[class^=\"_10YWDZsG\"]')[0].innerText;
    iimDisplay(c_tw);

    if (c_tw.indexOf(xtweet) >= 0) {
        iimPlayCode("WAIT SECONDS=5");
    } else {
        iimPlayCode("URL GOTO=javascript:document.querySelectorAll('div[role=\"article\"]')[0].click();");
        iimPlayCode("SET !ERRORIGNORE YES\nWAIT SECONDS=5\nONDOWNLOAD FOLDER=* FILE=tw.jpg WAIT=YES\nTAG POS=1 TYPE=IMG ATTR=ALT:&&SRC:https://*.jpg:small&&CLASS:* CONTENT=EVENT:SAVEPICTUREAS\nWAIT SECONDS=3");
        xtweet = window.document.querySelector('._1FNeQSx_').textContent;

        iimSet("xtweet", xtweet);
        iimPlay(tweet);

        iimPlayCode('WAIT SECONDS=10');
    }
}