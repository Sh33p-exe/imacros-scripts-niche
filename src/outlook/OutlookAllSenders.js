var jsLF = "\n";
var i, retcode, errtext;
var Senders = [],
    Sender;
var count = 0;
var mails = 0;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
// iimPlayCode("URL GOTO=https://outlook.live.com/owa/\nTAG POS=1 TYPE=SPAN ATTR=AUTOID:_lvv_5&&CLASS:lvHighlightAllClass<SP>lvHighlightFromClass\nWAIT SECONDS=10");
var mail = window.document.querySelectorAll('.lvHighlightAllClass.lvHighlightFromClass');

while (true) {
    if (Number(window.document.querySelector('div.ms-bg-color-themeLight:nth-child(4) > span:nth-child(1)').textContent) > count) {
        try {
            for (var index = 1; index <= mail.length; index++) {
                count++;
                window.document.querySelectorAll('.lvHighlightAllClass.lvHighlightFromClass')[index - 1].scrollIntoView();
                iimDisplay(eval(mail.length + count) + "/" + index);
                mail = window.document.querySelectorAll('.lvHighlightAllClass.lvHighlightFromClass');
                //Select Message
                iimPlayCode("SET !TIMEOUT_STEP 30\nTAG POS=" + index + " TYPE=SPAN ATTR=AUTOID:*&&CLASS:lvHighlightAllClass<SP>lvHighlightFromClass");
                try {
                    window.document.querySelector('._rp_t1').click();
                } catch (error) {
                    window.setTimeout(function () {
                        window.document.querySelector('._rp_t1').click();
                    }, 6000);
                }
                iimPlayCode("SET !TIMEOUT_STEP 15\nTAG POS=1 TYPE=BUTTON ATTR=TXT:View<SP>message<SP>source\nWAIT SECONDS=3");

                try {
                    Sender = window.document.querySelectorAll('textarea')[0].value.match(/Sender(.*?)[a-zA-Z0-9]+(?:(\.|_)[A-Za-z0-9!#$%&'*+/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>/g)[0];
                } catch (error) {
                    try {
                        Sender = window.document.querySelectorAll('textarea')[1].value.match(/Sender(.*?)[a-zA-Z0-9]+(?:(\.|_)[A-Za-z0-9!#$%&'*+/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?>/g)[0];
                    } catch (error) {
                        Sender = "";
                    }
                }
                try {
                    iimSet("email", Sender.match(/[a-zA-Z0-9]+(?:(\.|_)[A-Za-z0-9!#$%&'*+/=?^`{|}~-]+)*@(?!([a-zA-Z0-9]*\.[a-zA-Z0-9]*\.[a-zA-Z0-9]*\.))(?:[A-Za-z0-9](?:[a-zA-Z0-9-]*[A-Za-z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/g).toString().toLowerCase());
                    iimPlayCode("SET !EXTRACT {{email}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=Senders.txt");
                } catch (error) {
                    //nothing
                }
            }
        } catch (error) {
            iimDisplay(count + " Emails has been Extracted.");
        }
    } else {
        alert("FINISHED!");
    }

}
