var jsLF = "\n";
var i, retcode, errtext, macro;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var datapath = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\');

var count = 0;
var txtfile = "topicurls.txt";
var xfile = "repliedurls.txt";
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
        '<h2>Forums Auto Reply</h2><br>' +
        '<br>Username: <input class="user" value="" type="text" name="username" style="width:100px;' + _cssinput + '">' +
        ' Password: <input class="pass" value="" type="text" name="password" style="width:100px;' + _cssinput + '"><br>' +
        '<br><textarea placeholder="Enter something.." class="post" type="text" style="width:550px;height:250px;' + _cssinput + '"></textarea><br>' +
        '<br><br>Interval: <input class="wait" type="text" value="30" style="width:50px;' + _cssinput + '"><br><br>' +
        'Your Links: <input class="urls" type="text" value="' + urls + '" style="width:50px;' + _cssinput + '"><br><br>' +
        '<center><button class="run" style="' + _cssbutton + '">Run</button></center>' +
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
    var myreply = window.document.querySelectorAll(".post")[0].value;
    var min = window.document.querySelectorAll(".wait")[0].value;
    if (myreply !== "") {
        Run(myreply, min, user, pass);
    } else {
        alert("Sorry, you didn't enter any relpy.");
        window.document.querySelectorAll(".post")[0].style.border = "1px solid red";
    }
});

