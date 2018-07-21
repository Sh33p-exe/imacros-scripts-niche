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
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
const iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';

function getFileLines(file_path) {
    const CRLF = "\r\n";
    const LF = "\n";
    var lines = [];
    var file_i = imns.FIO.openNode(file_path);
    var text = imns.FIO.readTextFile(file_i);
    var eol = (text.indexOf(CRLF) == -1) ? LF : CRLF;
    lines = text.split(eol);
    eol = lines.length;
    return eol;
}

////////////////////////////////////////////////////////////////////////////////////////
var login = "CODE:" + onDebug();
login += "SET !ERRORIGNORE YES" + jsLF;
login += "SET !TIMEOUT_STEP 1" + jsLF;
login += "SET !DATASOURCE_DELIMITER :" + jsLF;
login += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
login += "SET !DATASOURCE_COLUMNS 3" + jsLF;
login += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
login += "URL GOTO=https://m.twitter.com/login?username_or_email={{!COL1}}" + jsLF;
login += "SET !ENCRYPTION NO" + jsLF;
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:https://mobile.twitter.com/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF;
login += "URL GOTO=javascript:document.querySelectorAll('div[role=\"button\"]')[0].click();" + jsLF;
login += "SET !TIMEOUT_STEP 0" + jsLF;
login += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{!COL3}}" + jsLF;
login += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF;
login += "SET !EXTRACT {{!COL1}}" + jsLF;
login += "ADD !EXTRACT {{!COL2}}" + jsLF;

var tempmail = "CODE:" + onDebug();
tempmail += "SET !ERRORIGNORE YES" + jsLF;
tempmail += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
tempmail += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/ar/mail ATTR=NAME:random" + jsLF;
tempmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;

var confirm = "CODE:" + onDebug();
confirm += "SET !ERRORIGNORE YES" + jsLF;
confirm += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
confirm += "WAIT SECONDS=5" + jsLF;
confirm += "REFRESH" + jsLF;
confirm += "SET !ERRORIGNORE NO" + jsLF;
confirm += "TAG POS=4 TYPE=TD ATTR=*" + jsLF;
confirm += "TAG POS=1 TYPE=A ATTR=HREF:/ar/msg/*" + jsLF;
confirm += "FRAME F=1" + jsLF;
confirm += "SET !ERRORIGNORE YES" + jsLF;
confirm += "SET !TIMEOUT_PAGE 4" + jsLF;
confirm += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/i/redirect?url=*" + jsLF;
confirm += "TAB CLOSEALLOTHERS" + jsLF;

var repmail = "CODE:" + onDebug();
repmail += "SET !ERRORIGNORE YES" + jsLF;
repmail += "TAG POS=1 TYPE=A ATTR=TXT:mode_edit<SP>*" + jsLF;
repmail += "WAIT SECONDS=5" + jsLF;
repmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;

for (var index = 1; index <= getFileLines(imdata + "TwitterAccounts.csv"); index++) {
    iimPlayCode("TAB CLOSEALLOTHERS\nCLEAR");
    iimDisplay("Current: " + index);
    iimPlay(tempmail);

    var email = iimGetLastExtract();

    if (email.indexOf("bareed.ws") >= 0 || email.indexOf("disbox.net") >= 0) {
        iimPlay(repmail);
        email = iimGetLastExtract();
    }

    if (email.indexOf("bareed.ws") === -1 && email.indexOf("disbox.net") === -1) {
        iimSet("loop", index);
        iimPlay(login);
        var user = iimGetLastExtract(1);
        var pass = iimGetLastExtract(2);
        if (window.location.href !== "https://twitter.com/account/access") {
            iimPlayCode("SET !ERRORIGNORE YES\nURL GOTO=https://mobile.twitter.com/settings/email\nTAG POS=1 TYPE=DIV ATTR=TXT:Email");

            if (window.document.querySelectorAll('input[name="email"]').length) {
                iimSet("email", email);
                iimPlayCode("TAG POS=1 TYPE=INPUT:EMAIL ATTR=NAME:email CONTENT={{email}}");
                window.document.querySelectorAll('input[name="email"]').value = email;
                iimPlayCode("TAG POS=2 TYPE=DIV ATTR=TXT:Save\nWAIT SECONDS=2");
                //Confirm your account
                retcode = iimPlay(confirm);
                if (retcode >= 0)
                    saveAs(user, pass, email);
            }
        }
    } else
        index--;
}

///////////////////////////////////////////////////////////////////////////////////////
function saveAs(user, pass, email) {
    iimSet("usr", user);
    iimSet("pass", pass);
    iimSet("email", email);
    iimPlayCode("SET !DATASOURCE_DELIMITER :\nSET !EXTRACT {{usr}}\nADD !EXTRACT {{pass}}\nADD !EXTRACT {{email}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=TwAccountsConfirmed.csv");
}