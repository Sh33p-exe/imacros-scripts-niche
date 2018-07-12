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
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';

function count_rows(file_path) {
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
var login = "CODE:";
login += "SET !ERRORIGNORE YES" + jsLF;
login += "SET !DATASOURCE_DELIMITER :" + jsLF;
login += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
login += "SET !DATASOURCE_COLUMNS 3" + jsLF;
login += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
login += "URL GOTO=https://mobile.twitter.com/login?username_or_email={{!COL1}}" + jsLF;
login += "SET !ENCRYPTION NO" + jsLF;
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF;
login += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV>MAIN>DIV>FORM>DIV:nth-of-type(3)>DIV>DIV\" BUTTON=0" + jsLF;
login += "SET !TIMEOUT_STEP 0" + jsLF;
login += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{!COL3}}" + jsLF;
login += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF;

var tempmail = "CODE:";
tempmail += "SET !ERRORIGNORE YES" + jsLF;
tempmail += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
tempmail += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/ar/mail ATTR=NAME:random" + jsLF;
tempmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;

var confirm = "CODE:";
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

for (var index = 1; index <= count_rows(imdata + "TwitterAccounts.csv"); index++) {
    iimPlayCode("CLEAR");
    iimSet("loop", index);
    iimPlay(login);

    var macro = "CODE:";
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "SET !TIMEOUT_STEP 1" + jsLF;
    macro += "URL GOTO=https://mobile.twitter.com/settings/applications" + jsLF;
    macro += "TAG POS=3 TYPE=DIV ATTR=TXT:no<SP>kompany1" + jsLF;
    macro += "EVENT TYPE=CLICK SELECTOR=\"#react-root>DIV>MAIN>DIV>DIV>DIV>A>DIV\" BUTTON=0" + jsLF;
    macro += "TAG POS=3 TYPE=DIV ATTR=TXT:Revoke<SP>access" + jsLF;
    macro += "WAIT SECONDS=5" + jsLF;
    iimPlay(macro);

}