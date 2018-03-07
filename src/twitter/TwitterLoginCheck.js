////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
///////////////////////////////////////////////////////
var jsLF = "\n";
for (var i = 1;; i++) {
  var macro = "CODE:";
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
  var result = iimGetLastExtract();
  var area = window.document.querySelectorAll('#challenge_response').length;
  // window.console.log(result);
  if (result.indexOf("/account/access") >= 0 && area == 0) {
    iimDisplay("The Account is closed!");
    var macro = "CODE:";
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
    var macro = "CODE:";
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