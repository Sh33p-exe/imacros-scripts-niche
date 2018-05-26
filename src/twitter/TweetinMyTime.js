////////////////////////////////////////////////////////////////////////////////////////
//@github https://github.com/jinzocode/imacros-scripts
////////////////////////////////////////////////////////////////////////////////////////
//A variable being used as memory to remember the next loop session by using new lines between every command.
var jsLF = "\n";
//Loop, error handling variables
var i, retcode, errtext;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
const windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
  .getService(Components.interfaces.nsIWindowMediator);
const window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
//A method to access iMacros interface
let iMacros = window.QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIWebNavigation)
  .QueryInterface(imns.Ci.nsIDocShellTreeItem).rootTreeItem
  .QueryInterface(imns.Ci.nsIInterfaceRequestor)
  .getInterface(imns.Ci.nsIDOMWindow).iMacros;
let filename = iMacros._currentMacro.name; //Get Script Name
let imdata = (iMacros._currentMacro.path).replace(filename, '').replace(/\\Macros\\/g, '\\Datasources\\'); //Get Datasources Folder Path
////////////////////////////////////////////////////////////////////////////////////////
//Count file lines by its path using imns method.
function lineCount(file_path) {
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

//Save Tweets Data in Downloads Folder.
function saveAs(tweet) {
  iimSet("tweet", tweet); //define tweet variable in imacros
  iimPlayCode("SET !EXTRACT {{tweet}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=tweets_done.txt"); //save data
}
////////////////////////////////////////////////////////////////////////////////////////
let yourdatasource = ('tweetsinmytime.csv'); //Datasource file name for tweets
let interval = +prompt('Please enter an interval between every tweet:'); //User Prompt for Interval
let total_tweets = lineCount(imdata + yourdatasource); //Get total tweets

//Never Stop
main:
  while (true) {
    //Repeat until the end of the file
    for (let sw = 0; sw < total_tweets; sw++) {
      //Get Datasources info
      let macro = "CODE:";
      macro += "SET !DATASOURCE_DELIMITER ," + jsLF; //Use comma to split the datasource
      macro += "SET !DATASOURCE " + yourdatasource + jsLF; //Data source file to get tweets.
      macro += "SET !DATASOURCE_COLUMNS 2" + jsLF; //Split tweets and time.
      macro += "SET !DATASOURCE_LINE " + sw + jsLF; //Split tweets and time.
      macro += "SET !EXTRACT {{!COL1}}" + jsLF;
      macro += "ADD !EXTRACT {{!COL2}}" + jsLF;
      iimPlay(macro);
      //Extract Data and Set it to variables
      let tweet = iimGetLastExtract(1);
      let time = iimGetLastExtract(2);

      //Get Current Date
      let date = new Date();
      let hours = (date.getHours() < 10 ? '0' : '') + date.getHours(); //Current Hours and add zero if two numbers
      let min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes(); //Current Minutes and add zero if two numbers
      let timecurrent = hours + ":" + min; //User hours and mintues to match file time.
      //Check if the current time match then open twitter and create new tweet.
      if (timecurrent === time) {
        iimDisplay('Good Time!\n Creating new tweet...');

        let twitter = "CODE:";
        twitter += "SET !ERRORIGNORE NO" + jsLF; //Don't Ignore errors.
        twitter += "URL GOTO=https://twitter.com" + jsLF; //Open Twitter URL
        twitter += "TAG POS=1 TYPE=DIV ATTR=CLASS:ProfileCardStats" + jsLF; //Check Profile Exist
        retcode = iimPlay(twitter);
        if (retcode > 0) {
          let mytweet = "CODE:";
          twitter += "SET !ERRORIGNORE YES" + jsLF; //Ignore errors.
          mytweet += "EVENT TYPE=KEYPRESS SELECTOR=\"HTML>BODY\" CHAR=N" + jsLF; //Simulate tweetbox shortcut
          mytweet += "TAG POS=3 TYPE=DIV ATTR=CLASS:TweetBoxToolbar" + jsLF; //Wait for it
          // mytweet += "TAG POS=1 TYPE=DIV ATTR=ARIA-LABELLEDBY:Tweetstorm-tweet-box-0-label<SP>Tweetstorm-tweet-box-0-text-label&&NAME:tweet&&CLASS:tweet-box<SP>rich-editor<SP>is-showPlaceholder&&SPELLCHECK:true&&ROLE:textbox&&ARIA-MULTILINE:true&&DATA-PLACEHOLDER-DEFAULT:What’s<SP>happening?&&DATA-PLACEHOLDER-POLL-COMPOSER-ON:Ask<SP>a<SP>question...&&DATA-PLACEHOLDER-ADD-ANOTHER-TWEET:Add<SP>another<SP>Tweet&&DIR:ltr&&ARIA-AUTOCOMPLETE:list&&ARIA-EXPANDED:false&&ARIA-OWNS:typeahead-dropdown-6&&CONTENTEDITABLE:true&&TXT:" + jsLF; //Wait Box
          mytweet += "WAIT SECONDS=4" + jsLF; //Wait 4 Seconds before typing...
          mytweet += "EVENTS TYPE=KEYPRESS SELECTOR=\"#Tweetstorm-tweet-box-0>DIV:nth-of-type(2)>DIV>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV\" CHARS={{tweet}}" + jsLF; //Type Tweet
          mytweet += "WAIT SECONDS=1" + jsLF; //1 More Second
          mytweet += "EVENT TYPE=CLICK SELECTOR=\"#Tweetstorm-tweet-box-0>DIV:nth-of-type(2)>DIV:nth-of-type(2)>DIV:nth-of-type(2)>SPAN>BUTTON:nth-of-type(2)\" BUTTON=0" + jsLF; //Submit
          iimSet("tweet", tweet);
          iimPlay(mytweet);
          saveAs(tweet);
          iimDisplay('Tweeted: ' + tweet); //Display Current Tweet in Interface
          iimPlayCode("WAIT SECONDS=" + interval); //Interval in seconds        
        } else {
          alert('Please sign in first!'); //Prompt to user to sign in if required.
          break main; //Stop Script
        }
      }
    }
  }