//Use true/false/1/0 only
var temp_mail_mohmal = true; //use temp mail mohmal if false will use moakt.com
banned_emails = ["bareed.ws"]; //an array for banned emails to avoid
///////////////////////////////////////////////////////
//A variable being used as memory to remember the next loop session by using new lines between every command for iMacros.
var jsLF = "\n";
//Loop, error handling variables as well as images and intervals and random values.
var i, retcode, errtext, min, max, count = 0,
    good = 0,
    bad = 0,
    unconf = 0;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
//A method to access iMacros interface
let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
let filename = iMacros._currentMacro.name; //Get Script Name
let imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
let folder_mydata = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\'); //Get Datasources Folder Path
let myimg = imfolder + "Downloads\\";

/**
 * @returns false if the upload has any errors
 */
function PicUp() {
    let photo = "CODE:";
    photo += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    photo += "FILTER TYPE=IMAGES STATUS=OFF" + jsLF; //Upload Images
    photo += "URL GOTO=https://picsum.photos/" + getRandomInt(600, 800) + "/500" + jsLF; //Random Image
    photo += "SET !REPLAYSPEED MEDIUM" + jsLF; //Macro speed
    photo += "ONDOWNLOAD FOLDER=" + img_path + " FILE=profile.jpg WAIT=YES" + jsLF; //Download Image
    photo += "TAG POS=1 TYPE=IMG ATTR=ALT:* CONTENT=EVENT:SAVEPICTUREAS" + jsLF; //Confirm Saveas
    retcode = iimPlay(photo);
    if (retcode < 0)
        return false;
}

/**
 * @returns random number between min and max
 */
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

/**
 * @returns random password with num as limit for length.
 */
function password(num) {
    return Math.random().toString().slice(2, num);
}

/**
 * @returns saves all accounts information.
 */
