///////////////////////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
///////////////////////////////////////////////////////////////////////////
//A variable being used as memory to remember the next loop session by using new lines between every command.
const jsLF = "\n";
//Loop, error handling variables
var i, retcode, errtext;
var add_img, img_path, total_accounts;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
// const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
// .getService(Components.interfaces.nsIWindowMediator);
// const window = windowMediator.getMostRecentWindow("navigator:browser");
///////////////////////////////////////////////////////////////////////////
//A method to access iMacros interface
const iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
///////////////////////////////////////////////////////////////////////////
//Variables for local files supports windows/linux/mac os
const filename = iMacros._currentMacro.name; //Get Script Name
const data_path = (iMacros._currentMacro.path).match(/.(.*?).Macros./g) + '\\Datasources\\'; //Datasources Folder
const accounts_csv = "TwitterAccounts.csv"; //Accounts Datasources
///////////////////////////////////////////////////////////////////////////
//CSS Basic Template
const _cssdash = 'font-family: Tahoma,sans-serif;line-height: 18px;font-size: 16px;color: #8899a6;width: 600px;margin: 5em auto;padding: 50px;background-color: #fff;border-radius: 1em;';
const _cssinput = 'display: inline-block;padding: 4px;margin: 0;outline: 0;background-color: #fff;border: 1px solid #e1e8ed;border-radius: 3px;';
const _cssbutton = 'font-size: 14px;font-weight: bold;color: white;padding: 9px 18px;border: 1px solid #3b94d9;border-radius: 3px;background-color: #50a5e6;outline: 0;display: inline-block;';
//Language
const language = "en";
//Some Arabic Names
const arabic_names = ["عبد الله", "آدم", "آسر", "أجود", "أحمد", "أدهم", "أديب", "أسعد", "أسمر", "أسِيف", "أشرف", "أشهب", "أصيل", "أكثم", "أكرم", "أمجد", "أمير", "أمين", "أنور", "أوس", "أوّاب", "أيمن", "أَنَس", "أُسامة", "إسلام", "إقبال", "إكرام", "إلهامي", "إمام", "إياد", "إياس", "إيثار", "إيمان", "إيهاب", "البشير", "البَراء", "الحَسن", "الحُسَين", "المَنصور", "المُعتز بالله", "الوَليد", "باسل", "باسِم", "باهر", "بدير", "بهاء", "بَتّال", "بَدر", "بَدران", "بَدّار", "بَركة", "بَسّام", "بَشّار", "بَكر", "بِجاد", "بِشر", "بِشير", "بِلال", "تامر", "تميم", "توفيق", "تيّم", "تَقىّ", "تُركي", "ثابت", "ثاقب", "ثامر", "جابر", "جاد", "جاسر", "جاسم", "جبر", "جبريل", "جسّار", "جعفر", "جلال", "جليل", "جمال", "جمعة", "جهاد", "حَمزة", "حَمّاد", "حَمّود", "حُذيفة", "حُسام", "حُسني", "حِسين", "حِكمت", "حِيدر", "خاطر", "خالد", "خلف", "خلفان", "خليفان", "خليفة", "خليل", "خميس", "خَطّاب", "خُزام", "دائب", "داري", "داغر", "دالي", "داني", "در", "درغام", "درويش", "دريد", "رأفت", "رؤوف", "رائد", "رائف", "راجح", "راجي", "راشد", "راضي", "راغب", "رافع", "راكان", "رامز", "رامي", "رشاد", "رشد", "رشدي", "رشيد", "رضا", "رفيف", "رفيق", "رمزي", "رياض", "ريان", "زاهر", "زاهي", "زايد", "زبير", "زهير", "زياد", "زيان", "زيد", "زين", "ساري", "سالم", "سامح", "سامر", "سامي", "ساهر", "سديم", "سراج", "سرور", "سعد", "سعود", "سعيد", "سفيان", "سلام", "سلامة", "سلطان", "سلمان", "سليم", "سليمان", "سميح", "سمير", "سيف", "شادي", "شاكر", "شاهين", "شايع", "شداد", "شريف", "شفيق", "شكري", "شهاب", "صابر", "صادق", "صالح", "صباح", "صفوت", "صفي", "صقر", "صلاح", "ضاحي", "ضياء", "طارق", "طاهر", "طايل", "طلال", "طلعت", "طه", "ظافر", "عابد", "عادل", "عارف", "عامر", "عبيدة", "عثمان", "عدنان", "عرفات", "عز", "عزام", "عزت", "عزمي", "عزيز", "عصام", "عطية", "علاء", "علوي", "عماد", "عمار", "عمر", "عمرو", "عمير", "عودة", "عوني", "عياش", "عُدي", "غالي", "غانم", "غريب", "غسان", "غنيم", "غيث", "فؤاد", "فاخر", "فادي", "فارس", "فاروق", "فايز", "فتحي", "فخر", "فداء", "فدائي", "فرات", "فراس", "فريد", "فزاع", "فهد", "فهمي", "فواز", "فوزي", "فياض", "فيصل", "قابوس", "قاسم", "قدري", "قصي", "كارم", "كاظم", "كامل", "كريم", "كمال", "كنعان", "لؤي", "لبيب", "ليث", "مأمون", "مؤمن", "مؤنس", "مؤيد"];
//Some Arab World Locations
const locations = ["مصر", "البحرين", "عمان", "السعودية", "الامارات", "الكويت", "المغرب", "السودان", "الصومال", "الجزائر", "تونس", "عمان", "اليمن", "سوريا", "الاردن", "فلسطين", "العراق", "ليبيا"];
//Open dashboard
whitePage(); //Open Twitter
dashboard(); //Inject macro dashboard
window.document.getElementById('botimg').disabled = true; //Disable upload personal image from the web input
Help("Please fill the forms"); //Advise

