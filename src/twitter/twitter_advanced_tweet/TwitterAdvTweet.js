////////////////////////////////////////////////////////////////////////////////////////
//Custom Settings for iMacros User
const account_interval_seconds = [1, 2]; //Interval between every account in seconds
const tweet_interval_seconds = [1, 1]; //interval between every tweet in seconds
const round_interval_seconds = [60, 180]; //interval between every round in seconds
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
 * @returns a random integer between min (included) and max (included)
 * Using Math.round() will give you a non-uniform distribution!
 */
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

let file_login = folder_mydata + "TwitterAccounts.csv"; //twitter accounts file
let file_tweets = folder_mydata + "tweets.txt"; //tweets file
let sum_login = getFileLines(file_login); //total accounts

let accounts = "CODE:" + onDebug();
accounts += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
accounts += "SET !DATASOURCE_DELIMITER :" + jsLF; //Split Datasource file by comma
accounts += "SET !DATASOURCE " + file_login + jsLF; //Get data source file
accounts += "SET !DATASOURCE_COLUMNS 3" + jsLF; //Datasource File Columns
accounts += "SET !DATASOURCE_LINE {{loop}}" + jsLF; //Current loop session
accounts += "SET !EXTRACT {{!COL1}}" + jsLF; //Username
accounts += "ADD !EXTRACT {{!COL2}}" + jsLF; //Password
accounts += "ADD !EXTRACT {{!COL3}}" + jsLF; //Email

let tweets = "CODE:" + onDebug();
tweets += "SET !ERRORIGNORE YES" + jsLF;
tweets += "SET !DATASOURCE " + file_tweets + jsLF;
tweets += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
tweets += "URL GOTO=https://twitter.com/intent/tweet?text={{!COL1}}" + jsLF;
tweets += "EVENT TYPE=CLICK SELECTOR=\"#update-form>DIV:nth-of-type(3)>FIELDSET>INPUT\" BUTTON=0" + jsLF;
tweets += "WAIT SECONDS=2" + jsLF;

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

//This code for macro plan and how it gonna work
prime: {
  let input = prompt("Min and Max Tweets:", "2,5"); //prompt for random tweet between 2 numbers
  let intoArray = input.split(','); //split using comma
  let min = intoArray[0]; //minimum
  let max = intoArray[1]; //maximum

  //will work until the end of accounts then repeat and never stop.
  nolimit: while (true) {
    main:
      //login
      for (let i = 1; i < Number(sum_login) + 1; i++) {

        let alltweets = [];
        let sum_tweets = getFileLines(file_tweets);
        for (let we = 1; we < Number(sum_tweets); we++) {
          let tweets1 = "CODE:" + onDebug();
          tweets1 += "SET !ERRORIGNORE YES" + jsLF;
          tweets1 += "SET !DATASOURCE " + file_tweets + jsLF;
          tweets1 += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
          tweets1 += "SET !EXTRACT {{!COL1}}" + jsLF;
          iimSet("loop", we);
          iimPlay(tweets1);
          let tweet = iimGetLastExtract();
          alltweets.push(tweet);
        }

        let tweet = getRandomIntInclusive(min, max);
        let acctime = getRandomIntInclusive(account_interval_seconds[0], account_interval_seconds[1]);
        let tweettime = getRandomIntInclusive(tweet_interval_seconds[0], tweet_interval_seconds[1]);
        let roundtime = getRandomIntInclusive(round_interval_seconds[0], round_interval_seconds[1]);
        iimPlayCode("CLEAR");
        iimDisplay("Clearing cookies!\nRandom Tweet: " + tweet);
        //accounts info: user,password,email
        iimSet("loop", i);
        iimPlay(accounts);
        let user = iimGetLastExtract(1);
        let password = iimGetLastExtract(2);
        let email = iimGetLastExtract(3);

        iimSet("username", user);
        iimSet("email", email);
        iimSet("password", password);
        iimPlay(login);
        result = iimGetLastExtract();
        //check
        iimDisplay("Authorize account!\nUsername: " + user);
        iimSet("email", email);
        iimPlay(active);
        result = iimGetLastExtract();

        if (result.indexOf("https://twitter.com/account/") >= 0 || result.indexOf("https://twitter.com/login/") >= 0) {
          iimDisplay("Account Login Faild!\nusername: " + user);
          iimPlayCode("WAIT SECONDS=1");
        } else {
          iimDisplay("Account Sign in Faild!\nusername: " + user);
          for (let j = 1; j < parseInt(tweet) + 1; j++) {
            let loopa = j - 1;
            delete alltweets[loopa];
            iimSet("loop", j);
            iimPlay(tweets);
            iimPlayCode("WAIT SECONDS=" + tweettime + "\nFILTER TYPE=IMAGES STATUS=ON");
            iimDisplay("Seconds between every account: " + acctime + "\nSeconds between every round: " + roundtime + "\nSeconds between every tweet: " + tweettime + "\nLogged in: " + user);
            let remaining = parseInt(tweet - j);
            //This is header template for auto follow stats.
            window.document.getElementById("header").innerHTML = "" +
              "<li id=\"global-nav-tweet\" >" +
              "<a data-original-title=\"\">" +
              "<span class=\"Icon Icon--tweet Icon--large\"></span>" +
              "<span class=\"text\" style=\"color:red;\">Tweeted: " + j + " | Remaining: " + remaining + "</span>" +
              "</a>" +
              "</li>" +
              "<li id=\"global-nav-tweet\" >" +
              "<a data-original-title=\"\">" +
              "<span class=\"Icon Icon--tweet Icon--large\"></span>" +
              "<span class=\"text\" style=\"color:green;\">Currently: " + i + "</span>" +
              "</a>" +
              "</li>";
            iimPlayCode("FILTER TYPE=IMAGES STATUS=OFF\nWAIT SECONDS=" + acctime);
          }
          iimDisplay("loading new tweets file.\nPlease don't stop the script.");
          iimPlayCode("FILEDELETE NAME=" + folder_mydata + "tweets.txt");
          for (let wee = 0; wee < Number(sum_tweets); wee++) {
            if (alltweets[wee] !== undefined) {
              iimSet("line", alltweets[wee]);
              iimPlayCode("SET !EXTRACT {{line}}\nSAVEAS TYPE=EXTRACT FOLDER=" + folder_mydata + " FILE=tweets.txt");
            }
          }
        }
        iimDisplay("Finished!");
      }
    iimDisplay("Seconds between every account: " + acctime + "\nSeconds between every round: " + roundtime + "\nSeconds between every tweet: " + tweettime + "\nLogged in: " + user);
    iimPlayCode("FILTER TYPE=IMAGES STATUS=OFF\nWAIT SECONDS=" + roundtime);
  }
}