function saveAs(user, pass, email, status) {
    iimSet("usr", user);
    iimSet("pass", pass);
    iimSet("email", email);
    iimSet("stat", status);
    iimPlayCode("SET !DATASOURCE_DELIMITER :\nSET !EXTRACT {{usr}}\nADD !EXTRACT {{pass}}\nADD !EXTRACT {{email}}\nADD !EXTRACT {{stat}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=TwitterAccounts.csv");
}
///////////////////////////////////////////////////////
//Array of names
let mynames = ["Awaad", "Abdallah", "Adam", "Ahmad", "Adham", "Acef", "Ashraf", "Harsh", "Aktham", "Akram", "Amjad", "Prince", "Anwar", "Aws", "Awab", "Aimen", "Anas", "Osama", "Islam", "Ikram", "Elhamy", "Eyad", "Eyas", "Faith", "Ehab", "Bashir", "Enmity", "Hassan", "Hussein", "Mansour", "Mu'taz Bellah", "Newborn", "Basil", "Basem", "Wow", "Badir", "Bahaa", "Batal", "Badr", "Badran", "Badr", "pond", "Bassam", "Bashar", "Bakr", "Bashir", "Belal", "Tamim", "Tim", "pious", "Turki", "Thamer", "Jaber", "Earnest", "Jasser", "Jassem", "Jabr", "Gabriel", "Jassar", "Jafar", "Jalal", "great", "Beauty", "Friday", "Jihad", "Hamza", "Hammad", "Hamoud", "Hudhayfah", "Husam", "Hosny", "Hussain", "Hikmet", "Haider", "Khalfan", "Khlefan", "Khalil", "Khuzam", "Dali", "Danny", "Drgham", "Darwish", "Duraid", "Raafat", "Raouf", "Pioneer", "Raef", "Rajeh", "Raji", "Rashed", "Satisfied", "willing", "Rakan", "Ramez", "Rami", "Rashad", "Rushd", "Rushdie", "Rashid", "Ramzi", "Riad", "Chubby", "Zaher", "Zahi", "Zayed", "Zubair", "Zuhair", "Zeyad", "Xian", "Zaid", "Zain", "I will see", "Salem", "Sameh", "Samer", "Sami", "Saher", "nebula", "Saad", "Saud", "Happy", "Sufian", "Sultan", "Salman", "Sulaiman", "Samih", "Samir", "Shady", "Shaker", "Shaheen", "Shaya", "Shaddad", "Sherif", "Shafiq", "Sabir", "Safwat", "Salah", "Dahi", "Dia", "Tareq", "Tayel", "Talal", "Talaat", "Taha", "Zafer", "Abed", "Adel", "Arif", "Amer", "obaida", "Othman", "Adnan", "Arafat", "Almighty", "Azzam", "Izzat", "Azmi", "Aziz", "Essam", "Alaa", "Top", "Emad", "Ammar", "Omar", "Amr", "Amir", "Awni", "Ayyash", "Oday", "Ghaly", "Ghanem", "a stranger", "Ghassan", "Ghoneim", "Ghaith", "Fouad", "Fadi", "Knight", "Farouk", "Faiz", "Fathi", "Pride", "Fida", "Firas", "Unique", "Fazza", "Fahd", "Fahmy", "Fawaz", "Fawzi", "Fayyad", "Faisal", "Qaboos", "Qusay", "Karem", "Kazem", "Canaan", "Loai", "Labib", "Laith", "safe", "Abida", "Adiba", "Afaf", "Afifa", "Ahlem", "Aïcha", "Aïda", "Alia", "Amana", "Amel", "Amina", "Amira", "Anissa", "Asmaa", "Assia", "Atika", "Aya", "Aziza", "Badra", "Basma", "Chadia", "Chafia", "Chafika", "Chahra", "Chahrazad", "Chakira", "Dalila", "Djamila", "Douha", "Dounia", "Emna", "Fadila", "Faiza", "Farida", "Faten", "Fatiha", "Fatima", "Fouzia", "Ghalia", "Ghania", "Habiba", "Hadia", "Hafida", "Hafsa", "Hakima", "Hauled", "Halima", "Hamida", "Hanane", "Hania", "Hanna", "Hayet", "Hawa", "Ibtissem", "Ikram", "Ilhem", "Imane", "Ines", "Karima", "Kawtar", "Kenza", "Khadidja", "Khalida", "Latifa", "Leila", "Mabrouka", "Maha", "Mahbouba", "Maissa", "Majda", "Malika", "Manel", "Meriem", "Moufida", "Mouna", "Mounira", "Nabila", "Nacira", "Nadia", "Nadjiba", "Nafissa", "Naïma", "Najet", "Nawel", "Naziha", "Nedjma", "Nour", "Rachida", "Rahma", "Rajah", "Rawda", "Safia", "Saïda", "Sakina", "Saliha", "Salima", "Saloua", "Samia", "Samira", "Sanaa", "Selma", "Sihème", "Soraya", "Souad", "Wafa", "Wahiba", "Warda", "Wasilla", "Wided", "Yamina", "Yasmine", "Yousra", "Zineb", "Zohra", "Adam", "Adel", "Adib", "Adil", "Ahmed", "Aissa", "Ali", "Amine", "Amir", "Anas", "Anise", "Anouar", "Ayoub", "Azziz", "Bachir", "Badr", "Baligh", "Billal", "Bouzid", "Chafik", "Chahid", "Chaker", "Chams", "Chawki", "Chokri", "Daoud", "Djamel", "Djillali", "Fadel", "Fahim", "Fares", "Farid", "Fathi", "Faudel", "Faouzi", "Fayçal", "Ferhat", "Fouad", "Gibril", "Ghani", "Habib", "Hafid", "Hakim", "Halim", "Hamid", "Hani", "Hichem", "Hilal", "Hosni", "Ismail", "Imed", "Jabar", "Kader", "Kamel", "Karim", "Khaled", "Khalil", "Larbi", "Lotfi", "Mabrouk", "Mahboub", "Mahfoud", "Mahmoud", "Malik", "Marwan", "Mehdi", "Mohamed", "Moktar", "Moncef", "Mourad", "Nabil", "Nacer", "Nadir", "Nadjib", "Nassim", "Nazim", "Nouh", "Omar", "Othmane", "Usama", "Rabah", "Mohamed", "Rachid", "Rafik", "Rahal", "Ramzi", "Raouf", "Rayan", "Réda", "Redouane", "Riad", "Rochdi", "Sabri", "Salah", "Salim", "Sami", "Sedik", "Sofiane", "Tahar", "Taimim", "Tarek", "Tayeb", "Tawfik", "Wallid", "Wassim", "Yacoub", "Yazid", "Youcef", "Younes", "Zahid", "Zaïm", "Zakaria", "Zaki", "Ziad", "Zoheir", "Khalifa", "Reda", "Mazen", "Salah", "Samy", "Rami", "Hossam", "Diab", "Kamel", "Hatem", "Hakem", "Basha", "Zedan", "Nader", "Mina", "Ashor", "Amr", "Abdallah", "Abdulhakem", "Abdulhamed", "Abida", "Adiba", "Afaf", "Afifa", "Ahlem", "Aïcha", "Aïda", "Alia", "Amana", "Amel", "Amina", "Amira", "Anissa", "Asma", "Assia", "Atika", "Aya", "Aziza", "Badra", "Basma", "Chadia", "Chafia", "Chafika", "Chahra", "Chahrazad", "Chakira", "Dalila", "Djamila", "Douha", "Dounia", "Emna", "Fadila", "Faiza", "Farida", "Faten", "Fatiha", "Fatima", "Fouzia", "Ghalia", "Ghania", "Habiba", "Hadia", "Hafida", "Hafsa", "Hakima", "Hauled", "Halima", "Hamida", "Hanane", "Hania", "Hanna", "Hayet", "Hawa", "Ibtissem", "Ikram", "Ilhem", "Imane", "Ines", "Karima", "Kawtar", "Kenza", "Khadidja", "Khalida", "Latifa", "Leila", "Mabrouka", "Maha", "Mahbouba", "Maissa", "Majda", "Malika", "Manel", "Meriem", "Moufida", "Mouna", "Mounira", "Nabila", "Nacira", "Nadia", "Nadjiba", "Nafissa", "Naïma", "Najet", "Nawel", "Naziha", "Nedjma", "Nour", "Rachida", "Rahma", "Rajah", "Rawda", "Safia", "Saïda", "Sakina", "Saliha", "Salima", "Saloua", "Samia", "Samira", "Sanaa", "Selma", "Sihème", "Soraya", "Souad", "Wafa", "Wahiba", "Warda", "Wasilla", "Wided", "Yamina", "Yasmine", "Yousra", "Zineb", "Zohra", "Adam", "Adel", "Adib", "Adil", "Ahmed", "Aissa", "Ali", "Amine", "Amir", "Anas", "Anise", "Anouar", "Ayoub", "Azziz", "Bachir", "Badr", "Baligh", "Billal", "Bouzid", "Chafik", "Chahid", "Chaker", "Chams", "Chawki", "Chokri", "Daoud", "Djamel", "Djillali", "Fadel", "Fahim", "Fares", "Farid", "Fathi", "Faudel", "Faouzi", "Fayçal", "Ferhat", "Fouad", "Gibril", "Ghani", "Habib", "Hafid", "Hakim", "Halim", "Hamid", "Hani", "Hichem", "Hilal", "Hosni", "Ismail", "Imed", "Jabar", "Kaddour", "Kader", "Kamel", "Karim", "Khaled", "Khalil", "Larbi", "Lotfi", "Mabrouk", "Mahboub", "Mahfoud", "Mahmoud", "Malik", "Marwan", "Mehdi", "Mohamed", "Moktar", "Moncef", "Mourad", "Nabil", "Nacer", "Nadir", "Nadjib", "Nassim", "Nazim", "Nouh", "Omar", "Othmane", "Usama", "Rabah", "Rachid", "Rafik", "Rahal", "Ramzi", "Raouf", "Rayan", "Réda", "Redouane", "Riad", "Rochdi", "Sabri", "Salah", "Salim", "Sami", "Sedik", "Sofiane", "Tahar", "Taimim", "Tarek", "Tayeb", "Tawfik", "Wallid", "Wassim", "Yacoub", "Yazid", "Youcef", "Younes", "Zahid", "Zaïm", "Zakaria", "Zaki", "Ziad", "Zoheir", "AbdulRahman", "Zohdy", "Gamal", "Mobarak", "Samy", "Zain", "Malek", "Saeed", "Mohaab", "Mido"];
//Default language
let language = "en";


