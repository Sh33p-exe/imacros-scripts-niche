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
      return "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES\n";
    } else
      return '';
  }
//A variable being used as memory to remember the next loop session by using new lines between every command.
var jsLF = "\n";
//Loop, error handling variables, language, number of accounts
let i, retcode, errtext, naccounts, lang;
// let arraccounts = [];
let nlang = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type. (just commented because of dashboard)
// const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
// .getService(Components.interfaces.nsIWindowMediator);
// var window = windowMediator.getMostRecentWindow("navigator:browser");
const iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
let filename = iMacros._currentMacro.name;
let datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');
//////////////////////////////////////////////////////////
let _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
let _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
let _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';
let file_login = "TwitterAccounts.csv"; //datasource file
let total_accounts = getFileLines(datapath + file_login);
////////////////////////////////////////////////////////
//Open dashboard
////////////////////////////////////////////////////////
whitePage(); //Go Twitter
dashboard(); //Open Dashboard
////////////////////////////////////////////////////////
window.document.querySelectorAll('.run')[0].addEventListener("click", function () {
    lang = window.document.querySelectorAll("select")[0].value; //User input for language
    naccounts = window.document.querySelectorAll(".naccounts")[0].value; //Get User Input for Number of accounts
    playBot();
});

///////////////////////////////////////////////////
//Get Accounts Information
let accounts = "CODE:" + onDebug();
accounts += "SET !ERRORIGNORE YES" + jsLF;
accounts += "SET !DATASOURCE_DELIMITER :" + jsLF;
accounts += "SET !DATASOURCE {{file}}" + jsLF;
accounts += "SET !DATASOURCE_COLUMNS 3" + jsLF;
accounts += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
accounts += "SET !EXTRACT {{!COL1}}" + jsLF;
accounts += "ADD !EXTRACT {{!COL2}}" + jsLF;
accounts += "ADD !EXTRACT {{!COL3}}" + jsLF;

//Go to login
let login = "CODE:" + onDebug();
login += "CLEAR" + jsLF;
login += "SET !ERRORIGNORE YES" + jsLF;
login += "SET !TIMEOUT_STEP 1" + jsLF;
login += "URL GOTO=https://mobile.twitter.com/login/?username_or_email={{username}}" + jsLF;
login += "SET !ENCRYPTION NO" + jsLF;//Stop encryption for password
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=ID:session[password] CONTENT={{password}}" + jsLF;
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{password}}" + jsLF;
login += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
//More Than One Method to Login
login += "TAG POS=1 TYPE=BUTTON FORM=ACTION:/sessions ATTR=ID:signupbutton" + jsLF;
login += "TAG POS=1 TYPE=BUTTON FORM=ACTION:/sessions ATTR=TXT:Log<SP>in" + jsLF;
login += "TAG POS=3 TYPE=DIV ATTR=TXT:Log<SP>in" + jsLF;

//If account is suspended or any other error for email challenge
let active = "CODE:" + onDebug();
active += "SET !ERRORIGNORE YES" + jsLF;
active += "SET !TIMEOUT_STEP 1" + jsLF;
active += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{email}}" + jsLF;
active += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF;
active += "WAIT SECONDS=1" + jsLF;
///////////////////////////////////////////////////
//Let's Start!
function playBot() {
    try {
        //Loading page..
        window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:none">Loading...</h2></center>';
        //Loop until the end of accounts
        for (let i = 1; i <= naccounts; i++) {

            //current loop
            iimSet("loop", i);
            //set accounts file name variable
            iimSet("file", file_login);
            iimPlay(accounts);
            //Get Username/Password/Email
            let user = iimGetLastExtract(1);
            let pass = iimGetLastExtract(2);
            let email = iimGetLastExtract(3);
            //For Errors
            if (retcode < 0) {
                break;
            }

            //Input User Login Details
            iimSet("username", user);
            iimSet("password", pass);
            iimSet("email", email);
            retcode = iimPlay(login);
            if (retcode < 0) {
                break;
            }
            iimSet("email", email);
            iimPlay(active);
            iimPlayCode("URL GOTO=https://twitter.com/settings/account");
            //Enable Save Settings
            window.document.getElementById("settings_save").disabled = null;
            Help("<li>Profiles...</li><br><li>Account: " + i + "</li>");
            //Edit Account Settings
            HitLanguage(lang);
            let xmacro = "CODE:" + onDebug();
            xmacro += "SET !ERRORIGNORE YES" + jsLF;
            xmacro += "SET !TIMEOUT_STEP 3" + jsLF;
            //Save Save!!
            xmacro += "WAIT SECONDS=1" + jsLF;
            xmacro += "TAG POS=1 TYPE=BUTTON FORM=ID:account-form ATTR=ID:settings_save" + jsLF;
            xmacro += "WAIT SECONDS=1" + jsLF;
            xmacro += "TAG POS=1 TYPE=BUTTON FORM=ID:account-form ATTR=ID:settings_save" + jsLF;
            xmacro += "SET !ENCRYPTION NO" + jsLF;
            xmacro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:account-form ATTR=ID:auth_password CONTENT={{password}}" + jsLF;
            xmacro += "TAG POS=1 TYPE=BUTTON FORM=ID:account-form ATTR=ID:save_password" + jsLF;
            xmacro += "WAIT SECONDS=3" + jsLF;
            iimDisplay("Account: " + i);
            iimSet("password", pass);
            retcode = iimPlay(xmacro);
            if (retcode < 0) {
                break;
            }
        }
    } catch (err) {
        //If any error
        goBack("Error!<br>" + err + "<br>Please open a new issue @github repo for more help");
    }
}

