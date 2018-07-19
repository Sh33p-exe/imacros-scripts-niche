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
var login = "CODE:";
login += "SET !ERRORIGNORE YES" + jsLF;
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

var tweet = "CODE:";
tweet += "SET !ERRORIGNORE YES" + jsLF;
tweet += "SET !DATASOURCE Tweets.txt" + jsLF;
tweet += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
tweet += "URL GOTO=https://mobile.twitter.com/compose/tweet" + jsLF;
tweet += "TAG POS=1 TYPE=TEXTAREA ATTR=AUTOCAPITALIZE:sentences&&AUTOCOMPLETE:on&&AUTOCORRECT:on&&PLACEHOLDER:*&&DATA-TESTID:tweet-textarea&&DIR:auto&&TXT: CONTENT={{!COL1}}<BR>{{hashtag}}" + jsLF;
tweet += "URL GOTO=javascript:document.querySelectorAll('div[role=\"button\"]')[1].click();" + jsLF;
tweet += "WAIT SECONDS=1" + jsLF;
////////////////////////////////////////////////////////////////////////////////////////

var hashtag = prompt("Enter your hashtag:", "#tag");

while (true) {
    for (var index = 1; index <= getFileLines(imdata + "TwitterAccounts.csv"); index++) {
        count++;
        iimDisplay("Tweets: " + count);
        iimPlayCode("CLEAR\nTAB CLOSEALLOTHERS");
        iimSet("loop", index);
        iimPlay(login);
        if (window.location.href !== "https://twitter.com/account/access" && window.location.href.indexOf("twitter.com/login") === -1) {
            iimSet("loop", getRandomInt(1, getFileLines(imdata + "Tweets.txt")));
            iimSet("hashtag", hashtag);
            iimPlay(tweet);
        }
    }
}
///////////////////////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

