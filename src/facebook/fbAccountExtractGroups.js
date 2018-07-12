var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
// iimPlayCode("SET !USERAGENT \"\"");
iimPlayCode("URL GOTO=https://m.facebook.com/groups/?category=groups&ref=group_browse");

// var groups = window.document.querySelectorAll('.bn');
for (var i = 1;; i++) {
    try {
        window.document.querySelector('#m_more_item > a:nth-child(1) > span:nth-child(1)').click();
    } catch (error) {
        window.scrollBy(0, 2000);
    }
    // var groups = window.document.querySelectorAll('.bn');
    var macro = "CODE:";
    macro += "SET !ERRORIGNORE NO" + jsLF;
    macro += "SET !TIMEOUT_STEP 3" + jsLF;
    macro += "TAG POS={{loop}} TYPE=LI ATTR=CLASS:bo EXTRACT=TXT" + jsLF;
    macro += "ADD loop 1" + jsLF;
    macro += "TAG POS={{loop}} TYPE=A ATTR=HREF:/groups/*?refid=* EXTRACT=HREF" + jsLF;
    iimSet("loop", i);
    retcode = iimPlay(macro);
    if (retcode < 0) {
        alert("Extracted:" + " " + i + " " + "Group");
        break;
    } else {
        var gname = iimGetLastExtract(1);
        var gurl = iimGetLastExtract(2);
    }

    // if (gnumber === "" || gnumber === "undefined") {
    //     gnumber = 1;
    // }
    iimDisplay("Groups:" + " " + i);
    if (gname !== "#EANF#") {
        iimSet("name", gname);
        iimSet("link", gurl.replace(/m\.|\?refid=(.*)/g, ''));
        iimPlayCode("SET !DATASOURCE_DELIMITER ;\nSET !ERRORIGNORE YES\nSET !EXTRACT {{name}}\nADD !EXTRACT {{link}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=fbgroupsurl.csv");
    } else {
        alert("Extracted:" + " " + i + " " + "Group");
        break;
    }
}