/**
 * @param {String} filepath parse file path string
 * @returns total file lines
 */
function getFileLines(file_path) {
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

//Event listener for run button
window.document.querySelectorAll('.run')[0].addEventListener("click", function () {
    ximg = window.document.querySelectorAll(".imgpath")[0].value; //get file path value
    total_accounts = window.document.querySelectorAll(".total_accounts")[0].value; //get total accounts from user input
    img_path = ximg + "\\";
    playBot();
});

///////////////////////////////////////////////////////////////////////////
//Format CSV File Data
let accounts = "CODE:";
accounts += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
accounts += "SET !DATASOURCE_DELIMITER :" + jsLF; //Split csv file using :
accounts += "SET !DATASOURCE {{file}}" + jsLF; //File path
accounts += "SET !DATASOURCE_COLUMNS 2" + jsLF; //How many columns
accounts += "SET !DATASOURCE_LINE {{loop}}" + jsLF; //Loop current account
accounts += "SET !EXTRACT {{!COL1}}" + jsLF; //Username
accounts += "ADD !EXTRACT {{!COL2}}" + jsLF; //Password
// accounts += "ADD !EXTRACT {{!COL3}}" + jsLF; //For email (optional)

let login = "CODE:";
login += "CLEAR" + jsLF; //Clear all cookies
login += "SET !ERRORIGNORE YES" + jsLF; //Ignore Errors
login += "SET !TIMEOUT_STEP 3" + jsLF; //Step timeout in seconds
login += "URL GOTO=https://mobile.twitter.com/login/?username_or_email={{username}}" + jsLF; //go to twitter login page
login += "SET !ENCRYPTION NO" + jsLF; //Don't use encryption with password input
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=ID:session[password] CONTENT={{password}}" + jsLF; //Input password for  attribue id
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{password}}" + jsLF; //Input password for attribute name
login += "FILTER TYPE=IMAGES STATUS=ON" + jsLF; //Remove Images
login += "SET !TIMEOUT_STEP 1" + jsLF; //Step timeout in seconds
//More Than One Method to Login
login += "TAG POS=1 TYPE=BUTTON FORM=ACTION:/sessions ATTR=ID:signupbutton" + jsLF;
login += "TAG POS=1 TYPE=BUTTON FORM=ACTION:/sessions ATTR=TXT:Log<SP>in" + jsLF;
login += "TAG POS=3 TYPE=DIV ATTR=TXT:Log<SP>in" + jsLF;
///////////////////////////////////////////////////////////////////////////
//Start bot function
function playBot() {
    try {
        window.document.querySelectorAll("div")[0].innerHTML = '<center><h2 style="direction:ltr">Loading...</h2></center>'; //Loading page...
        //Start loop for total accounts
        for (let i = 1; i <= total_accounts; i++) {
            let firstname = arabic_names[Math.floor(Math.random() * arabic_names.length)]; //Random first name
            let lastname = arabic_names[Math.floor(Math.random() * arabic_names.length)]; //Random last name

            PicUp(); //Upload Image

            //Start login by account number in loop
            iimSet("loop", i);
            iimSet("file", accounts_csv);
            iimPlay(accounts);
            let user = iimGetLastExtract(1);
            let pass = iimGetLastExtract(2);
            // let email = iimGetLastExtract(3);
            if (retcode < 0)
                break;


            iimSet("username", user);
            iimSet("password", pass);
            // iimSet("email", email);
            retcode = iimPlay(login);
            //Abort if some thing wrong in login
            if (retcode < 0)
                break;

            //Current task
            Help("<li>Prepare profile...</li><br><li>Account: " + i + "</li>");
            //Go to user profile
            iimPlayCode("URL GOTO=https://twitter.com/" + user + "?lang=en&edit=true");
            //Update user profile
            let profile = "CODE:";
            profile += "WAIT SECONDS=1" + jsLF; //1 Seconds later
            profile += "SET !TIMEOUT_STEP 3" + jsLF; //Timeout for every step
            profile += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors in the following steps
            profile += "TAG POS=1 TYPE=INPUT:TEXT ATTR=ID:user_name CONTENT={{fullname}}" + jsLF; //Update full name
            profile += "EVENTS TYPE=KEYPRESS SELECTOR=\"#user_location\" CHARS={{location}}" + jsLF; //Update Location
            profile += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Add<SP>a<SP>profile<SP>photo<SP>Change<SP>your<SP>profile*" + jsLF; //Update other data
            profile += "SET !TIMEOUT_STEP 1" + jsLF;
            profile += "TAG POS=1 TYPE=INPUT:FILE ATTR=NAME:media[] CONTENT=" + img_path + "img.jpg" + jsLF; //Upload Image
            profile += "EVENT TYPE=CLICK SELECTOR=\"#profile_image_upload_dialog-dialog>DIV:nth-of-type(2)>DIV:nth-of-type(3)>BUTTON:nth-of-type(4)\" BUTTON=0" + jsLF; //Save everything
            profile += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Save<SP>changes" + jsLF; //Submit changes
            profile += "WAIT SECONDS=3" + jsLF; //Wait 3 seconds after saving changes
            iimSet("fullname", firstname + " " + lastname);
            iimSet("location", locations[getRandomInt(0, locations.length)]);
            retcode = iimPlay(profile);
            //Abort if any errors.
            if (retcode < 0) {
                break;
            }
        }
        //Return alert if loop finished.
        return alert('Finished!');
    } catch (err) {
        //Client side error for user
        goBack("Error!<br>" + err + "<br>Please contact with the developer");
    }
}
///////////////////////////////////////////////////////////////////////////
function dashboard() {
    //Inject dashboard for webpage
    window.document.body.innerHTML = `<div class=".dash" style="direction:ltr;` + _cssdash + `">
    <h2 style="direction:ltr;color:orange">Twitter Accounts Arabization</h2><br>
        <input type="checkbox" id="botimg" checked><span>Upload personal image from the web</span>
        <hr style="width:80%;border: 0;border-top: 1px solid #eee;height: 0;margin: 14px 0 0;padding: 0;">
        <br>Your Accounts:<br><input class="total_accounts" type="text" value="` + getFileLines(data_path + accounts_csv) + `" style="width:50px;` + _cssinput + `">
        <br>Temp Images Path:<br><input class="imgpath" type="text" value="C:\\img" style="width:250px;` + _cssinput + `">
        <center><button class="run" style="` + _cssbutton + `">Run</button></center>
        </div>`;
}

