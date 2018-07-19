var jsLF = "\n";
var i, retcode, errtext;
var count = 0;
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
const iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIWebNavigation)
    .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
    .QueryInterface(imns.Ci.nsIInterfaceRequestor)
    .getInterface(imns.Ci.nsIDOMWindow).iMacros;
var filename = iMacros._currentMacro.name;
var imfolder = (iMacros._currentMacro.path).match(/.(.*?).Macros./g);
var imdata = imfolder + '\\Datasources\\';

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
////////////////////////////////////////////////////////////////////////////////////////
var names = ["Awaad", "Abdallah", "Adam", "Ahmad", "Adham", "Acef", "Ashraf", "Harsh", "Aktham", "Akram", "Amjad", "Prince", "Anwar", "Aws", "Awab", "Aimen", "Anas", "Osama", "Islam", "Ikram", "Elhamy", "Eyad", "Eyas", "Faith", "Ehab", "Bashir", "Enmity", "Hassan", "Hussein", "Mansour", "Mu'taz Bellah", "Newborn", "Basil", "Basem", "Wow", "Badir", "Bahaa", "Batal", "Badr", "Badran", "Badr", "pond", "Bassam", "Bashar", "Bakr", "Bashir", "Belal", "Tamim", "Tim", "pious", "Turki", "Thamer", "Jaber", "Earnest", "Jasser", "Jassem", "Jabr", "Gabriel", "Jassar", "Jafar", "Jalal", "great", "Beauty", "Friday", "Jihad", "Hamza", "Hammad", "Hamoud", "Hudhayfah", "Husam", "Hosny", "Hussain", "Hikmet", "Haider", "Khalfan", "Khlefan", "Khalil", "Khuzam", "Dali", "Danny", "Drgham", "Darwish", "Duraid", "Raafat", "Raouf", "Pioneer", "Raef", "Rajeh", "Raji", "Rashed", "Satisfied", "willing", "Rakan", "Ramez", "Rami", "Rashad", "Rushd", "Rushdie", "Rashid", "Ramzi", "Riad", "Chubby", "Zaher", "Zahi", "Zayed", "Zubair", "Zuhair", "Zeyad", "Xian", "Zaid", "Zain", "I will see", "Salem", "Sameh", "Samer", "Sami", "Saher", "nebula", "Saad", "Saud", "Happy", "Sufian", "Sultan", "Salman", "Sulaiman", "Samih", "Samir", "Shady", "Shaker", "Shaheen", "Shaya", "Shaddad", "Sherif", "Shafiq", "Sabir", "Safwat", "Salah", "Dahi", "Dia", "Tareq", "Tayel", "Talal", "Talaat", "Taha", "Zafer", "Abed", "Adel", "Arif", "Amer", "obaida", "Othman", "Adnan", "Arafat", "Almighty", "Azzam", "Izzat", "Azmi", "Aziz", "Essam", "Alaa", "Top", "Emad", "Ammar", "Omar", "Amr", "Amir", "Awni", "Ayyash", "Oday", "Ghaly", "Ghanem", "a stranger", "Ghassan", "Ghoneim", "Ghaith", "Fouad", "Fadi", "Knight", "Farouk", "Faiz", "Fathi", "Pride", "Fida", "Firas", "Unique", "Fazza", "Fahd", "Fahmy", "Fawaz", "Fawzi", "Fayyad", "Faisal", "Qaboos", "Qusay", "Karem", "Kazem", "Canaan", "Loai", "Labib", "Laith", "safe", "Abida", "Adiba", "Afaf", "Afifa", "Ahlem", "Aïcha", "Aïda", "Alia", "Amana", "Amel", "Amina", "Amira", "Anissa", "Asmaa", "Assia", "Atika", "Aya", "Aziza", "Badra", "Basma", "Chadia", "Chafia", "Chafika", "Chahra", "Chahrazad", "Chakira", "Dalila", "Djamila", "Douha", "Dounia", "Emna", "Fadila", "Faiza", "Farida", "Faten", "Fatiha", "Fatima", "Fouzia", "Ghalia", "Ghania", "Habiba", "Hadia", "Hafida", "Hafsa", "Hakima", "Hauled", "Halima", "Hamida", "Hanane", "Hania", "Hanna", "Hayet", "Hawa", "Ibtissem", "Ikram", "Ilhem", "Imane", "Ines", "Karima", "Kawtar", "Kenza", "Khadidja", "Khalida", "Latifa", "Leila", "Mabrouka", "Maha", "Mahbouba", "Maissa", "Majda", "Malika", "Manel", "Meriem", "Moufida", "Mouna", "Mounira", "Nabila", "Nacira", "Nadia", "Nadjiba", "Nafissa", "Naïma", "Najet", "Nawel", "Naziha", "Nedjma", "Nour", "Rachida", "Rahma", "Rajah", "Rawda", "Safia", "Saïda", "Sakina", "Saliha", "Salima", "Saloua", "Samia", "Samira", "Sanaa", "Selma", "Sihème", "Soraya", "Souad", "Wafa", "Wahiba", "Warda", "Wasilla", "Wided", "Yamina", "Yasmine", "Yousra", "Zineb", "Zohra", "Adam", "Adel", "Adib", "Adil", "Ahmed", "Aissa", "Ali", "Amine", "Amir", "Anas", "Anise", "Anouar", "Ayoub", "Azziz", "Bachir", "Badr", "Baligh", "Billal", "Bouzid", "Chafik", "Chahid", "Chaker", "Chams", "Chawki", "Chokri", "Daoud", "Djamel", "Djillali", "Fadel", "Fahim", "Fares", "Farid", "Fathi", "Faudel", "Faouzi", "Fayçal", "Ferhat", "Fouad", "Gibril", "Ghani", "Habib", "Hafid", "Hakim", "Halim", "Hamid", "Hani", "Hichem", "Hilal", "Hosni", "Ismail", "Imed", "Jabar", "Kader", "Kamel", "Karim", "Khaled", "Khalil", "Larbi", "Lotfi", "Mabrouk", "Mahboub", "Mahfoud", "Mahmoud", "Malik", "Marwan", "Mehdi", "Mohamed", "Moktar", "Moncef", "Mourad", "Nabil", "Nacer", "Nadir", "Nadjib", "Nassim", "Nazim", "Nouh", "Omar", "Othmane", "Usama", "Rabah", "Mohamed", "Rachid", "Rafik", "Rahal", "Ramzi", "Raouf", "Rayan", "Réda", "Redouane", "Riad", "Rochdi", "Sabri", "Salah", "Salim", "Sami", "Sedik", "Sofiane", "Tahar", "Taimim", "Tarek", "Tayeb", "Tawfik", "Wallid", "Wassim", "Yacoub", "Yazid", "Youcef", "Younes", "Zahid", "Zaïm", "Zakaria", "Zaki", "Ziad", "Zoheir", "Khalifa", "Reda", "Mazen", "Salah", "Samy", "Rami", "Hossam", "Diab", "Kamel", "Hatem", "Hakem", "Basha", "Zedan", "Nader", "Mina", "Ashor", "Amr", "Abdallah", "Abdulhakem", "Abdulhamed", "Abida", "Adiba", "Afaf", "Afifa", "Ahlem", "Aïcha", "Aïda", "Alia", "Amana", "Amel", "Amina", "Amira", "Anissa", "Asma", "Assia", "Atika", "Aya", "Aziza", "Badra", "Basma", "Chadia", "Chafia", "Chafika", "Chahra", "Chahrazad", "Chakira", "Dalila", "Djamila", "Douha", "Dounia", "Emna", "Fadila", "Faiza", "Farida", "Faten", "Fatiha", "Fatima", "Fouzia", "Ghalia", "Ghania", "Habiba", "Hadia", "Hafida", "Hafsa", "Hakima", "Hauled", "Halima", "Hamida", "Hanane", "Hania", "Hanna", "Hayet", "Hawa", "Ibtissem", "Ikram", "Ilhem", "Imane", "Ines", "Karima", "Kawtar", "Kenza", "Khadidja", "Khalida", "Latifa", "Leila", "Mabrouka", "Maha", "Mahbouba", "Maissa", "Majda", "Malika", "Manel", "Meriem", "Moufida", "Mouna", "Mounira", "Nabila", "Nacira", "Nadia", "Nadjiba", "Nafissa", "Naïma", "Najet", "Nawel", "Naziha", "Nedjma", "Nour", "Rachida", "Rahma", "Rajah", "Rawda", "Safia", "Saïda", "Sakina", "Saliha", "Salima", "Saloua", "Samia", "Samira", "Sanaa", "Selma", "Sihème", "Soraya", "Souad", "Wafa", "Wahiba", "Warda", "Wasilla", "Wided", "Yamina", "Yasmine", "Yousra", "Zineb", "Zohra", "Adam", "Adel", "Adib", "Adil", "Ahmed", "Aissa", "Ali", "Amine", "Amir", "Anas", "Anise", "Anouar", "Ayoub", "Azziz", "Bachir", "Badr", "Baligh", "Billal", "Bouzid", "Chafik", "Chahid", "Chaker", "Chams", "Chawki", "Chokri", "Daoud", "Djamel", "Djillali", "Fadel", "Fahim", "Fares", "Farid", "Fathi", "Faudel", "Faouzi", "Fayçal", "Ferhat", "Fouad", "Gibril", "Ghani", "Habib", "Hafid", "Hakim", "Halim", "Hamid", "Hani", "Hichem", "Hilal", "Hosni", "Ismail", "Imed", "Jabar", "Kaddour", "Kader", "Kamel", "Karim", "Khaled", "Khalil", "Larbi", "Lotfi", "Mabrouk", "Mahboub", "Mahfoud", "Mahmoud", "Malik", "Marwan", "Mehdi", "Mohamed", "Moktar", "Moncef", "Mourad", "Nabil", "Nacer", "Nadir", "Nadjib", "Nassim", "Nazim", "Nouh", "Omar", "Othmane", "Usama", "Rabah", "Rachid", "Rafik", "Rahal", "Ramzi", "Raouf", "Rayan", "Réda", "Redouane", "Riad", "Rochdi", "Sabri", "Salah", "Salim", "Sami", "Sedik", "Sofiane", "Tahar", "Taimim", "Tarek", "Tayeb", "Tawfik", "Wallid", "Wassim", "Yacoub", "Yazid", "Youcef", "Younes", "Zahid", "Zaïm", "Zakaria", "Zaki", "Ziad", "Zoheir", "AbdulRahman", "Zohdy", "Gamal", "Mobarak", "Samy", "Zain", "Malek", "Saeed", "Mohaab", "Mido"];
////////////////////////////////////////////////////////////////////////////////////////
var login = "CODE:";
login += "SET !ERRORIGNORE YES" + jsLF;
login += "SET !DATASOURCE_DELIMITER :" + jsLF;
login += "SET !DATASOURCE TwitterAccounts.csv" + jsLF;
login += "SET !DATASOURCE_COLUMNS 3" + jsLF;
login += "SET !DATASOURCE_LINE {{loop}}" + jsLF;
login += "URL GOTO=https://mobile.twitter.com/login?username_or_email={{!COL3}}" + jsLF;
login += "SET !ENCRYPTION NO" + jsLF;
login += "TAG POS=1 TYPE=INPUT:PASSWORD FORM=ACTION:/sessions ATTR=NAME:session[password] CONTENT={{!COL2}}" + jsLF;
login += "EVENT TYPE=CLICK SELECTOR=\"HTML>BODY>DIV>DIV>MAIN>DIV>FORM>DIV:nth-of-type(3)>DIV>DIV\" BUTTON=0" + jsLF;
login += "SET !EXTRACT {{!COL1}}" + jsLF;
login += "ADD !EXTRACT {{!COL2}}" + jsLF;
login += "ADD !EXTRACT {{!COL3}}" + jsLF;

