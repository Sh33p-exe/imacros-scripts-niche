////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
///////////////////////////////////////////////////////
var i, retcode, errtext, imdata, immacros, settings = [],
    prime = true,
    count = 0,
    good = 0,
    bad = 0,
    err = 0,
    counter = 0;
const jsLF = "\n";
// const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
//     .getService(Components.interfaces.nsIWindowMediator);
// const window = windowMediator.getMostRecentWindow("navigator:browser");
const _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 80%;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
const _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
const _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';
////////////////////////////////////////////////////////////////////////////////////////
const iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + 'Datasources\\';
////////////////////////////////////////////////////////////////////////////////////////
function count_rows(file_path) {
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

function getCurrentDate() {
    let date = new Date();
    let month = date.getUTCMonth() + 1; //months from 1-12
    let day = date.getUTCDate();
    let year = date.getUTCFullYear();
    newdate = year + "/" + month + "/" + day;
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    let strTime = hours + ':' + minutes + ':' + seconds + ' ' + ampm + ' ' + year + '/' + '/' + month + '/' + day;
    return strTime;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

function getRandomLen(len) {
    len += 2;
    return Math.random().toString().slice(2, len);
}


function password(num) {
    return Math.random().toString().slice(2, num);
}

function dashboard() {
    window.document.querySelectorAll("body")[0].innerHTML = '<div class=".dash" style="text-align: center;' + _cssdash + '">' +
        '<h2 style="color:orange">Whatsapp Auto Poster</h2><br>' +
        '<span>Message: </span><br><textarea id="msg" style="height: 80px;width: 450px;' + _cssinput + '" type="text"></textarea><br>' +
        '<span>Links (Support preview): </span><br><textarea id="num" style="height: 80px;width: 450px;' + _cssinput + '" type="text"></textarea><br>' +
        '<input class="filein" type="file" data="" accept="file_extension">' +
        '<p>Image Text File: "Whatsappimg.txt"</p><br>' +
        '<p>You have : ' +
        count_rows(imdata + "Whatsappimg.txt") +
        ' images</p><br>' +
        '<br><span>Enter your Numbers:</span><br><textarea id="showlist" dir=auto style="height: 150px;width: 150px;' + _cssinput + '" type="text"></textarea>' +
        '<br><br><span>Interval Between every message: </span><br><input class="mmin" value="5" type="text" style="width:50px;' + _cssinput + '"> - <input class="mmax" value="10" type="text" style="width:50px;' + _cssinput + '"> sec<br>' +
        '<br><span>Between every messages group from </span><input class="mgmin" value="5" type="text" style="width:50px;' + _cssinput + '"> to <input class="mgmax" value="10" type="text" style="width:50px;' + _cssinput + '"> interval between' +
        '<input class="wmin" value="5" type="text" style="width:50px;' + _cssinput + '"> to <input class="wmax" value="10" type="text" style="width:50px;' + _cssinput + '"> sec' +
        // '<br><br><span>Group Numbers:</span><br><input class="group" value="@imacros_poster" dir=auto type="text" style="width:150px;' + _cssinput + '"><br>' +
        '<center><button class="run" style="' + _cssbutton + '">Run</button></center>' +
        '</div>';
}
////////////////////////////////////////////////////////////////////////////////////////
//Open dashboard
///////////////////////////////////////////////////////////////////////////////////////
//Go to whatsapp
iimPlayCode("ONDIALOG POS=1 BUTTON=OK CONTENT=\nTAB CLOSEALLOTHERS\nURL GOTO=https://web.whatsapp.com/");
//Check for whatsapp window
iimPlayCode("SET !TIMEOUT_STEP 300\nTAG POS=1 TYPE=DIV ATTR=CLASS:_*");


//check if log in
if (window.document.body.innerText.indexOf('To use WhatsApp on your computer') === -1) {
    try {
        count_rows(imdata + "Whatsappimg.txt")
        dashboard();
    } catch (error) {
        alert('Whatsappimg.txt is not exist in datasources, please create it first.');
    }

    window.document.querySelectorAll('input[type="file"]')[0].addEventListener("change", function () {
        this.setAttribute('data', this.value);
    });
    window.document.querySelectorAll('.run')[0].addEventListener("click", function () {
        let msg = window.document.querySelector('textarea[id="msg"]').value;
        let links = window.document.querySelector('textarea[id="num"]').value.split('\n');
        let upfile = window.document.querySelectorAll(".filein:not([data=\"\"])");
        let mgmax = window.document.querySelector(".mgmax").value;
        let mgmin = window.document.querySelector(".mgmin").value;
        let wmin = window.document.querySelector(".wmin").value;
        let wmax = window.document.querySelector(".wmax").value;
        let mmin = window.document.querySelector(".mmin").value;
        let mmax = window.document.querySelector(".mmax").value;
        let list = window.document.getElementById('showlist').value.split('\n');
        ///////////////////////////////////////////////////////////////////////////////////
        iimPlayCode("SET !EXTRACT {{!NOW:yymmddhhnnss}}");
        let session = iimGetLastExtract();
        try {
            upfile = upfile[0].getAttribute('data');
        } catch (error) {
            upfile = "none";
        }
        window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:ltr">Loading...</h2></center>';

        //open whatsapp
        iimPlayCode("ONDIALOG POS=1 BUTTON=OK CONTENT=\nURL GOTO=https://web.whatsapp.com/");

        //wait for page to loading
        iimPlayCode("SET !TIMEOUT_STEP 300\nTAG POS=1 TYPE=DIV ATTR=CLASS:_*");
        let gmessages = getRandomInt(mgmin, mgmax);

        //remove error message if number not found
        window.setInterval(function () {
            let xerr = window.document.querySelectorAll('._3gUiM');
            if (xerr.length)
                xerr.forEach(e => e.parentNode.removeChild(e));
        }, 300);
        //////////////////////////////////////////
        for (let index = 0; index < list.length; index++) {


            try {
                interval = Number(getRandomInt(mmin, mmax));
                window.console.log("***Account: " + index);
                //Send to number Section
                if (index === 0) {
                    iimPlayCode("WAIT SECONDS=5");
                    window.document.querySelector("header").innerHTML += '<div id="numplace"></div>';
                }
                //Go to number
                window.document.querySelector("#numplace").innerHTML = '<a id="xclick" href="https://api.whatsapp.com/send?phone=' + list[index] + '" title="https://api.whatsapp.com/send?phone=' + list[index] + '" target="_blank" rel="noopener noreferrer" class="selectable-text invisible-space copyable-text">';
                window.document.querySelector('#xclick').click();
                if (index === 0)
                    iimPlayCode("WAIT SECONDS=5");
                else
                    iimPlayCode("WAIT SECONDS=1");
                try {
                    let current_number = parseInt(window.document.querySelector('._2zCDG > span:nth-child(1)').title.replace(/\s/g, ''));
                } catch (error) {
                    iimDisplay(current_number + ' not found.');
                }
                iimPlayCode("WAIT SECONDS=5");

                if (index > 0) {
                    retcode = iimPlayCode("WAIT SECONDS=" + interval);
                    if (retcode < 0)
                        break;
                }
                ////////////////////////////////////////
                //Send Message
                if (Number(list[index]) === Number(current_number)) {
                    let macro = "CODE:";
                    macro += "SET !TIMEOUT_STEP 1" + jsLF;
                    macro += "SET !CLIPBOARD {{msg}}<br>{{!NOW:mm/dd<SP>hh:nn:ss}}" + "<br>" + Math.random().toString(36).substring(7) + jsLF;
                    macro += "EVENT TYPE=KEYPRESS SELECTOR=\"#main>FOOTER>DIV>DIV>DIV>DIV:nth-of-type(2)\" CHAR=V MODIFIERS=CTRL" + jsLF;
                    macro += "EVENT TYPE=CLICK SELECTOR=\"#main>FOOTER>DIV>BUTTON\" BUTTON=0" + jsLF;
                    macro += "SET !ERRORIGNORE YES" + jsLF;
                    macro += "SET !REPLAYSPEED SLOW" + jsLF;
                    for (i = 0; i < links.length; i++) {
                        macro += "EVENTS TYPE=KEYPRESS SELECTOR=\"#main>FOOTER>DIV>DIV>DIV>DIV:nth-of-type(2)\" CHARS=" + links[i] + jsLF;
                        macro += "EVENT TYPE=CLICK SELECTOR=\"#main>FOOTER>DIV>BUTTON\" BUTTON=0" + jsLF;
                    }
                    if (count_rows(imdata + "Whatsappimg.txt") !== 0) {
                        for (i = 1; i <= count_rows(imdata + "Whatsappimg.txt"); i++) {
                            macro += "SET !ERRORIGNORE YES" + jsLF;
                            macro += "SET !DATASOURCE Whatsappimg.txt" + jsLF;
                            macro += "EVENT TYPE=CLICK SELECTOR=\"#main>HEADER>DIV:nth-of-type(3)>DIV>DIV:nth-of-type(2)>DIV>SPAN\" BUTTON=0" + jsLF;
                            macro += "TAG POS=1 TYPE=INPUT:FILE ATTR=ACCEPT:image/*,video/*&&MULTIPLE:&&TYPE:file CONTENT={{!COL1}}" + jsLF;
                            macro += "EVENT TYPE=CLICK SELECTOR=\"#app>DIV>DIV>DIV>DIV:nth-of-type(2)>SPAN>DIV>SPAN>DIV>DIV>DIV:nth-of-type(2)>SPAN:nth-of-type(2)>DIV>DIV>SPAN\" BUTTON=0" + jsLF;
                            macro += "WAIT SECONDS=3" + jsLF;
                        }
                    }
                    if (upfile.indexOf(':') >= 0) {
                        macro += "TAG POS=2 TYPE=INPUT:FILE ATTR=* CONTENT={{file}}" + jsLF;
                    }
                    macro += "TAG POS=1 TYPE=SPAN ATTR=DATA-ICON:send-light&&CLASS:&&TXT:" + jsLF;

                    iimSet("file", upfile);
                    iimSet("msg", msg);
                    // iimSet("msg", msg.replace(/((((https?)?:\/\/)(www\.)?|www\.))([a-z0-9.]+)(\.[a-z]{2,4})(\.[a-z]{1,2})?([^?\s]+(\?((\w+)(=[^&\s]+)?&?)+)?)?/g, ''));
                    retcode = iimPlay(macro);
                } else
                    retcode = "-1";
                if (retcode < 0) {
                    window.console.log("***Account Report: " + index + "");
                    iimSet("session", session);
                    iimSet("number", list[index]);
                    iimSet("exist", "Exist");
                    iimSet("status", "NO");
                    iimSet("sdate", getCurrentDate());
                    iimPlayCode("SET !EXTRACT {{number}}\nADD !EXTRACT {{status}}\nADD !EXTRACT {{sdate}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=Whatsapp-report-#{{session}}-err.csv");
                    bad++;
                    counter++;
                } else {
                    window.console.log("***Account Report: " + index + "");
                    iimSet("session", session);
                    iimSet("number", list[index]);
                    iimSet("exist", "Exist");
                    iimSet("status", "sent");
                    iimSet("sdate", getCurrentDate());
                    iimPlayCode("SET !EXTRACT {{number}}\nADD !EXTRACT {{status}}\nADD !EXTRACT {{sdate}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=Whatsapp-report-#{{session}}-sent.csv");
                    good++;
                    counter++;
                }

                // iimDisplay("error!\n" + current_number + " != " + list[index]);
                if (counter >= gmessages) {
                    counter = 0;
                    gmessages = getRandomInt(mgmin, mgmax);
                    let timer = getRandomInt(wmin, wmax);
                    retcode = iimPlayCode("WAIT SECONDS=" + Number(timer));
                    if (retcode < 0)
                        break;
                }

                //green panel
                iimDisplay("Numbers: " + list.length + "/" + (index + 1) +
                    "\n" + good + " messages sent." +
                    "\n" + bad + " messages failed." +
                    "\nErrors: " + err +
                    "\nInterval: " + interval + " sec" +
                    "\nCurrent Group: " + gmessages + "/" + counter + "");

            } catch (error) {
                iimSet("exist", "Not Exist");
                iimSet("status", "NO");
                iimSet("sdate", getCurrentDate());
                iimPlayCode("SET !EXTRACT {{number}}\nADD !EXTRACT {{status}}\nADD !EXTRACT {{sdate}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=Whatsapp-report-#{{session}}-err.csv");
                err++;
                counter++;
                iimDisplay("Error in number: " + list[index] + "\n" + error);
                iimPlayCode("WAIT SECONDS=5");
            }
        }
    }, false);
} else
    alert("Please SCAN QR CODE!");