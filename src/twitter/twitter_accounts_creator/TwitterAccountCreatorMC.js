////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface
////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description This function will activate built-in iMacros Debug for every single step with more advanced algorithm to track changes
 * Also it adds a support for iMacros Developer Tools, which makes the script debug easy with a little knowledge in HTML Basics and Developer Tools.
 */
function onDebug() {
    if (EASY_DEBUG_MODE) {
        window.console.log(`%ciMacros DEBUG MODE IS ACTIVATED`, 'background: red; color: white');
        let first_time = 0;
        if (!first_time) {
            iimPlayCode("SET !USERAGENT " + USER_AGENT_STRING + "\n");
            first_time = 1;
        }
        activate_debugg = "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES";
        return activate_debugg;

    }
}
//Use true/false/1/0 only
var temp_mail_mohmal = true;
///////////////////////////////////////////////////////
var jsLF = "\n";
var i, retcode, errtext, addimg, addbio, addco, min, max, count = 0,
good = 0,
bad = 0,
unconf = 0;
var iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var myimg = imfolder + "Downloads\\";
// var myproxy = imfolder + "Datasources" + "\\proxylist.txt";
///////////////////////////////////////////////////////

const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");

function getFileLines(file_path) {
    const CRLF = "\r\n";
    const LF = "\n";
    var lines = [];
    var file_i = imns.FIO.openNode(file_path);
    var text = imns.FIO.readTextFile(file_i);
    var eol = (text.indexOf(CRLF) == -1) ? LF : CRLF;
    lines = text.split(eol);
    eol = lines.length;
    return eol;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}


function password(num) {
    return Math.random().toString().slice(2, num);
}

function saveAs(user, pass, email, status) {
    iimSet("usr", user);
    iimSet("pass", pass);
    iimSet("email", email);
    iimSet("stat", status);
    iimPlayCode("SET !DATASOURCE_DELIMITER :\nSET !EXTRACT {{usr}}\nADD !EXTRACT {{pass}}\nADD !EXTRACT {{email}}\nADD !EXTRACT {{stat}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=TwitterAccounts.csv");
}

