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
//Variable for iMacros built-in memory to remember the next loop session by using new lines between every command for iMacros.
var jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext, count = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
if (window.document.URL.indexOf("/following" >= 0)) {
    iimPlayCode("EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHARS=- MODIFIERS=CTRL");
    while (true) {
        let profile = window.document.querySelectorAll('.ProfileCard-screenname');

        if (count < profile.length) {
            let profile = window.document.querySelectorAll('.ProfileCard-screenname');
            let stat = window.document.querySelectorAll('.ProfileCard-screenname')[count].innerHTML;
            if (stat.indexOf('FollowStatus') === -1) {
                window.document.querySelectorAll('.EdgeButton.EdgeButton--danger.EdgeButton--small.button-text.unfollow-text')[eval(count + 3)].click();
                window.document.querySelectorAll('.EdgeButton.EdgeButton--danger.EdgeButton--small.button-text.unfollow-text')[eval(count + 3)].scrollIntoView();
            }
            iimPlayCode("WAIT SECONDS=0.30");
            if (isEven(count))
                iimPlayCode("EVENT TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" KEY=35");
            iimDisplay("user: " + count);
            count++;
        }
        window.scrollBy(0, 90);
    }
} else {
    alert("Please open followers page.");
}
///////////////////////////////////////////////////////////////////////////////////////
function isEven(n) {
    return n % 2 === 0;
}
