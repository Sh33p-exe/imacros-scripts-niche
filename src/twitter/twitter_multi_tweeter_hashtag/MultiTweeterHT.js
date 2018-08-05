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
let filename = iMacros._currentMacro.name;
let imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
let imdata = imfolder + '\\Datasources\\';
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
////////////////////////////////////////////////////////////////////////////////////////
let login = "CODE:" + onDebug();
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

let tweet = "CODE:" + onDebug();
tweet += "SET !ERRORIGNORE YES" + jsLF;
tweet += "SET !DATASOURCE Tweets.txt" + jsLF;
tweet += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
tweet += "URL GOTO=https://mobile.twitter.com/compose/tweet" + jsLF;
tweet += "TAG POS=1 TYPE=TEXTAREA ATTR=AUTOCAPITALIZE:sentences&&AUTOCOMPLETE:on&&AUTOCORRECT:on&&PLACEHOLDER:*&&DATA-TESTID:tweet-textarea&&DIR:auto&&TXT: CONTENT={{!COL1}}<BR>{{hashtag}}" + jsLF;
tweet += "URL GOTO=javascript:document.querySelectorAll('div[role=\"button\"]')[1].click();" + jsLF;
tweet += "WAIT SECONDS=1" + jsLF;
////////////////////////////////////////////////////////////////////////////////////////
let hashtag = prompt("Enter your hashtag:", "#tag");

while (true) {
    for (let index = 1; index <= getFileLines(imdata + "TwitterAccounts.csv"); index++) {
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
//Functions
/**
 * 
 * @param {string} user username
 * @param {string} pass password
 * @param {string} email email address
 * @param {string} status account information status
 */
function saveAs(user, pass, email, status) {
    iimSet("usr", user);
    iimSet("pass", pass);
    iimSet("email", email);
    iimSet("stat", status);
    iimPlayCode("SET !DATASOURCE_DELIMITER :\nSET !EXTRACT {{usr}}\nADD !EXTRACT {{pass}}\nADD !EXTRACT {{email}}\nADD !EXTRACT {{stat}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=TwitterAccounts.csv");
}

