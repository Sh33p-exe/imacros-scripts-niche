var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');


var jsLF = "\n";
var i, retcode, errtext, macro;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var txtfile = "signurls.txt";
var xfile = "signurls.txt";
var urls = getFileLines(datapath + txtfile);
var _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
var _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
var _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';

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

function dashboard() {
    window.document.querySelectorAll("body")[0].innerHTML = '<div class="page-width-container" style="direction:rtl;' + _cssdash + '">' +
        '<h2>Signature for forums</h2><br>' +
        '<br><textarea placeholder="somthing here..." class="post" type="text" style="width:550px;height:250px;' + _cssinput + '"></textarea><br>' +
        '<br><br>interval: <input class="wait" type="text" value="30" style="width:50px;' + _cssinput + '"><br><br>' +
        'your links: <input class="urls" type="text" value="' + urls + '" style="width:50px;' + _cssinput + '"><br><br>' +
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
    var myreply = window.document.querySelectorAll(".post")[0].value;
    var min = window.document.querySelectorAll(".wait")[0].value;
    if (myreply !== "") {
        Run(myreply, min);
    } else {
        alert("Sorry You, Didn't enter any Signature.");
        window.document.querySelectorAll(".post")[0].style.border = "1px solid red";
    }
});

function Run(myreply, min) {
    window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading...</h2></center>';
    for (i = 0; i < urls; i++) {
        var forums = "CODE:";
        forums += "SET !DATASOURCE " + txtfile + jsLF;
        forums += "SET !DATASOURCE_LINE " + Number(i + 1) + jsLF;
        forums += "URL GOTO={{!COL1}}" + jsLF;  
        iimPlay(forums);
        var frametest = 0;
        dynamic_frame:
            while (true) {
                try {
                    var type = "CODE:";
                    type += "SET !TIMEOUT_STEP 0" + jsLF;
                    type += "FRAME F=" + frametest + "" + jsLF;
                    type += "SET !ERRORIGNORE YES" + jsLF;
                    //Select All
                    type += "EVENT TYPE=KEYPRESS SELECTOR=\"#cke_contents_vB_Editor_001_editor>TEXTAREA\" CHAR=a MODIFIERS=ctrl" + jsLF;
                    type += "EVENT TYPE=KEYPRESS SELECTOR=\"#vB_Editor_QR_textarea\" CHAR=a MODIFIERS=ctrl" + jsLF;
                    type += "EVENT TYPE=KEYPRESS SELECTOR=\"#vB_Editor_001_textarea\" CHAR=a MODIFIERS=ctrl" + jsLF;
                    type += "EVENT TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHAR=a MODIFIERS=ctrl" + jsLF;
                    //Type comment
                    type += "EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHARS={{myreply}}" + jsLF;
                    type += "EVENTS TYPE=KEYPRESS SELECTOR=\"#cke_contents_vB_Editor_001_editor>TEXTAREA\" CHARS={{myreply}}" + jsLF;
                    type += "EVENTS TYPE=KEYPRESS SELECTOR=\"#vB_Editor_QR_textarea\" CHARS={{myreply}}" + jsLF;
                    type += "EVENTS TYPE=KEYPRESS SELECTOR=\"#vB_Editor_001_textarea\" CHARS={{myreply}}" + jsLF;
                    iimSet("myreply", myreply);
                    retcode = iimPlay(type);
                    if (frametest >= 49) {
                        break dynamic_frame;
                    } else {
                        count++;
                        iimSet("ex", urls[count]);
                        iimPlayCode("SET !EXTRACT {{ex}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=" + xfile + "");
                        frametest++;
                    }
                } catch (error) {
                    frametest++;
                }
            }
        macro = "CODE:";
        macro += "SET !ERRORIGNORE YES" + jsLF;
        macro += "SET !TIMEOUT_STEP 0" + jsLF;
        macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:vbform ATTR=*" + jsLF;
        macro += "EVENT TYPE=CLICK SELECTOR=\"#qr_submit\" BUTTON=0" + jsLF;
        macro += "EVENT TYPE=CLICK SELECTOR=\"#vB_Editor_001_save\" BUTTON=0" + jsLF;
        macro += "TAG POS=2 TYPE=INPUT:SUBMIT FORM=NAME:vbform ATTR=*" + jsLF;
        retcode = iimPlay(macro);
        if (retcode < 0) {
            break;
        }

        iimDisplay("Interval: " + min + "\nYour Links: " + i);
    }
    alert("Finished.");
}