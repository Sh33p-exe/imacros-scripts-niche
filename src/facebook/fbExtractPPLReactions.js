/////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts//
///////////////////////////////////////////////////////
//A variable being used as memory to remmeber the next loop session by using new lines between every command.
var jsLF = "\n";
//Loop, error handling variables
var i, retcode, errtext;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
var purl = prompt('Please Enter Post URL:'); //Prompt to user to enter url
var murl = purl.match(/\/([0-9]+)/g).toString().replace(/\//g, ''); //Get URL ID
//Check if ID is exist and doesn't equal null
if (murl !== null) {
    iimPlayCode("URL GOTO=" + "https://m.facebook.com/ufi/reaction/profile/browser/?ft_ent_identifier=" + murl); //Open URL Page

    //Get All People
    while (window.document.getElementsByClassName('h bu').length) {
        //Loop ten times a maximum for everypage
        Loop: for (var i = 1; i <= 10; i++) {
            var macro = "CODE:";
            macro += "SET !TIMEOUT_STEP 1" + jsLF; //Wait 1 Second if the element isn't exist
            macro += "TAG POS={{loop}} TYPE=H3 ATTR=CLASS:bl EXTRACT=TXT" + jsLF; //Extract Name
            macro += "TAG POS={{loop}} TYPE=H3 ATTR=CLASS:bl EXTRACT=HTM" + jsLF; //Extract Source code for the current person
            iimSet("loop", i);
            retcode = iimPlay(macro);
            if (retcode < 0) {
                break Loop;
            } else {
                var gname = iimGetLastExtract(1); //match name
                var xhtm = iimGetLastExtract(2); //get source
            }
            iimDisplay("Profile: " + i); //Display Current Profile
            if (gname !== "#EANF#") {
                //Match facebook id
                var gurl = "https://facebook.com" + xhtm.match(/href="(.*?)"/g).toString().replace(/href=|\"/gi, '');
                //Save all people
                iimSet("name", gname);
                iimSet("link", gurl);
                iimPlayCode("SET !DATASOURCE_DELIMITER ;\nSET !ERRORIGNORE YES\nSET !EXTRACT {{name}}\nADD !EXTRACT {{link}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=fbpostppl.csv");
            } else {
                break Loop;
            }
        }
        //Load More People
        iimPlayCode("TAG POS=1 TYPE=SPAN ATTR=TXT:Load<SP>More");
    }
} else {
    //Error Alert
    alert("Please enter a valid url.");
}