function HitLanguage(lang) {
    window.document.getElementById('user_lang').value = lang;
}

function dashboard() {
    //Dashboard Basic Template
    window.document.body.innerHTML = '<div class=".dash" style="direction:none;' + _cssdash + '"><h2 style="direction:none;color:orange">Change Twitter Accounts Language</h2><br>' +
        '<br>Language:<br>' +
        '<select>' + `<option>Select Language...</option>
        <option value="id">Bahasa Indonesia - Indonesian</option>
        <option value="msa">Bahasa Melayu - Malay</option>
        <option value="ca">Català - Catalan</option>
        <option value="cs">Čeština - Czech</option>
        <option value="da">Dansk - Danish</option>
        <option value="de">Deutsch - German</option>
        <option value="en">English</option>
        <option value="en-gb" selected="">English UK - British English</option>
        <option value="es">Español - Spanish</option>
        <option value="eu">Euskara - Basque (beta)</option>
        <option value="fil">Filipino</option>
        <option value="fr">Français - French</option>
        <option value="ga">Gaeilge - Irish (beta)</option>
        <option value="gl">Galego - Galician (beta)</option>
        <option value="hr">Hrvatski - Croatian</option>
        <option value="it">Italiano - Italian</option>
        <option value="xx-lc">LOLCATZ - Lolcat (beta)</option>
        <option value="hu">Magyar - Hungarian</option>
        <option value="nl">Nederlands - Dutch</option>
        <option value="no">Norsk - Norwegian</option>
        <option value="pl">Polski - Polish</option>
        <option value="pt">Português - Portuguese</option>
        <option value="ro">Română - Romanian</option>
        <option value="sk">Slovenčina - Slovak</option>
        <option value="fi">Suomi - Finnish</option>
        <option value="sv">Svenska - Swedish</option>
        <option value="vi">Tiếng Việt - Vietnamese</option>
        <option value="tr">Türkçe - Turkish</option>
        <option value="el">Ελληνικά - Greek</option>
        <option value="bg">Български език - Bulgarian</option>
        <option value="ru">Русский - Russian</option>
        <option value="sr">Српски - Serbian</option>
        <option value="uk">Українська мова - Ukrainian</option>
        <option value="he">עִבְרִית - Hebrew</option>
        <option value="ur">اردو - Urdu (beta)</option>
        <option value="ar">العربية - Arabic</option>
        <option value="fa">فارسی - Persian</option>
        <option value="mr">मराठी - Marathi</option>
        <option value="hi">हिन्दी - Hindi</option>
        <option value="bn">বাংলা - Bangla</option>
        <option value="gu">ગુજરાતી - Gujarati</option>
        <option value="ta">தமிழ் - Tamil</option>
        <option value="kn">ಕನ್ನಡ - Kannada</option>
        <option value="th">ภาษาไทย - Thai</option>
        <option value="ko">한국어 - Korean</option>
        <option value="ja">日本語 - Japanese</option>
        <option value="zh-cn">简体中文 - Simplified Chinese</option>
        <option value="zh-tw">繁體中文 - Traditional Chinese</option></select>` +
        '<br>Number of Accounts:<br><input class="naccounts" type="text" value="" style="width:50px;' + _cssinput + '">' +
        '<center><button class="run" style="' + _cssbutton + '">Run</button></center>' +
        '</div>';

    //Hit Total Accounts!!
    window.document.querySelectorAll(".naccounts")[0].value = total_accounts;

}

function whitePage() {
    iimPlayCode("TAB CLOSEALLOTHERS\nCLEAR\nURL GOTO=https://www.twitter.com"); //For Dashboard
}

function Help(message) {
    return window.document.querySelectorAll("body")[0].innerHTML += '<div class="iRightSideBar" style="font-family:Segoe UI,Tahoma,Arial,sans-serif;border-radius: 1em;text-align:right;font-size:16px;;direction: none; position: fixed; top: 0px; right: 0; margin: 1ex; padding: 1em; background: orange; width: 15%; hieght: 100px; z-index: 6666; opacity: 0.9;"> <p style="font-size:14px;"></p> <ul style="margin:0ex;">' + message + '</ul></div>';
}

function goBack(message) {
    whitePage();
    window.document.querySelectorAll("body")[0].innerHTML = '<div style="' + _cssdash + '"><center><h2 style="direction:none;font-size: 98%;">' + message + '</h2><button class="run" style="' + _cssbutton + '">Go</button></center></div>';
}
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