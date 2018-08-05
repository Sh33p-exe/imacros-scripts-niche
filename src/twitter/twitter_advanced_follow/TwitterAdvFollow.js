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
////////////////////////////////////////////////////////////////////////////////////////
const EASY_DEBUG_MODE = false; //To active Debug mode for developers in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const account_interval_seconds = [10, 20]; //Interval between every account
const follow_interval_seconds = [1, 2]; //Interval between every follow
const round_interval_seconds = [5, 50]; //Interval between every round
////////////////////////////////////////////////////////////////////////////////////////
//A variable being used as memory to remember the next loop session by using new lines between every command for iMacros.
const jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext, count = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
  .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
//A method to access iMacros interface
let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIWebNavigation)
  .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
  .QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIDOMWindow).iMacros;
let filename = iMacros._currentMacro.name; //Get Script Name
let folder_mydata = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\'); //Get Datasources Folder Path
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

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
// Returns a random number between min (inclusive) and max (exclusive)
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}
// Returns a random number between 0 (inclusive) and 1 (exclusive)
function getRandom() {
  return Math.random();
}
let file_login = folder_mydata + "TwitterAccounts.csv"; //Datasource for twitter account
let file_profiles = folder_mydata + "TwitterUsernames.txt"; //Datasource for twitter usernames for followers
// alert(file_login + "\n" + file_profiles);
let sum_login = getFileLines(file_login); //Total accounts
let sum_profiles = getFileLines(file_profiles); //Total profiles for followers

let accounts = "CODE:" + onDebug();
accounts += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
accounts += "SET !DATASOURCE_DELIMITER :" + jsLF; //Split Datasource file by comma
accounts += "SET !DATASOURCE " + file_login + jsLF; //Get data source file
accounts += "SET !DATASOURCE_COLUMNS 3" + jsLF; //Datasource File Columns
accounts += "SET !DATASOURCE_LINE {{loop}}" + jsLF; //Current loop session
accounts += "SET !EXTRACT {{!COL1}}" + jsLF; //Username
accounts += "ADD !EXTRACT {{!COL2}}" + jsLF; //Password
accounts += "ADD !EXTRACT {{!COL3}}" + jsLF; //Email

let profiles = "CODE:" + onDebug();
profiles += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
profiles += "SET !DATASOURCE " + file_profiles + jsLF; //Datasource path
profiles += "SET !DATASOURCE_LINE {{loop}}" + jsLF; //Current loop session
profiles += "SET !EXTRACT {{!COL1}}" + jsLF; //Current Extract


let login = "CODE:" + onDebug();
login += "CLEAR" + jsLF; //Clear all cookies
login += "SET !ERRORIGNORE YES" + jsLF; //Ignore Errors
login += "SET !TIMEOUT_STEP 3" + jsLF; //Step timeout in seconds
login += "URL GOTO=https://mobile.twitter.com/login/?username_or_email={{username}}" + jsLF; //go to twitter login page
login += "SET !ENCRYPTION NO" + jsLF; //Don't use encryption with password input
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=ID:session[password] CONTENT={{password}}" + jsLF; //Input password for  attribute id
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{password}}" + jsLF; //Input password for attribute name
login += "FILTER TYPE=IMAGES STATUS=ON" + jsLF; //Remove Images
login += "SET !TIMEOUT_STEP 1" + jsLF; //Step timeout in seconds
//More Than One Method to Login
login += "TAG POS=1 TYPE=BUTTON FORM=ACTION:/sessions ATTR=ID:signupbutton" + jsLF; //Hit login button
login += "TAG POS=1 TYPE=BUTTON FORM=ACTION:/sessions ATTR=TXT:Log<SP>in" + jsLF; //Hit login button 2
login += "TAG POS=3 TYPE=DIV ATTR=TXT:Log<SP>in" + jsLF; //Hit login button 3
login += "SET !EXTRACT {{!URLCURRENT}}" + jsLF; //Extract current page url

let active = "CODE:" + onDebug();
active += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
active += "SET !TIMEOUT_STEP 1" + jsLF; //Step timeout for every command
active += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{email}}" + jsLF; //Input email address in the field
active += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF; //Submit email address
active += "SET !EXTRACT {{!URLCURRENT}}" + jsLF; //Current Url
active += "WAIT SECONDS=1" + jsLF; //One moment later!

let gofollow = "CODE:" + onDebug();
gofollow += "FILTER TYPE=IMAGES STATUS=ON" + jsLF; //Remove images from the page
gofollow += "URL GOTO=https://twitter.com/{{username}}/followers" + jsLF; //Load user followers

