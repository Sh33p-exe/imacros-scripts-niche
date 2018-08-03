////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only, Also to activate all other variables you must activate easy debug mode first to true OR 1.
const EASY_DEBUG_MODE = true; //To active built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface.
////////////////////////////////////////////////////////////////////////////////////////
//Variable for iMacros built-in memory to remember the next loop session by using new lines between every command for iMacros.
let jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext, count = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
//A method to access iMacros interface
let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
let filename = iMacros._currentMacro.name; //Get Script Name
let folder_mydata = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\'); //Get Datasources Folder Path
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
        return "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES\nSET !ERRORIGNORE NO";
    } else
        return '';
}

////////////////////////////////////////////////////////////////////////////////////////
// Macro Section
///////////////////////////////////////////////////////////////////////////////////////
var macro = "CODE:" + onDebug();
macro += "CLEAR" + jsLF;
macro += "SET !DATASOURCE_DELIMITER :" + jsLF; //set delimter by :
macro += "SET !DATASOURCE " + txtfile + jsLF; //datasource file
macro += "SET !DATASOURCE_COLUMNS 2" + jsLF; //columns
macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF; //loop session
macro += "URL GOTO=https://m.facebook.com/" + jsLF; //open facebook
macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login_form ATTR=ID:m_login_email CONTENT={{!COL1}}" + jsLF; //username 
macro += "SET !ENCRYPTION NO" + jsLF;
macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login_form ATTR=NAME:pass CONTENT={{!COL2}}" + jsLF; //password
macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=NAME:login" + jsLF; //submit

var pageurl = prompt("Enter Page URL (m.facebook.com/username):");
try {
    window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading..</h2></center>';
} catch (err) {
    alert("Error! <br>" + err + "<br> Please contact with script developer.");
}

for (var i = 1; i <= acco; i++) {
    iimSet("loop", i);
    iimPlay(macro);
    iimPlayCode("URL GOTO=" + pageurl);
    for (var index = 1; index < 4; index++) {
        iimSet("loop", index);
        iimPlayCode("TAG POS={{loop}} TYPE=A ATTR=TXT:Like");
    }
}