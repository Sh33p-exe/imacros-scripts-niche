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
let imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
let myimg = imfolder + "Downloads";
let datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');
/**
 * 
 * @param {String} input datasource file path
 * @returns total file lines
 */
function getFileLines(file_path) {
    const CRLF = "\r\n";
    const LF = "\n";
    let lines = [];
    let file_i = imns.FIO.openNode(file_path);
    let text = imns.FIO.readTextFile(file_i);
    let eol = (text.indexOf(CRLF) == -1) ? LF : CRLF;
    lines = text.split(eol);
    eol = lines.length;
    return eol;
}
let windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
for (let index = 1; index < getFileLines(datapath + "TwitterAccounts.csv"); index++) {
    let macro = "CODE:" + onDebug();
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "TAB T=1" + jsLF;
    macro += "CLEAR" + jsLF;
    macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
    macro += "SET !DATASOURCE_COLUMNS 2" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "URL GOTO=https://twitter.com/login" + jsLF;
    macro += "TAG POS=2 TYPE=INPUT:TEXT FORM=ACTION:https://twitter.com/sessions ATTR=NAME:session[username_or_email] CONTENT={{!COL1}}" + jsLF;
    macro += "SET !ENCRYPTION NO" + jsLF;
    macro += "TAG POS=2 TYPE=INPUT:PASSWORD FORM=ACTION:https://twitter.com/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF;
    macro += "TAG POS=1 TYPE=BUTTON FORM=ACTION:https://twitter.com/sessions ATTR=TXT:*<SP>*" + jsLF;
    macro += "TAG POS=" + getRandomInt(1, 9) + " TYPE=A ATTR=CLASS:pretty-link<SP>js-nav<SP>js-tooltip<SP>u-linkComplex&&HREF:/hashtag/*?src=tren&&DATA-QUERY-SOURCE:trend_click&&DATA-ORIGINAL-TITLE: EXTRACT=TXT" + jsLF;
    macro += "TAB T=1" + jsLF;
    macro += "SET !DATASOURCE tweets.txt" + jsLF;
    macro += "SET !DATASOURCE_COLUMNS 2" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "URL GOTO=https://twitter.com/" + jsLF;
    macro += "TAG POS=1 TYPE=BUTTON ATTR=ID:global-new-tweet-button" + jsLF;
    macro += "EVENT TYPE=CLICK SELECTOR=\"#tweet-box-global\" BUTTON=0" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:FILE FORM=ACTION://upload.twitter.com/i/tweet/* ATTR=NAME:media_empty CONTENT={{!COL2}}" + jsLF;
    macro += "EVENTS TYPE=KEYPRESS SELECTOR=\"#tweet-box-global\" CHARS={{!COL1}}<BR>{{!EXTRACT}}" + jsLF;
    macro += "EVENT TYPE=CLICK SELECTOR=\"#global-tweet-dialog-dialog>DIV:nth-of-type(2)>DIV:nth-of-type(4)>FORM>DIV:nth-of-type(3)>DIV:nth-of-type(2)>BUTTON\" BUTTON=0" + jsLF;
    iimSet("loop", index);
    iimPlay(macro);
}
///////////////////////////////////////////////////////////////////////////////////////
/**
 * 
 * @param {String} input datasource file path
 * @returns total file lines
 */
function getFileLines(file_path) {
    const CRLF = "\r\n";
    const LF = "\n";
    let lines = [];
    let file_i = imns.FIO.openNode(file_path);
    let text = imns.FIO.readTextFile(file_i);
    let eol = (text.indexOf(CRLF) == -1) ? LF : CRLF;
    lines = text.split(eol);
    eol = lines.length;
    return eol;
}