var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
// try {
if (window.location.href.indexOf('MarketListingPlace') >= 0) {
    var title = window.document.querySelectorAll('input')[3].value;
    var shortdes = window.document.querySelectorAll('textarea')[0].value;
    var fulldes = window.document.querySelectorAll('textarea')[1].value;

    try {
        var macro = "CODE:";
        macro += "SET !ERRORIGNORE YES" + jsLF;
        macro += "SET !TIMEOUT_STEP 1" + jsLF;
        macro += "TAG POS=1 TYPE=SPAN ATTR=TXT:Add<SP>your<SP>own<SP>translation<SP>text" + jsLF;
        macro += "TAG POS=1 TYPE=HEADER ATTR=TXT:Add<SP>your<SP>own<SP>translations<SP>In<SP>Google<SP>Play,*" + jsLF;
        macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV:nth-of-type(23)>DIV>DIV>DIV:nth-of-type(2)>DIV>DIV>HEADER>DIV>BUTTON\" BUTTON=0" + jsLF;
        macro += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV:nth-of-type(23)>DIV>DIV>DIV:nth-of-type(2)>DIV>DIV>FOOTER>BUTTON\" BUTTON=0" + jsLF;
        iimPlay(macro);
        iimPlayCode("WAIT SECONDS=0.90");
    } catch (error) {
        iimDisplay("What an error!");
    }

    for (var index = 2; index <= 78; index++) {
        iimPlayCode('SET !ERRORIGNORE YES\nTAG POS=' + index + ' TYPE=A ATTR=CLASS:gwt-Anchor&&HREF:javascript:&&ROLE:option');
        window.document.querySelectorAll('input')[3].value = title;
        window.document.querySelectorAll('textarea')[0].value = shortdes;
        window.document.querySelectorAll('textarea')[1].value = fulldes;
        iimPlayCode('WAIT SECONDS=0.1');
        iimDisplay("Language: " + index);
    }
    iimPlayCode('SET !ERRORIGNORE YES\nTAG POS=1 TYPE=A ATTR=CLASS:gwt-Anchor&&HREF:javascript:&&ROLE:option');
} else {
    alert("Please Open App Page!");
}
