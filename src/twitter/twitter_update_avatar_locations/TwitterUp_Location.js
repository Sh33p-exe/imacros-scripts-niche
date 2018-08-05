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
function Config(config_file, limit) {
    settings = [];
    let conf = "CODE:" + onDebug();
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
let login = "CODE:" + onDebug();
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
let global = Config("TwitterUp_Location.conf", 3);
avatar = global[0];
cover = global[1];
location = global[2];

for (let index = 1; index <= getFileLines(imdata + "TwitterAccountsUp.csv"); index++) {
    iimPlayCode("CLEAR");
    iimSet("loop", index);
    iimPlay(login);
    let user = iimGetLastExtract(1);
    let pass = iimGetLastExtract(2);
    let email = iimGetLastExtract(3);

    iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 2\nTAG POS=5 TYPE=DIV ATTR=TXT:Your<SP>account<SP>is<SP>suspended<SP>and<SP>is<SP>not<SP>pe* EXTRACT=TXT');
    let result = iimGetLastExtract();
    window.console.log(result);

    if (result.indexOf("suspended") === -1) {
        window.console.log("Suspended: NO");
        let up1 = "" + imdata + "twavatar\\" + index + ".jpg";
        let up2 = "" + imdata + "twcover\\" + index + ".jpg";

        iimPlayCode("URL GOTO=https://twitter.com/" + user + "?edit=true");

        let macro = "CODE:" + onDebug();
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
