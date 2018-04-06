////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
///////////////////////////////////////////////////////
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');
var txtfile = "topicurls.txt";
var urls = lineCount(datapath + txtfile);

var jsLF = "\n";
var i, retcode, errtext, macro;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");

var _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
var _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
var _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';

function lineCount(file_path) {
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


function dashboard() {
    window.document.querySelectorAll("body")[0].innerHTML = '<div class="page-width-container" style="direction:rtl;' + _cssdash + '">' +
        '<h2>Auto Forums Poster</h2><br>' +
        '<br>username: <input class="user" type="text" name="username" style="width:100px;' + _cssinput + '">' +
        ' password: <input class="pass" type="text" name="password" style="width:100px;' + _cssinput + '"><br>' +
        '<br><input placeholder="Enter topic url" value="" class="caturl" type="text" style="width:550px;height:20px;' + _cssinput + '"></input><br>' +
        '<br><input placeholder="Enter topic title" class="title" type="text" style="width:550px;height:20px;' + _cssinput + '"></input><br>' +
        '<br><textarea placeholder="Enter your topic" class="post" type="text" style="width:550px;height:250px;' + _cssinput + '"></textarea><br>' +
        '<br><br>interval in seconds: <input class="wait" type="text" value="30" style="width:50px;' + _cssinput + '"><br><br>' +
        'Your Links: <input class="urls" type="text" value="' + urls + '" style="width:50px;' + _cssinput + '"><br><br>' +
        '<center><button class="run" style="' + _cssbutton + '">Run</button></center>' +
        '<br>' +
        '</div>';
}

function whitePage() {
    iimPlayCode("TAB CLOSEALLOTHERS\nURL GOTO=https://www.example.com");
}

///////////////////////////////////////////////////
//Open dashboard
//////////////////////////////////////////////////
whitePage();
dashboard();

window.document.querySelectorAll('.run')[0].addEventListener("click", function () {
    var user = window.document.querySelectorAll(".user")[0].value;
    var pass = window.document.querySelectorAll(".pass")[0].value;
    var mytitle = window.document.querySelectorAll(".title")[0].value;
    var mytopic = String(window.document.querySelectorAll(".post")[0].value);
    var min = window.document.querySelectorAll(".wait")[0].value;
    if (mytopic !== "") {
        Run(mytopic, mytitle, min);
    } else {
        alert("Sorry, You didn't enter any reply.");
        window.document.querySelectorAll(".post")[0].style.border = "1px solid red";
    }
});

function Run(mytopic, mytitle, min) {
    window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading...</h2></center>';

    var macro = "CODE:";
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "SET !TIMEOUT_STEP 0" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:*login ATTR=NAME:*user* CONTENT={{username}}" + jsLF;
    macro += "SET !ENCRYPTION NO" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:*login ATTR=NAME:*pass* CONTENT={{password}}" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:*login ATTR=NAME:cookieuser CONTENT=YES" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:*login ATTR=*" + jsLF;
    macro += "SET !TIMEOUT_STEP 1" + jsLF;
    main:
        while (true) {
            for (var i = 1; i <= urls; i++) {
                var forums = "CODE:";
                forums += "SET !ERRORIGNORE YES" + jsLF;
                forums += "SET !TIMEOUT_PAGE 29" + jsLF;
                forums += "SET !DATASOURCE " + txtfile + jsLF;
                forums += "SET !DATASOURCE_LINE " + i + jsLF;
                forums += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
                forums += "ONDIALOG POS=1 BUTTON=OK CONTENT=" + jsLF;
                forums += "URL GOTO={{!COL1}}" + jsLF;
                forums += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF;
                iimPlay(forums);
                iimSet("username", user[i]);
                iimSet("password", pass[i]);
                iimPlay(macro);

                var xtype = "CODE:";
                xtype += "SET !ERRORIGNORE YES" + jsLF;
                xtype += "SET !TIMEOUT_STEP 1" + jsLF;
                xtype += "TAG POS=1 TYPE=INPUT:TEXT FORM=NAME:vbform ATTR=NAME:subject CONTENT={{mytitle}}" + jsLF;
                xtype += "TAG POS=1 TYPE=SELECT FORM=NAME:vbform ATTR=NAME:prefixid CONTENT=%sale" + jsLF;
                iimSet("mytitle", mytitle);
                retcode = iimPlay(xtype);
                if (retcode < 0) {
                    break main;
                }

                iimSet("mytopic", mytopic);
                retcode = iimPlayCode("SET !TIMEOUT_STEP 0\nEVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY>DIV:nth-of-type(2)>DIV>DIV>FORM>TABLE>TBODY>TR:nth-of-type(2)>TD>DIV>DIV>TABLE:nth-of-type(3)>TBODY>TR>TD>TABLE>TBODY>TR>TD>TEXTAREA\" CHARS={{mytopic}}");
                if (retcode < 0) {
                    for (var index = 10; index < 20; index++) {
                        iimSet("mytopic", mytopic);
                        iimPlayCode("SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 0\nFRAME F=" + index + "\nEVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHARS={{mytopic}}");
                    }
                }

                iimPlayCode('SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 0\nTAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:vbform ATTR=ID:vB_Editor_001_save\nTAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:vbform ATTR=NAME:sbutton');

                iimDisplay("Interval: " + min);
                //random time
                retcode = iimPlayCode("WAIT SECONDS=" + min);
                if (retcode < 0) {
                    break main;
                }
            }
        }
}