//Sign up steps for the modern interface 2018
let ainput = "CODE:";
ainput += "SET !ERRORIGNORE YES" + jsLF; //ignore errors
ainput += "TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:name CONTENT={{fullname}}" + jsLF; //type full name
ainput += "TAG POS=1 TYPE=DIV ATTR=TXT:Use<SP>email<SP>instead" + jsLF; //hit email instead
ainput += "TAG POS=1 TYPE=INPUT:EMAIL ATTR=NAME:email CONTENT={{email}}" + jsLF; //type email
ainput += "WAIT SECONDS=1" + jsLF; //1 Second later
ainput += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV>DIV:nth-of-type(3)>DIV>DIV\" BUTTON=0" + jsLF; //Simulate click
ainput += "WAIT SECONDS=1" + jsLF; //1 Second  Later
ainput += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV:nth-of-type(5)>DIV\" BUTTON=0" + jsLF; //Simulate click


//Steps for password and confirmation
let binput = "CODE:";
binput += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
// ainput += "WAIT SECONDS=1" + jsLF;
binput += "TAG POS=1 TYPE=INPUT:PASSWORD ATTR=NAME:password CONTENT={{password}}" + jsLF; //Random Password
binput += "WAIT SECONDS=1" + jsLF; //1 Second  Later
binput += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV>DIV>DIV:nth-of-type(2)>DIV>DIV>DIV>DIV>DIV:nth-of-type(3)>DIV>DIV\" BUTTON=0" + jsLF;
binput += "WAIT SECONDS=1" + jsLF; //1 Second  Later
binput += "TAG POS=1 TYPE=INPUT:TEXT FORM=ACTION:/signup/screen_name ATTR=ID:custom_name EXTRACT=TXT" + jsLF; //Extract username if possible

