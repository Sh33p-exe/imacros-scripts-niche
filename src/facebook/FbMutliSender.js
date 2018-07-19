var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;

//For Windows paths only!
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';
var immacros = imfolder + '\\Macros\\';

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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

var imagepath = prompt("Video/Image Path:");
var wait = +prompt("Interval between every message in seconds:");
var xwait = +prompt("Interval Between every account in seconds:");

for (i = 1; i <= getFileLines(imdata + "FbAccounts.txt"); i++) {
    //Login to facebook
    var login = "CODE:";
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

    //Add Comment
    for (j = 1; j < getFileLines(imdata + "FbUsers.txt"); j++) {
        var macro = "CODE:";
        macro += "SET !ERRORIGNORE YES" + jsLF;
        macro += "SET !TIMEOUT_STEP 3" + jsLF;
        macro += "SET !DATASOURCE FbUsers.txt" + jsLF;
        macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
        macro += "URL GOTO=https://www.facebook.com/messages/t/{{!COL1}}" + jsLF;
        macro += "TAG POS=1 TYPE=A ATTR=TXT:Message" + jsLF;
        macro += "SET !DATASOURCE FbComments.txt" + jsLF;
        macro += "SET !DATASOURCE_LINE " + getRandomInt(1, getFileLines(imdata + "FbComments.txt")) + jsLF;
        macro += "TAG POS=1 TYPE=INPUT:FILE FORM=ACTION:https://* ATTR=ID:js_* CONTENT=" + imagepath + jsLF;
        macro += "EVENTS TYPE=KEYPRESS SELECTOR=\"#js_c\" CHARS={{!COL1}}" + jsLF;
        macro += "TAG POS=1 TYPE=A ATTR=ID:js_34x" + jsLF;
        iimSet("loop", j);
        iimPlay(macro);
        iimPlayCode("WAIT SECONDS=" + wait);
        iimDisplay("Recipient Account:" + j + "\n" + "Account:" + i);
    }
    iimPlayCode("WAIT SECONDS=" + xwait);
    iimDisplay("Account:" + i);
}