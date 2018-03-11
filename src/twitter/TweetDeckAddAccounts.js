var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
const window = windowMediator.getMostRecentWindow("navigator:browser");

const iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');
var csvfile = "TwitterAccounts.csv";
var allaccounts = lineCount(datapath + csvfile);

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

var mainaccount = prompt("Main Account Username:");
for (var index = 1; index <= allaccounts; index++) {
    var macro = "CODE:";
    macro += "SET !USERAGENT \"mobile\"" + jsLF;
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "CLEAR" + jsLF;
    macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
    macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "SET !DATASOURCE_COLUMNS 3" + jsLF;
    macro += "URL GOTO=https://twitter.com/login?hide_message=true&redirect_after_login=https%3A%2F%2Ftweetdeck.twitter.com%2F%3Fvia_twitter_login%3Dtrue" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/sessions ATTR=NAME:session[username_or_email] CONTENT={{!COL1}}" + jsLF;
    macro += "SET !ENCRYPTION NO" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF;
    macro += "SET !USERAGENT \"\"" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/sessions ATTR=NAME:commit" + jsLF;
    macro += "SET !TIMEOUT_STEP 1" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{!COL3}}" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF;
    macro += "SET !TIMEOUT_STEP 3" + jsLF;
    macro += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/login?*&*&&CLASS:btn<SP>btn-positive<SP>block<SP>txt-size--18" + jsLF;
    macro += "TAB T=1" + jsLF;
    macro += "TAG POS=1 TYPE=I ATTR=CLASS:icon<SP>icon-user-switch<SP>icon-medium<SP>position-rel" + jsLF;
    macro += "TAG POS=1 TYPE=P ATTR=CLASS:nbfc<SP>link-complex-target<SP>txt-base-largest<SP>padding-txs" + jsLF;
    macro += "EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY>DIV:nth-of-type(3)>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(3)>DIV>DIV>INPUT\" CHARS={{mainaccount}}" + jsLF;
    macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV:nth-of-type(3)>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(3)>DIV>DIV>UL>LI>DIV\" BUTTON=0" + jsLF;
    macro += "TAG POS=1 TYPE=BUTTON ATTR=CLASS:js-contributor-action-confirm<SP>btn<SP>btn-positive<SP>pull-left&&DATA-USER-ID:*" + jsLF;
    macro += "WAIT SECONDS=3" + jsLF;
    iimSet("loop", index);
    iimSet("mainaccount", mainaccount);
    iimPlay(macro);
}