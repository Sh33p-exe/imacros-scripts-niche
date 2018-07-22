////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface
////////////////////////////////////////////////////////////////////////////////////////
var jsLF = "\n";
var number_group = prompt("How many groups do you have?");

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

//For Windows paths only!
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';
var immacros = imfolder + '\\Macros\\';

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

var check;
check = "CODE:" + onDebug();
check += "SET !ERRORIGNORE YES" + jsLF;
check += "SET !TIMEOUT_STEP 0" + jsLF;
check += "TAB CLOSEALLOTHERS" + jsLF;
check += "TAB OPEN" + jsLF;
check += "TAB T=2" + jsLF;
check += "TAB T=1" + jsLF;
check += "TAB CLOSE" + jsLF;
check += "SET !EXTRACT_TEST_POPUP NO" + jsLF;
check += "URL GOTO=https://m.facebook.com/groups/?seemore" + jsLF;
check += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=NAME:login EXTRACT=TXT" + jsLF;

iimPlay(check);

var result = iimGetLastExtract();
if (result === "Log in") {
	alert("Please sign in first.");
	iimPlay("CODE:" + onDebug() + "PAUSE");
}

for (var i = 1; i <= number_group; i++) {
	var num = i + 1;


	var macro;
	macro = "CODE:" + onDebug();
	macro += "SET !EXTRACT_TEST_POPUP NO" + jsLF;
	macro += "SET !ERRORIGNORE YES" + jsLF;
	macro += "URL GOTO=https://m.facebook.com/groups/?seemore" + jsLF;
	macro += "TAG POS={{line}} TYPE=A ATTR=HREF:/groups/*?refid=* EXTRACT=HREF" + jsLF;
	macro += "TAB OPEN" + jsLF;
	macro += "TAB T=2" + jsLF;
	macro += "URL GOTO={{!EXTRACT}}" + jsLF;
	macro += "SET !EXTRACT NULL" + jsLF;
	macro += "TAG POS=1 TYPE=H3 ATTR=CLASS:*<SP>*<SP>* EXTRACT=TXT" + jsLF;
	iimDisplay("Group: " + i + "\n");
	iimSet("line", num);
	iimPlay(macro);
	iimDisplay("Loading data...");
	var groupname = iimGetLastExtract();

	//Datasource for post
	var datasource;
	datasource = "CODE:" + onDebug();
	datasource += "SET !TIMEOUT_STEP 0" + jsLF;
	datasource += "SET !ERRORIGNORE YES" + jsLF;
	datasource += "SET !DATASOURCE FacebookPost.csv" + jsLF;
	datasource += "SET !DATASOURCE_COLUMNS 3" + jsLF;
	datasource += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
	//EXTRACT THE POST
	var datasource1;
	datasource1 = datasource;
	datasource1 += "SET !EXTRACT {{!COL1}}" + jsLF;
	iimPlay(datasource1);
	var type = iimGetLastExtract();
	//EXTRACT THE URL
	var datasource2;
	datasource2 = datasource;
	datasource2 += "SET !EXTRACT {{!COL2}}" + jsLF;
	iimPlay(datasource2);
	var link = iimGetLastExtract();
	//EXTRACT THE IMAGE
	var datasource3;
	datasource3 = datasource;
	datasource3 += "TAB OPEN" + jsLF;
	datasource3 += "TAB T=2" + jsLF;
	datasource3 += "URL GOTO=file:///{{!COL3}}" + jsLF;
	datasource3 += "URL GOTO={{!COL3}}" + jsLF;
	datasource3 += "TAG POS=1 TYPE=IMG ATTR=HREF:*://*.* CONTENT=EVENT:SAVEITEM" + jsLF;
	datasource3 += "ONDOWNLOAD FOLDER=C:\\temp\\ FILE=tempimg.jpg" + jsLF;
	datasource3 += "TAB CLOSE" + jsLF;
	datasource3 += "WAIT SECONDS=1" + jsLF;
	iimPlay(datasource3);
	//temp path
	var pathimg = "C:\\temp\\tempimg.jpg";
	//then type it & post it!
	var post;
	post = "CODE:" + onDebug();
	post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?av=*&refid=* ATTR=NAME:view_photo" + jsLF;
	post += "TAG POS=1 TYPE=INPUT:FILE FORM=ACTION:/composer/mbasic/?csid=*&av=*&view_overview ATTR=NAME:file1 CONTENT={{photo}}" + jsLF;
	post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?csid=*&av=*&view_overview ATTR=NAME:add_photo_done" + jsLF;
	post += "TAG POS=1 TYPE=TEXTAREA FORM=ACTION:/composer/mbasic/?csid=*&*=xc_message&av=* ATTR=NAME:xc_message CONTENT={{addpost}}<BR>{{url}}" + jsLF;
	post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?csid=*&*=xc_message&av=* ATTR=NAME:view_post" + jsLF;
	post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/friends/selector/?return_uri=* ATTR=NAME:done" + jsLF;

	iimSet("addpost", type);
	iimSet("url", link);
	iimSet("photo", pathimg);
	iimSet("loop", i);
	iimDisplay("Posting in group " + groupname + "\n Group: " + i);
	iimPlay(post);

	//Wait some seconds...
	var randomtime;
	randomtime = "CODE:" + onDebug();
	randomtime += "WAIT SECONDS={{randomsec}}" + jsLF;
	var randomseconds = Math.floor((Math.random() * 120) + 70);
	var min = Math.floor(randomseconds / 60);
	iimSet("randomsec", randomseconds);
	iimDisplay("Random Interval...\n Group: " + i + "\n Waiting: " + min + " Min");
	iimPlay(randomtime);
}