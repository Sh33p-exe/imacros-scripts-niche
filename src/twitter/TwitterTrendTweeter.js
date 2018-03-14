////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
///////////////////////////////////////////////////////
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
var myimg = imfolder + "Downloads";

// var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\/Macros/g, '/Datasources');
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');

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

var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
for (var index = 1; index < lineCount(datapath + "TwitterAccounts.csv"); index++) {
    var macro = "CODE:";
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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function whitePage() {
    iimPlayCode("TAB CLOSEALLOTHERS\nURL GOTO=https://m.twitter.com");
}

// function Help(message) {
//     return window.document.querySelectorAll("body")[0].innerHTML += '<div class="iRightSideBar" style="font-family:Segoe UI,Tahoma,Arial,sans-serif;border-radius: 1em;text-align:right;font-size:16px;;direction: rtl; position: fixed; top: 0px; right: 0; margin: 1ex; padding: 1em; background: orange; width: 15%; hieght: 100px; z-index: 6666; opacity: 0.9;"> <p style="font-size:14px;"></p> <ul style="margin:0ex;">' + message + '</ul></div>';
// }

function goBack(message) {
    whitePage();
    window.document.querySelectorAll("body")[0].innerHTML = '<div style="' + _cssdash + '"><center><h2 style="direction:rtl;font-size: 98%;">' + message + '</h2><button class="run" style="' + _cssbutton + '">Go!</button></center></div>';
}