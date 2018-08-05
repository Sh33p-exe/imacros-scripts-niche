////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //please note that change useragent may change the whole website interface
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
//Variable for iMacros built-in memory to remember the next loop session by using new lines between every command for iMacros.
var jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext, count = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
//For Windows paths only!
let filename = iMacros._currentMacro.name;
let imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
let imdata = imfolder + '\\Datasources\\';
let immacros = imfolder + '\\Macros\\';
/**
 * 
 * @param {String} input datasource file path
 * @returns total file lines
 */
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
//This is CSS Style Sheet for dashboard
let _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
let _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
let _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';
////////////////////////////////////////////////////////////////////////////////////////
//Open dashboard
///////////////////////////////////////////////////////////////////////////////////////
whitePage();
dashboard();
Help("Please Fill Forms");

let login = "CODE:" + onDebug();
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
window.document.querySelectorAll('.run')[0].addEventListener("click", function () {
    let retweet = window.document.querySelector("#retweet").checked;
    let like = window.document.querySelector("#like").checked;
    let randomize = window.document.querySelector("#randomize").checked;
    let ask = prompt("Random Follow Between:", "1:3").split(':');
    randomize = getRandomInt(ask[0], ask[1]);
    try {
        window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading...</h2></center>';
    } catch (err) {
        goBack("Err<br>" + err + "<br>Please open a new issue to make further updates.");
    }
    for (let i = 1; i < getFileLines(imdata + "TwitterAccounts.csv"); i++) {
        iimPlayCode("CLEAR");
        iimSet("loop", i);
        retcode = iimPlay(login);
        if (retcode < 0)
            break;
        for (j = 1; j < parseInt(randomize); j++) {
            let macro = "CODE:" + onDebug();
            macro += "SET !ERRORIGNORE YES" + jsLF;
            macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
            macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
            macro += "SET !DATASOURCE_LINE " + getRandomInt(1, getFileLines(imdata + "TwitterAccounts.csv")) + jsLF;
            macro += "URL GOTO=m.twitter.com/{{!COL1}}" + jsLF;
            macro += "SET !TIMEOUT_STEP 3" + jsLF;
            macro += "TAG POS=4 TYPE=DIV ATTR=TXT:Follow" + jsLF;
            if (retweet) {
                for (index = 0; index < 5; index++) {
                    macro += "URL GOTO=javascript:window.document.querySelectorAll('div[data-testid=\"retweet\"]')['" + index + "'].click();" + jsLF;
                    macro += "WAIT SECONDS=0.2" + jsLF;
                    macro += "URL GOTO=javascript:window.document.querySelectorAll('div[data-testid=\"retweetConfirm\"]')[0].click();" + jsLF;
                    macro += "WAIT SECONDS=0.5" + jsLF;
                }
            }
            if (like) {
                for (index = 0; index < 5; index++) {
                    macro += "URL GOTO=javascript:window.document.querySelectorAll('div[data-testid=\"like\"]')['" + index + "'].click();" + jsLF;
                    macro += "WAIT SECONDS=0.2" + jsLF;
                }
            }
            macro += "SET !EXTRACT {{!COL1}}" + jsLF;
            iimSet("loop", j);
            retcode = iimPlay(macro);
            if (retcode < 0)
                break;
        }
        iimDisplay("Current:" + i);
    }
});
//////////////////////////////////////DASHBOARD/////////////////////////////////////////
function dashboard() {
    window.document.querySelectorAll("body")[0].innerHTML = '<div class=".dash" style="direction:rtl;' + _cssdash + '">' +
        '<h2 style="direction:rtl;color:orange">Twitter Active Accounts</h2><br>' +
        '<input id="randomize" type="checkbox"><span>Auto Follow Between Random Numbers</span><br>' +
        '<input id="retweet" type="checkbox"><span>Auto Retweetet Recent 5 Tweets</span><br>' +
        '<input id="like" type="checkbox"><span>Auto Like Recent 5 Tweets</span><br>' +
        '<hr style="width:80%;border: 0;border-top: 1px solid #eee;height: 0;margin: 14px 0 0;padding: 0;">' +
        '<center><button class="run" style="' + _cssbutton + '">GO!</button></center>' +
        '<br>' +
        '</div>';
}
///////////////////////////////////////////////////////////////////////////////////////
/**
 * 
 * @param {string} min minimum random number
 * @param {string} max maximum random number
 * @returns random number
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}
function whitePage() {
    iimPlayCode("TAB CLOSEALLOTHERS\nURL GOTO=https://www.twitter.com");
}
function Help(message) {
    return window.document.querySelectorAll("body")[0].innerHTML += '<div class="iRightSideBar" style="font-family:Segoe UI,Tahoma,Arial,sans-serif;border-radius: 1em;text-align:right;font-size:16px;;direction: rtl; position: fixed; top: 0px; right: 0; margin: 1ex; padding: 1em; background: orange; width: 15%; hieght: 100px; z-index: 6666; opacity: 0.9;"> <p style="font-size:14px;"></p> <ul style="margin:0ex;">' + message + '</ul></div>';
}
function goBack(message) {
    whitePage();
    window.document.querySelectorAll("body")[0].innerHTML = '<div style="' + _cssdash + '"><center><h2 style="direction:rtl;font-size: 98%;">' + message + '</h2><button class="run" style="' + _cssbutton + '">إستمرار</button></center></div>';
}