function Run(myreply, min, user, pass) {
    window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:rtl">Loading...</h2></center>';
    for (i = 1; i <= getFileLines(datapath + txtfile); i++) {
        try {
            var forums = "CODE:";
            forums += "SET !ERRORIGNORE YES" + jsLF;
            forums += "SET !TIMEOUT_PAGE 39" + jsLF;
            forums += "SET !DATASOURCE " + txtfile + jsLF;
            forums += "SET !DATASOURCE_LINE " + i + jsLF;
            forums += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
            forums += "ONDIALOG POS=1 BUTTON=OK CONTENT=" + jsLF;
            forums += "URL GOTO={{!COL1}}" + jsLF;
            forums += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF;
            iimPlay(forums);

            var macro = "CODE:";
            macro += "SET !ERRORIGNORE YES" + jsLF;
            macro += "SET !TIMEOUT_STEP 0" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:email_form ATTR=NAME:subject CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login ATTR=ID:ips_username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:*=login&* ATTR=NAME:username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:navbar_* ATTR=ID:navbar_username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:guest_form ATTR=NAME:user CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:login ATTR=ID:LoginControl CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:*/login.* ATTR=NAME:vb_* CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:navbar_loginform ATTR=ID:navbar_username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:login.php ATTR=ID:navbar_username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:member* ATTR=NAME:username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:*login ATTR=ID:*user* CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:*login ATTR=NAME:*user* CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:login.php?do=login ATTR=ID:navbar_username CONTENT={{username}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:member.php ATTR=NAME:username CONTENT={{username}}" + jsLF;
            macro += "FRAME F=1" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:idLoginForm ATTR=ID:idLoginUserName CONTENT={{username}}" + jsLF;
            macro += "SET !ENCRYPTION NO" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:idLoginForm ATTR=ID:idLoginPassword CONTENT={{password}}" + jsLF;
            macro += "FRAME F=0" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:email_form ATTR=NAME:text CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:login.php ATTR=NAME:vb_login_password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login ATTR=ID:ips_password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:*=login&* ATTR=NAME:password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:navbar_* ATTR=ID:navbar_password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:member.php ATTR=NAME:password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:guest_form ATTR=NAME:passwrd CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:login ATTR=ID:ctrl_password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:*/login.* ATTR=NAME:vb_* CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ID:navbar_loginform ATTR=ID:navbar_password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:login.php?do=login ATTR=ID:navbar_password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:*login ATTR=NAME:*pass* CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:login* ATTR=ID:*pass* CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:member* ATTR=NAME:password CONTENT={{password}}" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:CHECKBOX FORM=ACTION:*login ATTR=NAME:cookieuser CONTENT=YES" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:*login ATTR=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:login.php ATTR=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:*login ATTR=ID:submit" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:member* ATTR=NAME:submit" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:IMAGE FORM=ACTION:login.php?do=login ATTR=SRC:*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:navbar_loginform ATTR=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:login.php?do=login ATTR=ID:btn" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:login ATTR=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:guest_form ATTR=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:navbar_loginform ATTR=*" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:email_form ATTR=ID:submit_form" + jsLF;
            macro += "FRAME F=1" + jsLF;
            macro += "TAG POS=1 TYPE=BUTTON FORM=ID:idLoginForm ATTR=ID:idLoginBtn" + jsLF;
            macro += "FRAME F=0" + jsLF;
            macro += "SET !TIMEOUT_STEP 1" + jsLF;
            macro += "TAG POS=1 TYPE=A ATTR=TXT:*<SP>*<SP>*<SP>*<SP>*<SP>*" + jsLF;
            iimSet("username", user);
            iimSet("password", pass);
            iimPlay(macro);
            iimPlayCode("SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 0\nTAG POS=1 TYPE=IMG ATTR=SRC:*://*/quickreply.gif");
            iimPlayCode("SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 0\nTAG POS=1 TYPE=A ATTR=ID:newreplylink_bottom");
            var frametest = 0;
            dynamic_frame:
                while (true) {
                    try {
                        var type = "CODE:";
                        type += "SET !TIMEOUT_STEP 0" + jsLF;
                        type += "FRAME F=" + frametest + jsLF;
                        type += "SET !ERRORIGNORE YES" + jsLF;
                        type += "EVENT TYPE=CLICK SELECTOR=\"HTML\" BUTTON=0" + jsLF;
                        type += "TAG POS=1 TYPE=IMG ATTR=SRC:*://*/quickreply.gif" + jsLF;
                        type += "TAG POS=2 TYPE=IMG ATTR=SRC:*://*/quickreply.gif" + jsLF;
                        type += "TAG POS=1 TYPE=IMG ATTR=SRC:*://*/t_qr.gif" + jsLF;
                        type += "EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHARS={{myreply}}" + jsLF;
                        type += "EVENTS TYPE=KEYPRESS SELECTOR=\"#vB_Editor_001_textarea\" CHARS={{myreply}}" + jsLF;
                        type += "TAG POS=1 TYPE=TEXTAREA FORM=ACTION:newreply* ATTR=NAME:message CONTENT={{myreply}}" + jsLF;
                        type += "TAG POS=1 TYPE=TEXTAREA FORM=ID:qrform ATTR=ID:vB_Editor_QR_textarea CONTENT={{myreply}}" + jsLF;
                        type += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:vbform ATTR=ID:vB_Editor_001_editor CONTENT={{myreply}}" + jsLF;
                        type += "TAG POS=1 TYPE=TEXTAREA FORM=NAME:quick* ATTR=DIR:rtl&&TABINDEX:1&&ROLE:textbox&&ARIA-LABEL:*&&CLASS:*<SP>*&&TXT: CONTENT={{myreply}}" + jsLF;
                        iimSet("myreply", myreply);
                        iimPlay(type);

                        if (frametest >= 49) {
                            break dynamic_frame;
                        } else {
                            count++;
                            iimSet("ex", urls[count]);
                            iimPlayCode("SET !EXTRACT {{ex}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=" + xfile + "");
                            frametest++;
                        }
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
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:quick_reply ATTR=ID:qr_submit" + jsLF;
            macro += "EVENT TYPE=CLICK SELECTOR=\"#btn\" BUTTON=0" + jsLF;
            macro += "EVENT TYPE=CLICK SELECTOR=\"#qr_submit\" BUTTON=0" + jsLF;
            macro += "EVENT TYPE=CLICK SELECTOR=\"#vB_Editor_001_save\" BUTTON=0" + jsLF;
            macro += "TAG POS=2 TYPE=INPUT:SUBMIT FORM=NAME:vbform ATTR=NAME:sbutton" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=NAME:vbform ATTR=NAME:sbutton" + jsLF;
            macro += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ID:qrform ATTR=ID:qr_submit" + jsLF;
            retcode = iimPlay(macro);
            if (retcode < 0) {
                break;
            }

            iimDisplay("Interval: " + min + "\nLinks: " + i);
            retcode = iimPlayCode("SET !ERRORIGNORE YES\nWAIT SECONDS=" + min);
            if (retcode < 0) {
                break;
            }
        } catch (error) {
            continue;
        }
    }
    alert("Finished.");
}