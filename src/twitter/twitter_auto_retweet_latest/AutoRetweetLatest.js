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
//A variable being used as memory to remember the next loop session by using new lines between every command.
var jsLF = "\n";
//Loop, error handling variables
let i, retcode, errtext;
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
let imdata = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\'); //Get Datasources Folder Path
////////////////////////////////////////////////////////////////////////////////////////
let username = prompt("Main Account Username:");
let accounts = +prompt("Accounts:");
let re_tweets = +prompt("How many tweets to retweet?");
//Don't Stop
while (true) {
  //Repeat until the end of accounts
  for (let i = 1; i <= accounts; i++) {
    //Start Login Macro
    let macro;
    macro = "CODE:" + onDebug();
    macro += "SET !USERAGENT \"iphone\"" + jsLF; //A Useragent to get twitter mobile version
    macro += "TAB CLOSEALLOTHERS" + jsLF; //Close All Other Browser tabs
    macro += "CLEAR" + jsLF; //Remove Cookies
    macro += "FILTER TYPE=IMAGES STATUS=ON" + jsLF; //Don't load Images for faster automation.
    macro += "SET !ERRORIGNORE YES" + jsLF; //Igonre any errors
    macro += "SET !EXTRACT_TEST_POPUP NO" + jsLF; //Don't popup any test windows
    macro += "SET !DATASOURCE_DELIMITER :" + jsLF; //Split lines using : in CSV File
    macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF; //Datasource file name
    macro += "SET !DATASOURCE_COLUMNS 2" + jsLF; //How many Columns inside datasource file | 2 for username:password
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF; //Set Current Line
    macro += "URL GOTO=https://mobile.twitter.com/login" + jsLF; //Open Twitter URL
    macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/sessions ATTR=NAME:session[username_or_email] CONTENT={{!COL1}}" + jsLF; //Input Username/Email for login
    macro += "SET !ENCRYPTION NO" + jsLF; //Don't encrypt input for password field.
    macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF; //Input Password
    macro += "SET !TIMEOUT_PAGE 5" + jsLF; //Page Loading Timeout
    macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/sessions ATTR=NAME:commit" + jsLF; //Hit submit
    macro += "SET !EXTRACT {{!URLCURRENT}}" + jsLF; //Extract current page url after submit
    macro += "SET !TIMEOUT_PAGE 19" + jsLF; //Set Load timeout for page.
    macro += "WAIT SECONDS=1" + jsLF; //One Second Later!
    iimSet("loop", i);
    iimPlay(macro); //Run all macro lines!

    let result = iimGetLastExtract(); //Extract Result
    if (result.indexOf("https://mobile.twitter.com/login/error") >= 0) {
      //Error while login will be ignored to the next account.
      iimDisplay('Unable to login');
    } else {
      iimPlayCode("SET !USERAGENT \"iphone\"\nTAB OPEN\nTAB T=2\nURL GOTO=https://m.twitter.com/" + username + "?lang=en"); //Set Useragent then open tab and browse to mobile twitter interface.
      for (let j = 0; j < re_tweets; j++) {
        //Retweet Part
        let retweet = "CODE:" + onDebug();
        retweet += "SET !USERAGENT \"iphone\"" + jsLF; //Set Useragent as iphone useragent.
        retweet += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
        retweet += "SET !TIMEOUT_STEP 1" + jsLF; //Step timeout
        retweet += "WAIT SECONDS=1.10" + jsLF; //1.10 Second Later!
        retweet += "TAG POS=1 TYPE=SPAN ATTR=CLASS:imgsprite_tweet_rt_gif&&TITLE:Retweet" + jsLF; //Hit retweet button for latest tweet
        retweet += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/statuses/*/retweet ATTR=NAME:commit&&VALUE:Retweet&&TYPE:submit" + jsLF; //Submit
        retweet += "WAIT SECONDS=1.10" + jsLF; //1.10 Second Later!
        retweet += "SET !USERAGENT \"\"" + jsLF; //Reset Useragent to default
        iimDisplay("Accounts: " + i);
        iimPlay(retweet);
      }
      //Close Current Tab
      iimPlayCode("TAB CLOSE");
    }
  }
  //5 Seconds as interval between every retweet.
  iimPlayCode("WAIT SECONDS=5");
}