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
        activate_debugg = "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES";
        return activate_debugg;

    }
}
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
var wait = +prompt("Interval between every single comment in seconds:");

while (true) {
    for (i = 1; i <= getFileLines(imdata + "FbAccounts.txt"); i++) {
        iimDisplay("Account: " + i);
        var login = "CODE:" + onDebug();
        login += "SET !ERRORIGNORE YES" + jsLF;
        login += "CLEAR" + jsLF;
        login += "SET !DATASOURCE_DELIMITER :" + jsLF;
        login += "SET !DATASOURCE FbAccounts.txt" + jsLF;
        login += "SET !DATASOURCE_COLUMNS 2" + jsLF;
        login += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
        login += "URL GOTO=https://m.facebook.com/" + jsLF;
        login += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login_form ATTR=ID:m_login_email CONTENT={{!COL1}}" + jsLF;
        login += "SET !ENCRYPTION NO" + jsLF;
        login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login_form ATTR=NAME:pass CONTENT={{!COL2}}" + jsLF;
        login += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=NAME:login" + jsLF;
        iimSet("loop", i);
        iimPlay(login);

        for (index = 1; index <= getFileLines(imdata + "FbGroups.txt"); index++) {
            var macro = "CODE:" + onDebug();
            macro += "SET !ERRORIGNORE YES" + jsLF;
            macro += "SET !TIMEOUT_STEP 1" + jsLF;
            macro += "SET !DATASOURCE FbGroups.txt" + jsLF;
            macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
            macro += "URL GOTO={{!COL1}}" + jsLF;
            // macro += "TAG POS=1 TYPE=A ATTR=CLASS:ds&&HREF:/groups/*?view=permalink&id=*" + jsLF;
            // macro += "TAG POS=1 TYPE=A ATTR=TXT:*Comment" + jsLF;
            macro += "SET !DATASOURCE FbComments.txt" + jsLF;
            macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/a/comment.php?* ATTR=NAME:comment_text CONTENT={{!COL1}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/a/comment.php?fs=* ATTR=* " + jsLF;
            iimSet("loop", index);
            iimPlay(macro);

            iimPlayCode("WAIT SECONDS=" + wait);
        }
        for (index = 1; index <= getFileLines(imdata + "FbGroups.txt"); index++) {
            var macro = "CODE:" + onDebug();
            macro += "SET !ERRORIGNORE YES" + jsLF;
            macro += "SET !TIMEOUT_STEP 1" + jsLF;
            macro += "SET !DATASOURCE FbGroups.txt" + jsLF;
            macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
            macro += "URL GOTO={{!COL1}}" + jsLF;
            // macro += "TAG POS=1 TYPE=A ATTR=CLASS:ds&&HREF:/groups/*?view=permalink&id=*" + jsLF;
            // macro += "TAG POS=1 TYPE=A ATTR=TXT:*Comment" + jsLF;
            macro += "TAG POS=1 TYPE=A ATTR=HREF:/mbasic/comment/advanced/?target_id=*&at=edit&ctoken=*&__tn__=R" + jsLF;
            macro += "TAG POS=1 TYPE=A ATTR=CLASS:*&&HREF:/ufi/confirm_delete.php?delete_comment_id=*&delete_comment_fbid=*&ft_ent_identifier=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/ufi/delete/*&ft_ent_identifier=*&gfid=* ATTR=VALUE:*&&CLASS:bk<SP>bl&&TYPE:submit" + jsLF;
            iimSet("loop", index);
            iimPlay(macro);
        }
    }


}