/**
 * @param {number} min,max 
 * @returns random number between min and max
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function whitePage() {
    iimPlayCode("TAB CLOSEALLOTHERS\nCLEAR\nURL GOTO=https://twitter.com");
}

/**
 * @returns day greetings by hours
 */
function talki() {
    let greeting;
    let time = new Date().getHours();
    if (time < 10)
        greeting = "Good morning"; //if current time less than 10 hours
    else if (time < 20)
        greeting = "Nice day!"; //else if time less than 20 hours 
    else
        greeting = "Good evening"; //else say good evening

    return greeting;
}

/**
 * @returns false if the upload has any errors
 */
function PicUp() {
    let photo = "CODE:";
    photo += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    photo += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF; //Upload Images
    photo += "URL GOTO=https://picsum.photos/" + getRandomInt(600, 800) + "/500" + jsLF; //Random Image
    photo += "SET !REPLAYSPEED MEDIUM" + jsLF; //Macro speed
    photo += "ONDOWNLOAD FOLDER=" + img_path + " FILE=img.jpg WAIT=YES" + jsLF; //Download Image
    photo += "TAG POS=1 TYPE=IMG ATTR=ALT:* CONTENT=EVENT:SAVEPICTUREAS" + jsLF; //Confirm Saveas
    retcode = iimPlay(photo);
    if (retcode < 0)
        return false;
}

/**
 * @param {String} message parse message string
 * @returns DOM right side bar
 */
function Help(message) {
    return window.document.body.innerHTML += '<div class="iRightSideBar" style="font-family:Segoe UI,Tahoma,Arial,sans-serif;border-radius: 1em;text-align:right;font-size:16px;;direction: ltr; position: fixed; top: 0px; right: 0; margin: 1ex; padding: 1em; background: orange; width: 15%; hieght: 100px; z-index: 6666; opacity: 0.9;"> <p style="font-size:14px;">' + talki() + '</p> <ul style="margin:0ex;">' + message + '</ul></div>';
}

/**
 * @param {String} message parse message string
 * @returns run whitePage() function then return message for the user
 */
function goBack(message) {
    whitePage();
    return window.document.body.innerHTML = '<div style="' + _cssdash + '"><center><h2 style="direction:ltr;font-size: 98%;">' + message + '</h2><button class="run" style="' + _cssbutton + '">Go</button></center></div>';
}