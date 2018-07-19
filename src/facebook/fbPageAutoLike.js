////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface
////////////////////////////////////////////////////////////////////////////////////////
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');


var jsLF = "\n";
var i, retcode, errtext, macro;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var txtfile = "fbaccounts.csv";
var acco = lineCount(datapath + txtfile);
var _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
var _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
var _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';

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
        allow_debug = "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES\n";
        return allow_debug;
    }
}

function lineCount(file_path) {
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

var pageurl = prompt("Enter Page URL (m.facebook.com/username):");
try {
    window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading..</h2></center>';
} catch (err) {
    alert("Error! <br>" + err + "<br> Please contact with script developer.");
}
for (var i = 1; i <= acco; i++) {
    var macro = "CODE:" + onDebug();
    macro += "CLEAR" + jsLF;
    macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
    macro += "SET !DATASOURCE " + txtfile + jsLF;
    macro += "SET !DATASOURCE_COLUMNS 2" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "URL GOTO=https://m.facebook.com/" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login_form ATTR=ID:m_login_email CONTENT={{!COL1}}" + jsLF;
    macro += "SET !ENCRYPTION NO" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login_form ATTR=NAME:pass CONTENT={{!COL2}}" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=NAME:login" + jsLF;
    iimSet("loop", i);
    iimPlay(macro);

    iimPlayCode("URL GOTO=" + pageurl);

    for (var index = 1; index < 4; index++) {
        iimSet("loop", index);
        iimPlayCode("TAG POS={{loop}} TYPE=A ATTR=TXT:Like");
    }
}