var profile = "CODE:";
profile += "SET !ERRORIGNORE YES" + jsLF;
profile += "SET !TIMEOUT_STEP 2" + jsLF;
profile += "URL GOTO=https://mobile.twitter.com/settings/profile" + jsLF;
profile += "TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:name CONTENT={{name}}<SP>{{lastname}}" + jsLF;
profile += "WAIT SECONDS=1" + jsLF;
profile += "TAG POS=2 TYPE=DIV ATTR=TXT:Save" + jsLF;
profile += "WAIT SECONDS=1" + jsLF;
profile += "URL GOTO=https://mobile.twitter.com/settings/screen_name" + jsLF;
profile += "WAIT SECONDS=3" + jsLF;
profile += "TAG POS=1 TYPE=DIV ATTR=CLASS:_*<SP>rn-*<SP>*<SP>*&&DIR:auto&&ROLE:button&&TABINDEX:0" + jsLF;
profile += "TAG POS=1 TYPE=INPUT:TEXT ATTR=NAME:typedScreenName EXTRACT=TXT" + jsLF;
profile += "TAG POS=2 TYPE=DIV ATTR=TXT:Save" + jsLF;
profile += "WAIT SECONDS=1" + jsLF;

var tempmail = "CODE:";
tempmail += "SET !ERRORIGNORE YES" + jsLF;
tempmail += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
tempmail += "TAG POS=1 TYPE=INPUT:SUBMIT FORM=ACTION:/ar/mail ATTR=NAME:random" + jsLF;
tempmail += "TAG POS=1 TYPE=DIV ATTR=ID:email-address EXTRACT=TXT" + jsLF;

