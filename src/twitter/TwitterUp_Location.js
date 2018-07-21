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

function Config(config_file, limit) {
    settings = [];
    var conf = "CODE:" + onDebug();
    conf += "SET !DATASOURCE_DELIMITER =" + jsLF;
    conf += "SET !DATASOURCE " + config_file + jsLF;
    conf += "SET !DATASOURCE_COLUMNS 2" + jsLF;
    conf += "SET !DATASOURCE_LINE 1" + jsLF;
    conf += "SET !EXTRACT {{!COL2}}" + jsLF;
    for (i = 2; i <= limit; i++) {
        conf += "SET !DATASOURCE_LINE " + i + jsLF;
        conf += "ADD !EXTRACT {{!COL2}}" + jsLF;
    }
    iimPlay(conf);

    for (i = 1; i <= limit; i++)
        settings.push(iimGetLastExtract(i));

    return settings;
}
///////////////////////////////////////////////////////////////////////////////////////
var login = "CODE:" + onDebug();
login += "SET !ERRORIGNORE YES" + jsLF;
login += "SET !DATASOURCE_DELIMITER :" + jsLF;
login += "SET !DATASOURCE TwitterAccountsUp.csv" + jsLF; //Data source file
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
login += "ADD !EXTRACT {{!COL3}}" + jsLF;
///////////////////////////////////////////////////////////////////////////////////////
var global = Config("TwitterUp_Location.conf", 3);
avatar = global[0];
cover = global[1];
location = global[2];


for (var index = 1; index <= getFileLines(imdata + "TwitterAccountsUp.csv"); index++) {
    iimPlayCode("CLEAR");
    iimSet("loop", index);
    iimPlay(login);
    var user = iimGetLastExtract(1);
    var pass = iimGetLastExtract(2);
    var email = iimGetLastExtract(3);

    iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 2\nTAG POS=5 TYPE=DIV ATTR=TXT:Your<SP>account<SP>is<SP>suspended<SP>and<SP>is<SP>not<SP>pe* EXTRACT=TXT');
    var result = iimGetLastExtract();
    window.console.log(result);

    if (result.indexOf("suspended") === -1) {
        window.console.log("Suspended: NO");

        var up1 = "" + imdata + "twavatar\\" + index + ".jpg";
        var up2 = "" + imdata + "twcover\\" + index + ".jpg";

        iimPlayCode("URL GOTO=https://twitter.com/" + user + "?edit=true");

        var macro = "CODE:" + onDebug();
        macro += "SET !ERRORIGNORE YES" + jsLF;
        macro += "SET !TIMEOUT_STEP 2" + jsLF;
        if (avatar) {
            macro += "TAG POS=1 TYPE=INPUT:FILE ATTR=NAME:media[] CONTENT={{up1}}" + jsLF;
            macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV:nth-of-type(3)>DIV:nth-of-type(2)>DIV>DIV:nth-of-type(8)>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(3)>BUTTON:nth-of-type(4)\" BUTTON=0" + jsLF;
        }
        if (cover) {
            macro += "TAG POS=1 TYPE=INPUT:FILE ATTR=NAME:user[profile_header_image] CONTENT={{up2}}" + jsLF;
            macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV:nth-of-type(3)>DIV:nth-of-type(2)>DIV>DIV:nth-of-type(3)>DIV>DIV>DIV:nth-of-type(3)>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV:nth-of-type(3)>BUTTON:nth-of-type(2)\" BUTTON=0" + jsLF;
        }
        macro += "URL GOTO=https://mobile.twitter.com/settings/profile" + jsLF;
        macro += "TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:location CONTENT={{location}}" + jsLF;
        macro += "TAG POS=1 TYPE=DIV ATTR=TXT:Save" + jsLF;
        iimSet("location", location);
        iimSet("up1", up1);
        iimSet("up2", up2);
        iimPlay(macro);

        saveAs(user, pass, email);
    }
}
///////////////////////////////////////////////////////////////////////////////////////
function saveAs(user, pass, email) {
    iimSet("usr", user);
    iimSet("pass", pass);
    iimSet("email", email);
    iimPlayCode("SET !DATASOURCE_DELIMITER :\nSET !EXTRACT {{usr}}\nADD !EXTRACT {{pass}}\nADD !EXTRACT {{email}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=TwAccountsUploaded.csv");
}

function gotoRM(myurl) {
    var part = "about:reader?url=" + myurl;
    iimPlayCode("URL GOTO=" + part);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomLen(len) {
    len += 2;
    return Math.random().toString().slice(2, len);
}

function isEven(n) {
    return n % 2 === 0;
}

function isOdd(n) {
    return Math.abs(n % 2) === 1;
}

function username(num) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < num; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    return text;
}

function password(num) {
    return Math.random().toString().slice(2, num);
}

function getRandomNum(len) {
    len += 2;
    return Math.random().toString().slice(2, len);
}
