var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
while (true) {
    for (var index = 1; index <= 10; index++) {
        var macro = "CODE:";
        macro += "SET !ERRORIGNORE YES" + jsLF;
        macro += "TAG POS={{loop}} TYPE=SPAN ATTR=CLASS:st EXTRACT=TXT" + jsLF;
        iimSet("loop", index);
        iimPlay(macro);
        var result = iimGetLastExtract().match(/\b([A-Za-z0-9%+._-])+[@]+([%+a-z0-9A-Z.-]*)\b/igm);

        if (result !== null) {
            count++;
            iimSet("email", result[0].toLowerCase());
            iimPlayCode("SET !EXTRACT {{email}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=emails.txt");
            iimDisplay("Email: " + count);
        }
    }
    iimPlayCode("TAG POS=2 TYPE=SPAN ATTR=TXT:Next\nWAIT SECONDS=2");
}