let mynames = ["Awaad", "Abdallah", "Adam", "Ahmad", "Adham", "Acef", "Ashraf", "Harsh", "Aktham", "Akram", "Amjad", "Prince", "Anwar", "Aws", "Awab", "Aimen", "Anas", "Osama", "Islam", "Ikram", "Elhamy", "Eyad", "Eyas", "Faith", "Ehab", "Bashir", "Enmity", "Hassan", "Hussein", "Mansour", "Mu'taz Bellah", "Newborn", "Basil", "Basem", "Wow", "Badir", "Bahaa", "Batal", "Badr", "Badran", "Badr", "pond", "Bassam", "Bashar", "Bakr", "Bashir", "Belal", "Tamim", "Tim", "pious", "Turki", "Thamer", "Jaber", "Earnest", "Jasser", "Jassem", "Jabr", "Gabriel", "Jassar", "Jafar", "Jalal", "great", "Beauty", "Friday", "Jihad", "Hamza", "Hammad", "Hamoud", "Hudhayfah", "Husam", "Hosny", "Hussain", "Hikmet", "Haider", "Khalfan", "Khlefan", "Khalil", "Khuzam", "Dali", "Danny", "Drgham", "Darwish", "Duraid", "Raafat", "Raouf", "Pioneer", "Raef", "Rajeh", "Raji", "Rashed", "Satisfied", "willing", "Rakan", "Ramez", "Rami", "Rashad", "Rushd", "Rushdie", "Rashid", "Ramzi", "Riad", "Chubby", "Zaher", "Zahi", "Zayed", "Zubair", "Zuhair", "Zeyad", "Xian", "Zaid", "Zain", "I will see", "Salem", "Sameh", "Samer", "Sami", "Saher", "nebula", "Saad", "Saud", "Happy", "Sufian", "Sultan", "Salman", "Sulaiman", "Samih", "Samir", "Shady", "Shaker", "Shaheen", "Shaya", "Shaddad", "Sherif", "Shafiq", "Sabir", "Safwat", "Salah", "Dahi", "Dia", "Tareq", "Tayel", "Talal", "Talaat", "Taha", "Zafer", "Abed", "Adel", "Arif", "Amer", "obaida", "Othman", "Adnan", "Arafat", "Almighty", "Azzam", "Izzat", "Azmi", "Aziz", "Essam", "Alaa", "Top", "Emad", "Ammar", "Omar", "Amr", "Amir", "Awni", "Ayyash", "Oday", "Ghaly", "Ghanem", "a stranger", "Ghassan", "Ghoneim", "Ghaith", "Fouad", "Fadi", "Knight", "Farouk", "Faiz", "Fathi", "Pride", "Fida", "Firas", "Unique", "Fazza", "Fahd", "Fahmy", "Fawaz", "Fawzi", "Fayyad", "Faisal", "Qaboos", "Qusay", "Karem", "Kazem", "Canaan", "Loai", "Labib", "Laith", "safe", "Abida", "Adiba", "Afaf", "Afifa", "Ahlem", "Aïcha", "Aïda", "Alia", "Amana", "Amel", "Amina", "Amira", "Anissa", "Asmaa", "Assia", "Atika", "Aya", "Aziza", "Badra", "Basma", "Chadia", "Chafia", "Chafika", "Chahra", "Chahrazad", "Chakira", "Dalila", "Djamila", "Douha", "Dounia", "Emna", "Fadila", "Faiza", "Farida", "Faten", "Fatiha", "Fatima", "Fouzia", "Ghalia", "Ghania", "Habiba", "Hadia", "Hafida", "Hafsa", "Hakima", "Hauled", "Halima", "Hamida", "Hanane", "Hania", "Hanna", "Hayet", "Hawa", "Ibtissem", "Ikram", "Ilhem", "Imane", "Ines", "Karima", "Kawtar", "Kenza", "Khadidja", "Khalida", "Latifa", "Leila", "Mabrouka", "Maha", "Mahbouba", "Maissa", "Majda", "Malika", "Manel", "Meriem", "Moufida", "Mouna", "Mounira", "Nabila", "Nacira", "Nadia", "Nadjiba", "Nafissa", "Naïma", "Najet", "Nawel", "Naziha", "Nedjma", "Nour", "Rachida", "Rahma", "Rajah", "Rawda", "Safia", "Saïda", "Sakina", "Saliha", "Salima", "Saloua", "Samia", "Samira", "Sanaa", "Selma", "Sihème", "Soraya", "Souad", "Wafa", "Wahiba", "Warda", "Wasilla", "Wided", "Yamina", "Yasmine", "Yousra", "Zineb", "Zohra", "Adam", "Adel", "Adib", "Adil", "Ahmed", "Aissa", "Ali", "Amine", "Amir", "Anas", "Anise", "Anouar", "Ayoub", "Azziz", "Bachir", "Badr", "Baligh", "Billal", "Bouzid", "Chafik", "Chahid", "Chaker", "Chams", "Chawki", "Chokri", "Daoud", "Djamel", "Djillali", "Fadel", "Fahim", "Fares", "Farid", "Fathi", "Faudel", "Faouzi", "Fayçal", "Ferhat", "Fouad", "Gibril", "Ghani", "Habib", "Hafid", "Hakim", "Halim", "Hamid", "Hani", "Hichem", "Hilal", "Hosni", "Ismail", "Imed", "Jabar", "Kader", "Kamel", "Karim", "Khaled", "Khalil", "Larbi", "Lotfi", "Mabrouk", "Mahboub", "Mahfoud", "Mahmoud", "Malik", "Marwan", "Mehdi", "Mohamed", "Moktar", "Moncef", "Mourad", "Nabil", "Nacer", "Nadir", "Nadjib", "Nassim", "Nazim", "Nouh", "Omar", "Othmane", "Usama", "Rabah", "Mohamed", "Rachid", "Rafik", "Rahal", "Ramzi", "Raouf", "Rayan", "Réda", "Redouane", "Riad", "Rochdi", "Sabri", "Salah", "Salim", "Sami", "Sedik", "Sofiane", "Tahar", "Taimim", "Tarek", "Tayeb", "Tawfik", "Wallid", "Wassim", "Yacoub", "Yazid", "Youcef", "Younes", "Zahid", "Zaïm", "Zakaria", "Zaki", "Ziad", "Zoheir", "Khalifa", "Reda", "Mazen", "Salah", "Samy", "Rami", "Hossam", "Diab", "Kamel", "Hatem", "Hakem", "Basha", "Zedan", "Nader", "Mina", "Ashor", "Amr", "Abdallah", "Abdulhakem", "Abdulhamed", "Abida", "Adiba", "Afaf", "Afifa", "Ahlem", "Aïcha", "Aïda", "Alia", "Amana", "Amel", "Amina", "Amira", "Anissa", "Asma", "Assia", "Atika", "Aya", "Aziza", "Badra", "Basma", "Chadia", "Chafia", "Chafika", "Chahra", "Chahrazad", "Chakira", "Dalila", "Djamila", "Douha", "Dounia", "Emna", "Fadila", "Faiza", "Farida", "Faten", "Fatiha", "Fatima", "Fouzia", "Ghalia", "Ghania", "Habiba", "Hadia", "Hafida", "Hafsa", "Hakima", "Hauled", "Halima", "Hamida", "Hanane", "Hania", "Hanna", "Hayet", "Hawa", "Ibtissem", "Ikram", "Ilhem", "Imane", "Ines", "Karima", "Kawtar", "Kenza", "Khadidja", "Khalida", "Latifa", "Leila", "Mabrouka", "Maha", "Mahbouba", "Maissa", "Majda", "Malika", "Manel", "Meriem", "Moufida", "Mouna", "Mounira", "Nabila", "Nacira", "Nadia", "Nadjiba", "Nafissa", "Naïma", "Najet", "Nawel", "Naziha", "Nedjma", "Nour", "Rachida", "Rahma", "Rajah", "Rawda", "Safia", "Saïda", "Sakina", "Saliha", "Salima", "Saloua", "Samia", "Samira", "Sanaa", "Selma", "Sihème", "Soraya", "Souad", "Wafa", "Wahiba", "Warda", "Wasilla", "Wided", "Yamina", "Yasmine", "Yousra", "Zineb", "Zohra", "Adam", "Adel", "Adib", "Adil", "Ahmed", "Aissa", "Ali", "Amine", "Amir", "Anas", "Anise", "Anouar", "Ayoub", "Azziz", "Bachir", "Badr", "Baligh", "Billal", "Bouzid", "Chafik", "Chahid", "Chaker", "Chams", "Chawki", "Chokri", "Daoud", "Djamel", "Djillali", "Fadel", "Fahim", "Fares", "Farid", "Fathi", "Faudel", "Faouzi", "Fayçal", "Ferhat", "Fouad", "Gibril", "Ghani", "Habib", "Hafid", "Hakim", "Halim", "Hamid", "Hani", "Hichem", "Hilal", "Hosni", "Ismail", "Imed", "Jabar", "Kaddour", "Kader", "Kamel", "Karim", "Khaled", "Khalil", "Larbi", "Lotfi", "Mabrouk", "Mahboub", "Mahfoud", "Mahmoud", "Malik", "Marwan", "Mehdi", "Mohamed", "Moktar", "Moncef", "Mourad", "Nabil", "Nacer", "Nadir", "Nadjib", "Nassim", "Nazim", "Nouh", "Omar", "Othmane", "Usama", "Rabah", "Rachid", "Rafik", "Rahal", "Ramzi", "Raouf", "Rayan", "Réda", "Redouane", "Riad", "Rochdi", "Sabri", "Salah", "Salim", "Sami", "Sedik", "Sofiane", "Tahar", "Taimim", "Tarek", "Tayeb", "Tawfik", "Wallid", "Wassim", "Yacoub", "Yazid", "Youcef", "Younes", "Zahid", "Zaïm", "Zakaria", "Zaki", "Ziad", "Zoheir", "AbdulRahman", "Zohdy", "Gamal", "Mobarak", "Samy", "Zain", "Malek", "Saeed", "Mohaab", "Mido"];
let language = "en";