let zoom;
zoom = "CODE:" + onDebug();
zoom += "SET !ERRORIGNORE YES" + jsLF;
zoom += "EVENT TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHAR=\"0\" MODIFIERS=ctrl" + jsLF; //Reset zoom
zoom += "EVENT TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHAR=\"-\" MODIFIERS=ctrl" + jsLF; //Zoom Out page

//Main label for macro work!
prime: {
  try {
    //prompt for random follow between 2 numbers
    let input = prompt("Follow between two numbers:", "100,1000");
    let intoArray = input.split(','); //Split by comma
    let min = intoArray[0]; //Start number
    let max = intoArray[1]; //End number
  } catch (e) {
    break prime;
  }
  nolimit: while (true) {

    main: for (let i = 1; i < Number(sum_login) + 1; i++) {
      let follow = getRandomIntInclusive(min, max); // Seconds interval between every follow
      let acctime = getRandomIntInclusive(account_interval_seconds[0], account_interval_seconds[1]); // Seconds interval between every follow
      let roundtime = getRandomIntInclusive(round_interval_seconds[0], round_interval_seconds[1]); // Seconds interval between every follow
      iimPlayCode("CLEAR"); //Remove Cookies
      iimDisplay("Cookies has been cleared!\nRandom Follow: " + follow);
      //accounts info: user,password,email
      iimSet("loop", i);
      iimPlay(accounts);

      let user = iimGetLastExtract(1); //Extract user 
      let password = iimGetLastExtract(2); //Extract password
      let email = iimGetLastExtract(3); //Email

      iimSet("username", user); //Current User
      iimSet("email", email); //Current Email
      iimSet("password", password); //Current Password

      iimPlay(login);
      let result = iimGetLastExtract();

      iimDisplay("Verify Account!\nUsername: " + user);
      iimSet("email", email);
      iimPlay(active);
      result = iimGetLastExtract();

      //Check page url for error or security check
      if (result.indexOf("https://twitter.com/account/") >= 0 || result.indexOf("https://twitter.com/login/") >= 0) {
        iimDisplay("Login Faild!\nUsername: " + user); //User faild to log in.
        iimPlayCode("WAIT SECONDS=1");
      } else {
        iimDisplay("Logged in!\nUsername: " + user); //Current User
        //profile info for follow
        iimSet("loop", i);
        iimPlay(profiles);
        let profile = iimGetLastExtract(1);
        //go to username to follow his followers
        iimSet("username", profile);
        iimSet("loop", i);
        iimPlay(gofollow);

        iimPlay(zoom); //Zoom Out
        try {
          let inputs = window.content.document.getElementsByClassName('user-actions-follow-button js-follow-btn follow-button'); //inputs field for macro header
          for (let j = 0; j < parseInt(follow) + 1; j++) {
            let followtime = getRandomIntInclusive(follow_interval_seconds[0], follow_interval_seconds[1]); //Random value for interval
            inputs[j].click(); //Hit Follow
            window.scrollBy(0, 100); //Scroll Down to load more people
            //Apply Interval between every follow and don't download images for more speed
            iimPlayCode("WAIT SECONDS=" + followtime + "\nFILTER TYPE=IMAGES STATUS=ON");
            iimDisplay("Interval between every account: " + acctime + "\nInterval between every round: " + roundtime + "\nSeconds between every follow " + followtime + "\nSigned in as: " + user);
            let remaining = parseInt(follow - j);
            //This is header template for auto follow stats.
            window.document.getElementById("global-actions").innerHTML = "" +
              "<li id=\"global-nav-follow\" >" +
              "<a data-original-title=\"\">" +
              "<span class=\"Icon Icon--follow Icon--large\"></span>" +
              "<span class=\"text\" style=\"color:red;\">Followed: " + j + " | Remains: " + remaining + "</span>" +
              "</a>" +
              "</li>" +
              "<li id=\"global-nav-tweet\" >" +
              "<a data-original-title=\"\">" +
              "<span class=\"Icon Icon--tweet Icon--large\"></span>" +
              "<span class=\"text\" style=\"color:green;\">Current Account: " + i + "</span>" +
              "</a>" +
              "</li>";
          }
        } catch (e) {
          iimDisplay("Error while following...!"); //An error message
          iimPlayCode("FILTER TYPE=IMAGES STATUS=OFF\nWAIT SECONDS=1"); //Load images
        }
        //End
        iimPlayCode("FILTER TYPE=IMAGES STATUS=OFF\nWAIT SECONDS=" + acctime); //Interval between every account
      }
    }
    iimPlayCode("FILTER TYPE=IMAGES STATUS=OFF\nWAIT SECONDS=" + roundtime); //interval between every round
  }
}