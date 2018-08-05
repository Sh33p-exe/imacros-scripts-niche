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
var txtfile = "fbgroups.txt";
var urls = getFileLines(datapath + txtfile);
var _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
var _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
var _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';
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

whitePage();
dashboard();
window.document.querySelectorAll('#run')[0].addEventListener("click", function () {
    var post = window.document.querySelector('#txtarea').value;
    try {
        window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading...</h2></center>';
    } catch (err) {
        goBack("Error!<br>" + err + "<br>Please contact with the developer.");
    }
    main:
        while (true) {
            loop: for (var i = 1; i <= urls; i++) {
                var macro = "CODE:" + onDebug();
                macro += "CLEAR" + jsLF;
                macro += "SET !DATASOURCE_DELIMITER :" + jsLF;
                macro += "SET !ERRORIGNORE YES" + jsLF;
                macro += "SET !DATASOURCE fbaccounts.csv" + jsLF;
                macro += "SET !DATASOURCE_COLUMNS 2" + jsLF;
                macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
                macro += "URL GOTO=https://m.facebook.com/" + jsLF;
                macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login_form ATTR=ID:m_login_email CONTENT={{!COL1}}" + jsLF;
                macro += "SET !ENCRYPTION NO" + jsLF;
                macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login_form ATTR=NAME:pass CONTENT={{!COL2}}" + jsLF;
                macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login_form ATTR=NAME:login" + jsLF;
                iimSet("loop", i);
                iimPlay(macro);
                for (var qq = 1; qq < getRandomInt(1, 8); qq++) {
                    var macro = "CODE:" + onDebug();
                    macro += "CLEAR" + jsLF;
                    macro += "SET !ERRORIGNORE YES" + jsLF;
                    macro += "SET !DATASOURCE " + fbgroubs + jsLF;
                    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
                    macro += "URL GOTO={{!COL1}}" + jsLF;
                    macro += "TAG POS=1 TYPE=TEXTAREA FORM=ACTION:/composer/mbasic/?av=*&refid=*&notif_t=group_r2j_approved ATTR=ID:u_0_0 CONTENT={{post}}" + jsLF;
                    macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/composer/mbasic/?av=*&refid=*&notif_t=group_r2j_approved ATTR=NAME:view_post" + jsLF;
                    iimSet("post", post);
                    iimSet("loop", i);
                    iimPlay(macro);
                    if (i < urls)
                        break loop;
                    iimDisplay("Group: " + i);
                    retcode = iimPlayCode("WAIT SECONDS=" + getRandomInt(1, 30));
                    if (retcode < 0)
                        break main;
                    i++;
                }
            }
            retcode = iimPlayCode("WAIT SECONDS=" + getRandomInt(20, 40));
            if (retcode < 0)
                break main;
        }

});
//////////////////////////////////////DASHBOARD/////////////////////////////////////////
function dashboard() {
    window.document.querySelectorAll("body")[0].innerHTML = '<div class=".dash" style="direction:rtl;' + _cssdash + ';text-align:center">' +
        '<textarea id="txtarea" class="bl bm bo bp" rows="10" cols="50" style="' + _cssinput + '" placeholder="Your message"></textarea><br>' +
        '<hr style="width:80%;border: 0;border-top: 1px solid #eee;height: 0;margin: 14px 0 0;padding: 0;">' +
        '<center><input value="Go" name="login" class="o n p bq br bs" type="submit" id="run"></center>' +
        '</div>';
}
///////////////////////////////////////////////////////////////////////////////////////
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function password(num) {
    return Math.random().toString().slice(2, num);
}

function whitePage() {
    iimPlayCode("CLEAR\nTAB CLOSEALLOTHERS\nURL GOTO=https://m.facebook.com");
}


function goBack(message) {
    whitePage();
    window.document.querySelectorAll("body")[0].innerHTML = '<div style="' + _cssdash + '"><center><h2 style="direction:rtl;font-size: 98%;">' + message + '</h2><button class="run" style="' + _cssbutton + '">Continue</button></center></div>';
}
