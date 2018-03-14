 ////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
///////////////////////////////////////////////////////
 /*jshint esversion: 6 */
 var jsLF = "\n";
  var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIWebNavigation)
  .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
  .QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIDOMWindow).iMacros;
  var filename = iMacros._currentMacro.name;
  var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');
  var txtfile = "TwitterAccounts.txt";

 function AppsaveAs(user) {
     iimSet("usr", user);
     iimPlayCode("SET !EXTRACT {{usr}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=twitterappsubs.txt");
 }

 var lines = +prompt('How many accounts do you have?');
 for (var index = 1; index < lines; index++) {
     var Subs = "CODE:";
     Subs += "SET !ERRORIGNORE YES" + jsLF;
     Subs += "CLEAR" + jsLF;
     Subs += "SET !TIMEOUT_STEP 3" + jsLF;
     Subs += "SET !DATASOURCE_DELIMITER :" + jsLF;
     Subs += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
     Subs += "SET !DATASOURCE_COLUMNS 3" + jsLF;
     Subs += "SET !DATASOURCE_LINE " + index + jsLF;
     Subs += "URL GOTO=http://www.alshqrdyh.com/twitter/login" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:oauth_form ATTR=ID:username_or_email CONTENT={{!COL1}}" + jsLF;
     Subs += "SET !ENCRYPTION NO" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:oauth_form ATTR=ID:password CONTENT={{!COL2}}" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:oauth_form ATTR=ID:allow" + jsLF;
     Subs += "SET !TIMEOUT_STEP 0" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login-challenge-form ATTR=ID:challenge_response CONTENT={{!COL3}}" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login-challenge-form ATTR=ID:email_challenge_submit" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=CLASS:&&NAME:&&ID:allow&&TABINDEX:&&VALUE:*&&TYPE:submit" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:oauth_form ATTR=VALUE:*&CLASS:submit<SP>button<SP>selected&&ID:allow&&TYPE:submit" + jsLF;
     Subs += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:oauth_form ATTR=ID:allow" + jsLF;
     Subs += "SET !EXTRACT {{!COL1}}" + jsLF;
     iimPlay(Subs);
     var user = iimGetLastExtract();
     AppsaveAs(user);

     iimDisplay("Current: " + index);
 }