let tempmail = "CODE:",
    confirm = "CODE:";
if (temp_mail_mohmal) {
    tempmail += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    tempmail += "URL GOTO=https://www.mohmal.com/ar/view" + jsLF; //Go to mohmal
    tempmail += "TAG POS=1 TYPE=A ATTR=ID:rand&&HREF:/ar/create/random&&CLASS:btn<SP>btn-primary&&REL:nofollow" + jsLF; //hit email
    tempmail += "TAG POS=1 TYPE=DIV ATTR=DATA-CLIPBOARD-TARGET:#email<SP>.email&&CLASS:email&&DATA-EMAIL:* EXTRACT=TXT" + jsLF; //extract email
    confirm += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    confirm += "URL GOTO=https://www.mohmal.com/ar/view" + jsLF; //Go to inbox
    confirm += "SET !ERRORIGNORE NO" + jsLF; //Don't ignore errors
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:#" + jsLF; //Hit link
    confirm += "FRAME F=1" + jsLF; //use frame 1
    confirm += "TAG POS=1 TYPE=A ATTR=TARGET:_blank&&HREF:https://twitter.com/i/*" + jsLF; //Hit activation link
    confirm += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    confirm += "SET !TIMEOUT_PAGE 4" + jsLF; //Timeout 4 seconds for url loading then skip
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/i/redirect?url=*" + jsLF;
    confirm += "TAB CLOSEALLOTHERS" + jsLF; //Close all other tabs then switch
} else {
    tempmail += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    tempmail += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF; //Go to that url
    tempmail += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/ar/mail ATTR=NAME:random" + jsLF; //Random
    tempmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF; //Extract email address
    confirm += "SET !ERRORIGNORE YES" + jsLF; //Ignroe errors
    confirm += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF; //Moakt Email Address
    confirm += "WAIT SECONDS=10" + jsLF; // Wait 10 seconds
    confirm += "REFRESH" + jsLF; //Then fresh
    confirm += "SET !ERRORIGNORE NO" + jsLF; //Don't ignore errors in the following steps
    confirm += "TAG POS=4 TYPE=TD ATTR=*" + jsLF; //Next
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:/ar/msg/*" + jsLF; //Hit Message
    confirm += "FRAME F=1" + jsLF; //Open Frame 1
    confirm += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors
    confirm += "SET !TIMEOUT_PAGE 4" + jsLF; //Wait 4 seconds for page loading only
    confirm += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/i/redirect?url=*" + jsLF; //Go to the activation link
    confirm += "TAB CLOSEALLOTHERS" + jsLF; //Close all other tabs
}

//Get confimation Links
let repmail = "CODE:";
repmail += "SET !ERRORIGNORE YES" + jsLF;
repmail += "TAG POS=1 TYPE=A ATTR=TXT:mode_edit<SP>*" + jsLF;
repmail += "WAIT SECONDS=5" + jsLF;
repmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;

//Upadte user profile and upload image
let profile = "CODE:";
profile += "SET !ERRORIGNORE YES" + jsLF;
profile += "URL GOTO=https://twitter.com/settings/profile" + jsLF;
profile += "WAIT SECONDS=3" + jsLF;
profile += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Add<SP>a<SP>profile<SP>photo<SP>Change<SP>your<SP>profile*" + jsLF;
profile += "TAG POS=1 TYPE=INPUT:FILE ATTR=NAME:media[] CONTENT=" + myimg + "profile.jpg" + jsLF;
profile += "EVENT TYPE=CLICK SELECTOR=\"#profile_image_upload_dialog-dialog>DIV:nth-of-type(2)>DIV:nth-of-type(3)>BUTTON:nth-of-type(4)\" BUTTON=0" + jsLF;
profile += "TAG POS=1 TYPE=BUTTON ATTR=TXT:Save<SP>changes" + jsLF;
profile += "WAIT SECONDS=3" + jsLF;
///////////////////////////////////////////////////
let uploadpic = window.confirm("Do you want to upload a picture?");
//The following is my plan to run the macros steps with some error handling if possible..
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
        if (email.indexOf(banned_emails) >= 0) {
            iimPlay(repmail);
            email = iimGetLastExtract();
        }
        //Start
        iimPlayCode("URL GOTO=https://mobile.twitter.com/signup?type=email");
        if (window.location.href !== "https://twitter.com/account/access") {
            iimSet("fullname", name);
            iimSet("email", email);
            iimPlay(ainput);

            if (window.location.href === "https://mobile.twitter.com/i/flow/signup?type=email") {
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
                    PicUp();
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
        iimPlayCode("WAIT SECONDS=300");
    }
}
catch (err) {
    iimDisplay("Error: \n" + err + "\nPlease contact with script developer!");
}