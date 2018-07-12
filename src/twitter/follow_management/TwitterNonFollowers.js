var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////

if (window.document.URL.indexOf("/following" >= 0)) {
    iimPlayCode("EVENTS TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHARS=- MODIFIERS=CTRL");
    while (true) {
        var profile = window.document.querySelectorAll('.ProfileCard-screenname');

        if (count < profile.length) {
            var profile = window.document.querySelectorAll('.ProfileCard-screenname');
            var stat = window.document.querySelectorAll('.ProfileCard-screenname')[count].innerHTML;
            if (stat.indexOf('FollowStatus') === -1) {
                window.document.querySelectorAll('.EdgeButton.EdgeButton--danger.EdgeButton--small.button-text.unfollow-text')[eval(count + 3)].click();
                window.document.querySelectorAll('.EdgeButton.EdgeButton--danger.EdgeButton--small.button-text.unfollow-text')[eval(count + 3)].scrollIntoView();
            }
            iimPlayCode("WAIT SECONDS=0.30");
            if (isEven(count))
                iimPlayCode("EVENT TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" KEY=35");
            iimDisplay("user: " + count);
            count++;
        }
        window.scrollBy(0, 90);
    }
} else {
    alert("Please open followers page.");
}
///////////////////////////////////////////////////////////////////////////////////////
function isEven(n) {
    return n % 2 === 0;
}