let ainput = "CODE:" + onDebug();
ainput += "SET !ERRORIGNORE YES" + jsLF;
ainput += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/signup/submit ATTR=ID:oauth_signup_client_fullname CONTENT={{fullname}}" + jsLF;
ainput += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/signup/submit ATTR=ID:oauth_signup_client_phone_number CONTENT={{email}}" + jsLF;
ainput += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/signup/submit ATTR=NAME:commit" + jsLF;
ainput += "WAIT SECONDS=1" + jsLF;

let binput = "CODE:" + onDebug();
binput += "SET !ERRORIGNORE YES" + jsLF;
binput += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/signup/create_password ATTR=ID:password CONTENT={{password}}" + jsLF;
binput += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/signup/create_password ATTR=NAME:commit" + jsLF;
binput += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/signup/add_phone/skip ATTR=NAME:commit" + jsLF;
binput += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/signup/screen_name ATTR=ID:custom_name EXTRACT=TXT" + jsLF;

let tempmail = "CODE:" + onDebug(),
    confirm = "CODE:" + onDebug();
if (temp_mail_mohmal) {
    tempmail += "SET !ERRORIGNORE YES" + jsLF;
    tempmail += "URL GOTO=https://www.mohmal.com/ar/view" + jsLF;
    tempmail += "TAG POS=1 TYPE=A ATTR=ID:rand&&HREF:/ar/create/random&&CLASS:btn<SP>btn-primary&&REL:nofollow" + jsLF;
    tempmail += "TAG POS=1 TYPE=DIV ATTR=DATA-CLIPBOARD-TARGET:#email<SP>.email&&CLASS:email&&DATA-EMAIL:* EXTRACT=TXT" + jsLF;
    confirm += "SET !ERRORIGNORE YES" + jsLF;
    confirm += "URL GOTO=https://www.mohmal.com/ar/view" + jsLF;
    confirm += "SET !ERRORIGNORE NO" + jsLF;
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:#" + jsLF;
    confirm += "FRAME F=1" + jsLF;
    confirm += "TAG POS=1 TYPE=A ATTR=TARGET:_blank&&HREF:https://twitter.com/i/*" + jsLF;
    confirm += "SET !ERRORIGNORE YES" + jsLF;
    confirm += "SET !TIMEOUT_PAGE 4" + jsLF;
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/i/redirect?url=*" + jsLF;
    confirm += "TAB CLOSEALLOTHERS" + jsLF;
} else {
    tempmail += "SET !ERRORIGNORE YES" + jsLF;
    tempmail += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
    tempmail += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/ar/mail ATTR=NAME:random" + jsLF;
    tempmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;
    confirm += "SET !ERRORIGNORE YES" + jsLF;
    confirm += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
    confirm += "WAIT SECONDS=10" + jsLF;
    confirm += "REFRESH" + jsLF;
    confirm += "SET !ERRORIGNORE NO" + jsLF;
    confirm += "TAG POS=4 TYPE=TD ATTR=*" + jsLF;
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:/ar/msg/*" + jsLF;
    confirm += "FRAME F=1" + jsLF;
    confirm += "SET !ERRORIGNORE YES" + jsLF;
    confirm += "SET !TIMEOUT_PAGE 4" + jsLF;
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/i/redirect?url=*" + jsLF;
    confirm += "TAB CLOSEALLOTHERS" + jsLF;
}


let repmail = "CODE:" + onDebug();
repmail += "SET !ERRORIGNORE YES" + jsLF;
repmail += "TAG POS=1 TYPE=A ATTR=TXT:mode_edit<SP>*" + jsLF;
repmail += "WAIT SECONDS=5" + jsLF;
repmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;

let profile = "CODE:" + onDebug();
profile += "SET !ERRORIGNORE YES" + jsLF;
profile += "URL GOTO=https://twitter.com/settings/profile" + jsLF;
profile += "WAIT SECONDS=3" + jsLF;
profile += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Add<SP>a<SP>profile<SP>photo<SP>Change<SP>your<SP>profile*" + jsLF;
profile += "TAG POS=1 TYPE=INPUT:FILE ATTR=NAME:media[] CONTENT=" + myimg + "profile.jpg" + jsLF;
profile += "EVENT TYPE=CLICK SELECTOR=\"#profile_image_upload_dialog-dialog>DIV:nth-of-type(2)>DIV:nth-of-type(3)>BUTTON:nth-of-type(4)\" BUTTON=0" + jsLF;
profile += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Save<SP>changes" + jsLF;
profile += "WAIT SECONDS=3" + jsLF;

let photo = "CODE:" + onDebug();
photo += "SET !ERRORIGNORE YES" + jsLF;
photo += "FILTER TYPE=IMAGES STATUS=ON" + jsLF;
photo += "URL GOTO=https://suar.me/8loEy" + jsLF;
photo += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF;
photo += "TAG POS=1 TYPE=I ATTR=CLASS:fa<SP>fa-fw<SP>fa-random" + jsLF;
photo += "SET !REPLAYSPEED SLOW" + jsLF;
photo += "ONDOWNLOAD FOLDER=" + myimg + " FILE=profile.jpg WAIT=YES" + jsLF;
photo += "TAG POS=2 TYPE=IMG ATTR=ALT:* CONTENT=EVENT:SAVEPICTUREAS" + jsLF;
///////////////////////////////////////////////////
let uploadpic = window.confirm("Do you want to upload a picture?");
try {
    main: while (true) {
        iimPlayCode('SET !USERAGENT "Mozilla/5.0 (iPhone; CPU iPhone OS 8_0_2 like Mac OS X) AppleWebKit/600.1.4 (KHTML, like Gecko) Version/8.0 Mobile/12A366 Safari/600.1.4"');
        count++;
        iimDisplay("Current: " + count + "\n" + "Created Accounts: " + good + "\n" + "Failed attempts: " + bad + "\n" + "Unconfirmed: " + unconf);
        //Create a fullname
        let firstname = mynames[Math.floor(Math.random() * mynames.length)];
        let lastname = mynames[Math.floor(Math.random() * mynames.length)];
        let name = firstname + " " + lastname;
        //Create a password
        let pass = password(9);
        iimPlayCode("CLEAR\nTAB CLOSEALLOTHERS");
        //Create an email
        iimPlay(tempmail);
        let email = iimGetLastExtract();
        if (email.indexOf("bareed.ws") >= 0) {
            iimPlay(repmail);
            email = iimGetLastExtract();
        }
        //Start
        iimPlayCode("URL GOTO=https://mobile.twitter.com/signup?type=email");
        if (window.location.href !== "https://twitter.com/account/access") {
            iimSet("fullname", name);
            iimSet("email", email);
            iimPlay(ainput);
            if (window.location.href === "https://mobile.twitter.com/signup/create_password") {
                iimSet("password", pass);
                iimPlay(binput);
                let user = iimGetLastExtract();
                //Confirm your account
                retcode = iimPlay(confirm);
                if (retcode < 0) {
                    status = "Unconfirmed";
                    unconf++;
                } else
                    status = "Confirmed";
                //Save account info
                saveAs(user, pass, email, status);
                if (uploadpic) {
                    //Download photo
                    iimPlay(photo);
                    //Update profile          
                    iimPlay(profile);
                }
            } else if (window.location.href === "https://twitter.com/account/access") {
                bad++;
                iimDisplay("Your IP is banned, please change it. will try again after 2 minutes.");
                iimPlayCode("WAIT SECONDS=120");
            } else {
                bad++;
                iimDisplay("Error! Twitter Didn't allow this. we will try again after 2 minutes.");
                iimPlayCode("WAIT SECONDS=120");
                // break main;
            }
        } else {
            alert("Error! Please Contact with the developer!");
            break;
        }
    }
}
catch (err) {
    iimDisplay("Error: \n" + err + "\nPlease contact with script developer!");
}