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
var txtfile = "browseurls.txt";
var urls = getFileLines(datapath + txtfile);
///////////////////////////////////////////////////
var min = +prompt("Interval in seconds:");
if (min) {
    for (i = 1; i < getFileLines(datapath + txtfile); i++) {
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

        iimDisplay("Interval: " + min + "\nUrl: " + i);
        iimPlayCode("SET !ERRORIGNORE YES\nWAIT SECONDS=" + min);
    }
    alert('Finished!');
}