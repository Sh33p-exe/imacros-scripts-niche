////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only, Also to activate all other variables you must activate easy debug mode first to true OR 1.
const EASY_DEBUG_MODE = true; //To active built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //please note that change useragent may change the whole website interface.
////////////////////////////////////////////////////////////////////////////////////////
//Variable for iMacros built-in memory to remember the next loop session by using new lines between every command for iMacros.
let jsLF = "\n";
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
////////////////////////////////////////////////////////////////////////////////////////
// Functions Section
///////////////////////////////////////////////////////////////////////////////////////
/** @returns total lines of any file path */
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
      return "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES\nSET !ERRORIGNORE NO";
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
////////////////////////////////////////////////////////////////////////////////////////
// Macro Section
///////////////////////////////////////////////////////////////////////////////////////
var check;
check = "CODE:" + onDebug();
check += "SET !TIMEOUT_STEP 0" + jsLF; //timeout for current step
check += "TAB CLOSEALLOTHERS" + jsLF; //close all other browser tabs
check += "URL GOTO=https://m.facebook.com/groups/?seemore" + jsLF; //open groups page
check += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=NAME:login EXTRACT=TXT" + jsLF;  //extract login info

var macro;
macro = "CODE:" + onDebug();
macro += "SET !ERRORIGNORE YES" + jsLF;
macro += "URL GOTO=https://m.facebook.com/groups/?seemore" + jsLF; //Open groups page 
macro += "TAG POS={{line}} TYPE=A ATTR=HREF:/groups/*?refid=* EXTRACT=HREF" + jsLF; //extrat current line
macro += "TAB OPEN" + jsLF; //open new tap
macro += "TAB T=2" + jsLF; //move to the new tab
macro += "URL GOTO={{!EXTRACT}}" + jsLF; //extract current url
macro += "SET !EXTRACT NULL" + jsLF; //empty extraction variable
macro += "TAG POS=1 TYPE=H3 ATTR=CLASS:*<SP>*<SP>* EXTRACT=TXT" + jsLF; //extract Text

//Datasource for post
var datasource;
datasource = "CODE:" + onDebug();
datasource += "SET !TIMEOUT_STEP 0" + jsLF;
datasource += "SET !ERRORIGNORE YES" + jsLF;
datasource += "SET !DATASOURCE FacebookPost.csv" + jsLF;
datasource += "SET !DATASOURCE_COLUMNS 3" + jsLF;
datasource += "SET !DATASOURCE_LINE {{loop}}" + jsLF;

//Use first datasource with the next image file
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

//Post steps
var post;
post = "CODE:" + onDebug();
post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?av=*&refid=* ATTR=NAME:view_photo" + jsLF; //view image 
post += "TAG POS=1 TYPE=INPUT:FILE FORM=ACTION:/composer/mbasic/?csid=*&av=*&view_overview ATTR=NAME:file1 CONTENT={{photo}}" + jsLF;//upload image by path
post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?csid=*&av=*&view_overview ATTR=NAME:add_photo_done" + jsLF; //submit upload
post += "TAG POS=1 TYPE=TEXTAREA FORM=ACTION:/composer/mbasic/?csid=*&*=xc_message&av=* ATTR=NAME:xc_message CONTENT={{addpost}}<BR>{{url}}" + jsLF; //add the post and newline then URL
post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?csid=*&*=xc_message&av=* ATTR=NAME:view_post" + jsLF; //then view post
post += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/friends/selector/?return_uri=* ATTR=NAME:done" + jsLF; //submit all done.
///////////////////////////////////////////////////////////////////////////////////////
iimPlay(check);
var result = iimGetLastExtract();
if (result === "Log in") {
	alert("Please sign in first.");
	iimPlay("CODE:" + onDebug() + "PAUSE");
}
for (var i = 1; i <= number_group; i++) {
	var num = i + 1;
	iimDisplay("Group: " + i + "\n");
	iimSet("line", num);
	iimPlay(macro);
	iimDisplay("Loading data...");
	var groupname = iimGetLastExtract();
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
	iimPlay(datasource3);
	//temp path
	var pathimg = "C:\\temp\\tempimg.jpg";
	//then type it & post it!
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