var confirm = "CODE:";
confirm += "SET !ERRORIGNORE YES" + jsLF;
confirm += "URL GOTO=https://www.moakt.com/ar/mail" + jsLF;
confirm += "WAIT SECONDS=5" + jsLF;
confirm += "REFRESH" + jsLF;
confirm += "SET !ERRORIGNORE NO" + jsLF;
confirm += "TAG POS=4 TYPE=TD ATTR=*" + jsLF;
confirm += "TAG POS=1 TYPE=A ATTR=HREF:/ar/msg/*" + jsLF;
confirm += "FRAME F=1" + jsLF;
confirm += "SET !ERRORIGNORE YES" + jsLF;
confirm += "SET !TIMEOUT_PAGE 4" + jsLF;
confirm += "TAG POS=1 TYPE=A ATTR=HREF:https://twitter.com/i/redirect?url=*" + jsLF;
confirm += "TAB CLOSEALLOTHERS" + jsLF;

for (let index = 1; index <= getFileLines(imdata + "TwitterAccounts.csv"); index++) {
    try {
        var firstname = names[getRandomInt(0, names.length)];
        var lastname = names[getRandomInt(0, names.length)];
        iimPlayCode("TAB CLOSEALLOTHERS\nCLEAR");
        iimDisplay("Current: " + index);
        // iimPlay(tempmail);

        var email = iimGetLastExtract();

        iimSet("loop", index);
        iimPlay(login);
        var user = iimGetLastExtract(1);
        var pass = iimGetLastExtract(2);
        var email = iimGetLastExtract(3);

        if (window.location.href !== "https://twitter.com/account/access" && window.location.href.indexOf("twitter.com/login") === -1) {
            // iimPlayCode("SET !ERRORIGNORE YES\nURL GOTO=https://mobile.twitter.com/settings/email\nTAG POS=1 TYPE=DIV ATTR=TXT:Email");

            // if (window.document.querySelectorAll('._3NwrnmFX').length) {
            //     iimSet("email", email);
            //     iimPlayCode("TAG POS=1 TYPE=INPUT:EMAIL ATTR=NAME:email CONTENT={{email}}");
            //     window.document.querySelector('._1YGC8xFq').value = email;
            //     iimPlayCode("TAG POS=2 TYPE=DIV ATTR=TXT:Save\nWAIT SECONDS=2");
            //     //Confirm your account
            //     retcode = iimPlay(confirm);
            //     if (retcode >= 0)
            //         saveAs(user, pass, email);
            // }
            iimSet("name", firstname);
            iimSet("lastname", lastname);
            iimPlay(profile);
            var username = iimGetLastExtract();
            saveAs(username, pass, email);
        }
    } catch (error) {

    }
}
///////////////////////////////////////////////////////////////////////////////////////
function saveAs(user, pass, email) {
    iimSet("usr", user);
    iimSet("pass", pass);
    iimSet("email", email);
    iimPlayCode("SET !DATASOURCE_DELIMITER :\nSET !EXTRACT {{usr}}\nADD !EXTRACT {{pass}}\nADD !EXTRACT {{email}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=HumanAccounts.csv");
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

