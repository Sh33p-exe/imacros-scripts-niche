////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only, Also to activate all other variables you must activate easy debug mode first to true OR 1.
const EASY_DEBUG_MODE = true; //To active built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //please note that change useragent may change the whole website interface.
////////////////////////////////////////////////////////////////////////////////////////
//Variable for iMacros built-in memory to remember the next loop session by using new lines between every command for iMacros.
let jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext, count = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
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
var purl = prompt('Please Enter Post URL:'); //Prompt to user to enter url
var murl = purl.match(/\/([0-9]+)/g).toString().replace(/\//g, ''); //Get URL ID
//Check if ID is exist and doesn't equal null
if (murl !== null) {
    iimPlayCode("URL GOTO=" + "https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=" + murl); //Open URL Page

    //Get All People
    while (window.document.getElementsByClassName('h bu').length) {
        //Loop ten times a maximum for everypage
        Loop: for (var i = 1; i <= 10; i++) {
            iimDisplay('Current: ' + i);
            var macro = "CODE:" + onDebug();
            macro += "SET !TIMEOUT_STEP 1" + jsLF; //Wait 1 Second if the element isn't exist
            macro += "TAG POS={{loop}} TYPE=H3 ATTR=CLASS:bl EXTRACT=TXT" + jsLF; //Extract Name
            macro += "TAG POS={{loop}} TYPE=H3 ATTR=CLASS:bl EXTRACT=HTM" + jsLF; //Extract Source code for the current person
            iimSet("loop", i);
            retcode = iimPlay(macro);
            if (retcode < 0) {
                break Loop;
            } else {
                var gname = iimGetLastExtract(1); //match name
                var xhtm = iimGetLastExtract(2); //get source
            }
            iimDisplay("Profile: " + i); //Display Current Profile
            if (gname !== "#EANF#") {
                //Match facebook id
                var gurl = "https://facebook.com" + xhtm.match(/href="(.*?)"/g).toString().replace(/href=|\"/gi, '');
                //Save all people
                iimSet("name", gname);
                iimSet("link", gurl);
                iimPlayCode("SET !DATASOURCE_DELIMITER ;\nSET !ERRORIGNORE YES\nSET !EXTRACT {{name}}\nADD !EXTRACT {{link}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=fbpostppl.csv");
            } else {
                break Loop;
            }
        }
        //Load More People
        iimPlayCode("TAG POS=1 TYPE=SPAN ATTR=TXT:Load<SP>More");
    }
} else {
    //Error Alert
    alert("Please enter a valid url.");
}