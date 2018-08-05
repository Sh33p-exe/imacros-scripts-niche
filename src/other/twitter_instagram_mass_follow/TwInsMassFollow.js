////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //please note that change useragent may change the whole website interface
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
let i, retcode, errtext, count = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
while (true) {
    let macro = "CODE:" + onDebug();
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