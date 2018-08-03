var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');

var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
var _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
var _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';
////////////////////////////////////////////////////////////////////////////////////////
var waitman = prompt('Interval:');
var xsource = "stumbaccounts.txt";
var xfeed = "feedbackurls.txt";

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


while (true) {
    var findex = 1;
    if (getFileLines(datapath + xsource) === getFileLines(datapath + xpath)) {
        for (var index = 1; index <= getFileLines(datapath + xsource); index++) {
            var rssmacro = "CODE:";
            rssmacro += "TAB CLOSEALLOTHERS" + jsLF;
            rssmacro += "TAB T=1" + jsLF;
            rssmacro += "SET !DATASOURCE {{myfeed}}" + jsLF;
            rssmacro += "SET !DATASOURCE_COLUMNS 1" + jsLF;
            rssmacro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
            rssmacro += "URL GOTO={{!COL1}}" + jsLF;
            rssmacro += "TAG POS={{loop}} TYPE=H3 ATTR=* EXTRACT=HTM" + jsLF;
            iimSet("myfeed", xfeed);
            iimSet("loop", findex);
            iimPlay(rssmacro);
            var result = iimGetLastExtract().match(/(href\s*=\s*(?:"|')(.*?)(?:"|'))/ig).toString().replace(/href=|\"/g, '');
            findex++;
            if (result !== null) {
                iimDisplay("Current Account:" + index);
                var macro = "CODE:";
                macro += "SET !ERRORIGNORE YES" + jsLF;
                macro += "" + jsLF;
                macro += "TAB OPEN" + jsLF;
                macro += "TAB T=2" + jsLF;
                macro += "CLEAR" + jsLF;
                macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
                macro += "SET !DATASOURCE {{accounts}}" + jsLF;
                macro += "SET !DATASOURCE_COLUMNS 2" + jsLF;
                macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
                macro += "SET !USERAGENT \"\"" + jsLF;
                macro += "URL GOTO=http://www.stumbleupon.com/" + jsLF;
                macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:NoFormName ATTR=ID:email-username CONTENT={{!COL1}}" + jsLF;
                macro += "SET !ENCRYPTION NO" + jsLF;
                macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=NAME:NoFormName ATTR=ID:password-login CONTENT={{!COL2}}" + jsLF;
                macro += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
                macro += "TAG POS=1 TYPE=BUTTON FORM=NAME:NoFormName ATTR=TXT:Login" + jsLF;
                macro += "SET !REPLAYSPEED MEDIUM" + jsLF;
                macro += "WAIT SECONDS=7" + jsLF;
                macro += "SET !USERAGENT \"Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1)\"" + jsLF;
                macro += "URL GOTO=http://www.stumbleupon.com/submit" + jsLF;
                macro += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF;
                macro += "WAIT SECONDS=3" + jsLF;
                macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV>DIV>FORM>DIV>DIV>INPUT\" BUTTON=0" + jsLF;
                macro += "EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY>DIV>DIV>DIV>FORM>DIV>DIV>INPUT\" CHARS={{link}}" + jsLF;
                macro += "TAG POS=1 TYPE=LABEL FORM=NAME:NoFormName ATTR=TXT:Yes" + jsLF;
                macro += "TAG POS=1 TYPE=INPUT:RADIO FORM=NAME:NoFormName ATTR=NAME:nsfw" + jsLF;
                macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV>DIV>FORM>DIV:nth-of-type(3)>DIV>DIV>A>SPAN\" BUTTON=0" + jsLF;
                macro += "EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY>DIV>DIV>DIV>FORM>DIV:nth-of-type(3)>DIV>DIV>DIV>DIV>INPUT\" CHARS=news" + jsLF;
                macro += "EVENT TYPE = CLICK SELECTOR = \"HTML>BODY>DIV>DIV>DIV>FORM>DIV:nth-of-type(3)>DIV>DIV>DIV>UL>LI:nth-of-type(16)\" BUTTON=0" + jsLF;
                macro += "TAG POS=1 TYPE=BUTTON FORM=NAME:NoFormName ATTR=TXT:Add<SP>This<SP>Page" + jsLF;
                macro += "WAIT SECONDS=5" + jsLF;
                macro += "TAB CLOSE" + jsLF;
                iimSet("link", result);
                iimSet("accounts", xsource);
                iimSet("loop", index);
                iimPlay(macro);
                iimPlayCode("WAIT SECONDS=" + waitman);
            } else {
                index -= 1;
            }
        }
    } else {
        alert('RSS FEED DOESN\'T EQUAL LINES OF ACCOUNTS FILE!');
    }
}
///////////////////////////////////////////////////////////////////////////////////////
function whitePage() {
    iimPlayCode("TAB CLOSEALLOTHERS\nURL GOTO=https://www.example.com");
}

function goBack(message) {
    whitePage();
    window.document.querySelectorAll("body")[0].innerHTML = '<div style="' + _cssdash + '"><center><h2 style="direction:rtl;font-size: 98%;">' + message + '</h2><button class="run" style="' + _cssbutton + '">إستمرار</button></center></div>';
}