var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
var current = 1;
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
var numbers = +prompt('How many videos do you want to upload ?');

for (var index = 1; index <= numbers; index++) {
    var macro = "CODE:";
    macro += "SET !ERRORIGNORE YES" + jsLF;
    macro += "SET !DATASOURCE videopath.txt" + jsLF;
    macro += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
    macro += "URL GOTO=https://www.youtube.com/upload" + jsLF;
    macro += "WAIT SECONDS=1" + jsLF;
    // macro += "TAG POS=1 TYPE=BUTTON ATTR=ID:upload-privacy-selector" + jsLF;
    macro += "TAG POS=1 TYPE=INPUT:FILE ATTR=* CONTENT={{!COL1}}" + jsLF;
    macro += "WAIT SECONDS=3" + jsLF;
    macro += "TAG POS=1 TYPE=SELECT FORM=NAME:mdeform ATTR=CLASS:yt-uix-form-input-select-element<SP>metadata-privacy-input&&NAME:privacy&&DATA-INITIAL-VALUE:public CONTENT=%scheduled" + jsLF;
    macro += "TAG POS=1 TYPE=SELECT FORM=NAME:mdeform ATTR=TXT:0:00<SP>0:30<SP>1:00<SP>1:30<SP>2:00<SP>2:30<SP>3:00<SP>3:30*" + jsLF;
    iimSet("loop", index);
    iimPlay(macro);

    var timeformat = window.document.querySelector('.publish-time-formatted').value;
    var xtime = Number(timeformat) + 30 * 4;
    var dtime = xtime * current;

    iimSet("time", dtime);
    iimPlayCode("TAG POS=1 TYPE=SELECT FORM=NAME:mdeform ATTR=TXT:0:00<SP>0:30<SP>1:00<SP>1:30<SP>2:00<SP>2:30<SP>3:00<SP>3:30* CONTENT=%{{time}}");
    current++;

    iimPlayCode("SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 999\nTAG POS=1 TYPE=SPAN ATTR=TXT:procces<SP>done<SP>*‎%‎");
    iimPlayCode("SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 999\nTAG POS=1 TYPE=BUTTON ATTR=TXT:*<SP>*<SP>*<SP>*<SP>*<SP>201*");
    iimPlayCode("SET !ERRORIGNORE YES\nSET !TIMEOUT_STEP 999\nTAG POS=1 TYPE=DIV ATTR=TXT:loading<SP>finished.");
}