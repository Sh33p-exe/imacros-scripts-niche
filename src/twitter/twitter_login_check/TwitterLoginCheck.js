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
var jsLF = "\n";
for (let i = 1;; i++) {
  let macro = "CODE:" + onDebug();
  macro += "CLEAR" + jsLF;
  macro += "SET !ERRORIGNORE YES" + jsLF;
  macro += "SET !USERAGENT \"mobile\"" + jsLF;
  macro += "SET !EXTRACT_TEST_POPUP NO" + jsLF;
  macro += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
  macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
  macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
  macro += "SET !DATASOURCE_COLUMNS 3" + jsLF;
  macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
  macro += "URL GOTO=https://twitter.com/login?lang=en" + jsLF;
  macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/sessions ATTR=NAME:session[username_or_email] CONTENT={{!COL1}}" + jsLF;
  macro += "SET !ENCRYPTION NO" + jsLF;
  macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF;
  macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/sessions ATTR=NAME:commit" + jsLF;
  macro += "SET !TIMEOUT_STEP 0" + jsLF;
  macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/account/login_challenge ATTR=NAME:challenge_response CONTENT={{!COL3}}" + jsLF;
  macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/account/login_challenge ATTR=*" + jsLF;
  macro += "SET !EXTRACT {{!URLCURRENT}}" + jsLF;
  iimSet("loop", i);
  iimPlay(macro);
  let result = iimGetLastExtract();
  let area = window.document.querySelectorAll('#challenge_response').length;
  // window.console.log(result);
  if (result.indexOf("/account/access") >= 0 && area == 0) {
    iimDisplay("The Account is closed!");
    let macro = "CODE:" + onDebug();
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "SET !EXTRACT_TEST_POPUP NO" + jsLF;
    macro += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
    macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
    macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
    macro += "SET !DATASOURCE_COLUMNS 3" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "SET !EXTRACT {{!COL1}}:{{!COL2}}:{{!COL3}}" + jsLF;
    macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=ClosedAccounts.csv" + jsLF;
    iimSet("loop", i);
    iimPlay(macro);
  } else {
    let macro = "CODE:" + onDebug();
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "SET !TIMEOUT_STEP 1" + jsLF;
    macro += "SET !EXTRACT_TEST_POPUP NO" + jsLF;
    macro += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
    macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
    macro += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
    macro += "SET !DATASOURCE_COLUMNS 3" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "SET !EXTRACT {{!COL1}}:{{!COL2}}:{{!COL3}}" + jsLF;
    macro += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=CheckedAccounts.csv" + jsLF;
    iimSet("loop", i);
    iimPlay(macro);
  }
  iimDisplay("Current: " + i);
}