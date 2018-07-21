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
  let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIWebNavigation)
  .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
  .QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIDOMWindow).iMacros;
  let filename = iMacros._currentMacro.name;
  let datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');
  let txtfile = "TwitterAccounts.txt";

 function AppsaveAs(user) {
     iimSet("usr", user);
     iimPlayCode("SET !EXTRACT {{usr}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=twitterappsubs.txt");
 }

 let lines = +prompt('How many accounts do you have?');
 for (let index = 1; index < lines; index++) {
     let Subs = "CODE:" + onDebug();
     Subs += "SET !ERRORIGNORE YES" + jsLF;
     Subs += "CLEAR" + jsLF;
     Subs += "SET !TIMEOUT_STEP 3" + jsLF;
     Subs += "SET !DATASOURCE_DELIMITER :" + jsLF;
     Subs += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
     Subs += "SET !DATASOURCE_COLUMNS 3" + jsLF;
     Subs += "SET !DATASOURCE_LINE " + index + jsLF;
     Subs += "URL GOTO=http://www.alshqrdyh.com/twitter/login" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:oauth_form ATTR=ID:username_or_email CONTENT={{!COL1}}" + jsLF;
     Subs += "SET !ENCRYPTION NO" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:oauth_form ATTR=ID:password CONTENT={{!COL2}}" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:oauth_form ATTR=ID:allow" + jsLF;
     Subs += "SET !TIMEOUT_STEP 0" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{!COL3}}" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=CLASS:&&NAME:&&ID:allow&&TABINDEX:&&VALUE:*&&TYPE:submit" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:oauth_form ATTR=VALUE:*&CLASS:submit<SP>button<SP>selected&&ID:allow&&TYPE:submit" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:oauth_form ATTR=ID:allow" + jsLF;
     Subs += "SET !EXTRACT {{!COL1}}" + jsLF;
     iimPlay(Subs);
     let user = iimGetLastExtract();
     AppsaveAs(user);

     iimDisplay("Current: " + index);
 }