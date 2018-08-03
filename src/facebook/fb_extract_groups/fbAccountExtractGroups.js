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
////////////////////////////////////////////////////////////////////////////////////////
// Functions Section
///////////////////////////////////////////////////////////////////////////////////////
/** @returns total lines of any file path */
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
macro += "SET !TIMEOUT_STEP 3" + jsLF;
macro += "TAG POS={{loop}} TYPE=LI ATTR=CLASS:bo EXTRACT=TXT" + jsLF; //extract group name
macro += "ADD loop 1" + jsLF;
macro += "TAG POS={{loop}} TYPE=A ATTR=HREF:/groups/*?refid=* EXTRACT=HREF" + jsLF; //extract group url
//////////////////////////////////////////////////////////////////////////////////////
// iimPlayCode("SET !USERAGENT \"\"");
iimPlayCode("URL GOTO=https://m.facebook.com/groups/?category=groups&ref=group_browse");
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
for (var i = 1;; i++) {
    try {
        window.document.querySelector('#m_more_item > a:nth-child(1) > span:nth-child(1)').click();
    } catch (error) {
        window.scrollBy(0, 2000);
    }
    iimSet("loop", i);
    retcode = iimPlay(macro);
    if (retcode < 0) {
        alert("Extracted:" + " " + i + " " + "Group");
        break;
    } else {
        var gname = iimGetLastExtract(1);
        var gurl = iimGetLastExtract(2);
    }

    iimDisplay("Groups:" + " " + i);
    if (gname !== "#EANF#") {
        iimSet("name", gname);
        iimSet("link", gurl.replace(/m\.|\?refid=(.*)/g, ''));
        iimPlayCode("SET !DATASOURCE_DELIMITER ;\nSET !ERRORIGNORE YES\nSET !EXTRACT {{name}}\nADD !EXTRACT {{link}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=fbgroupsurl.csv");
    } else {
        alert("Extracted:" + " " + i + " " + "Group");
        break;
    }
}
