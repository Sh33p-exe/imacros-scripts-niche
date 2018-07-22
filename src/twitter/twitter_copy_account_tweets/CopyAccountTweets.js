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
      return "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES\n";
    } else
      return '';
  }
//Variable for iMacros built-in memory to remember the next loop session by using new lines between every command for iMacros.
var jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext, count = 0, xTweet;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
//For Windows paths only!
let filename = iMacros._currentMacro.name;
let imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
let imdata = imfolder + '\\Datasources\\'; //Datasources path
let imdown = imfolder + '\\Downloads\\'; //Downloads path
let immacros = imfolder + '\\Macros\\'; //Macros scripts path
let tweet = "CODE:" + onDebug(); //Start code and add debug support
tweet += "SET !ERRORIGNORE YES" + jsLF; //Ignore code errors
tweet += "URL GOTO=https://mobile.twitter.com/compose/tweet" + jsLF; //open tweets page
tweet += "TAG POS=1 TYPE=INPUT:FILE ATTR=ACCEPT:image/jpeg,image/png,image/webp,image/gif&&CLASS:*&&MULTIPLE:&&TYPE:file CONTENT=" + imdown + "twitter_post.jpg" + jsLF; //Upload post images
tweet += "TAG POS=1 TYPE=TEXTAREA ATTR=AUTOCAPITALIZE:sentences&&AUTOCOMPLETE:on&&AUTOCORRECT:on&&PLACEHOLDER:*&&DATA-TESTID:tweet-textarea&&DIR:auto&&TXT: CONTENT={{xTweet}}" + jsLF; //type tweet
tweet += "URL GOTO=javascript:document.querySelectorAll('div[role=\"button\"]')[1].click();" + jsLF; //confirm tweet and submit it
let ucopy = prompt("Copy Tweets From Account:");
while (true) {
    iimPlayCode("URL GOTO=https://mobile.twitter.com/" + ucopy); //Copy account
    iimPlayCode("WAIT SECONDS=5"); //Wait 5 seconds later
    let c_tw = window.document.querySelectorAll('div[class^=\"_10YWDZsG\"]')[0].innerText; //push text
    iimDisplay(c_tw); //display text in the panel
    //Check if pushed tweet exist in the page
    if (c_tw.indexOf(xTweet) >= 0) {
        iimPlayCode("WAIT SECONDS=5");
    } else {
        iimPlayCode("URL GOTO=javascript:document.querySelectorAll('div[role=\"article\"]')[0].click();"); //submit  button
        //Then upload tweet image and submit it
        iimPlayCode("SET !ERRORIGNORE YES\nWAIT SECONDS=5\nONDOWNLOAD FOLDER=* FILE=tw.jpg WAIT=YES\nTAG POS=1 TYPE=IMG ATTR=ALT:&&SRC:https://*.jpg:small&&CLASS:* CONTENT=EVENT:SAVEPICTUREAS\nWAIT SECONDS=3");
        xTweet = window.document.querySelector('._1FNeQSx_').textContent; //input tweet text content
        iimSet("xTweet", xTweet);
        iimPlay(tweet);
        iimPlayCode('WAIT SECONDS=10'); //Wait 10 seconds  then go to the next
    }
}