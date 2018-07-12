var jsLF = "\n";
var i, retcode, errtext;
var countfree = 0;
var countdown = 0;
var current = 0;
var keyword = prompt("Enter Keywords:");

main: {
        iimSet("keyword", keyword);
        iimPlayCode("TAB CLOSEALLOTHERS\nURL GOTO=https://www.google.com.eg/webhp?hl=ar&sa=X#hl=ar&q={{keyword}}");
        pages: for (var limit = 0; limit < 25; limit++) {
            subpage: for (var n = 1; n <= 10; n++) {
                iimDisplay("Results: " + countfree + "\nDisables sites: " + countdown + "\nResults has been extracted:" + current + "");
                iimPlayCode("TAG POS=" + n + " TYPE=DIV ATTR=CLASS:f<SP>kv<SP>_SWb EXTRACT=TXT");
                var url = iimGetLastExtract().match(/([--:\w?@%&+~#=]*[.][a-z]{2,}\/{0,2})((?:(?:(?:[?&=#.]\w+))|[--:\w?@%&+~#=]\w+)+)?/g);
                if (blockfree(url) === true) {
                    if (isup(url).indexOf("It's not just you!") >= 0) {
                        countdown++;
                    } else {
                        current++;
                        iimSet("url", url);
                        iimPlayCode("SET !EXTRACT {{url}}\nSAVEAS TYPE=EXTRACT FOLDER=* FILE=forumurls.csv");
                    }
                }
            }
            retcode = iimPlayCode("TAG POS=1 TYPE=A ATTR=ID:pnnext");
            if (retcode < 0) {
                iimDisplay("Results: " + countfree + "\nDisables sites: " + countdown + "\nResults has been extracted:" + current + "\n The maximum has been reached.");
                break pages;
            }
        }
    }

    //////////////////////////////////////////////////////////////////////////////////////////////
    //// Functions
    /////////////////////////////////////////////////////////////////////////////////////////////
    //check if website works
function isup(url) {
    var checkme = "CODE:";
    checkme += "SET !ERRORIGNORE YES" + jsLF;
    checkme += "TAB T=1" + jsLF;
    checkme += "TAB OPEN" + jsLF;
    checkme += "TAB T=2" + jsLF;
    checkme += "URL GOTO=http://www.isup.me/" + jsLF;
    checkme += "TAG POS=1 TYPE=INPUT:TEXT FORM=ID:downform ATTR=ID:domain_input CONTENT={{url}}" + jsLF;
    checkme += "TAG POS=1 TYPE=A ATTR=TXT:or<SP>just<SP>me?" + jsLF;
    checkme += "TAG POS=1 TYPE=DIV ATTR=ID:container EXTRACT=TXT" + jsLF;
    checkme += "TAB T=1" + jsLF;
    checkme += "TAB CLOSEALLOTHERS" + jsLF;
    iimSet("url", url);
    iimPlay(checkme);
    var result = iimGetLastExtract();
    return result;
}
//block free websites
function blockfree(url) {
    var forum = true;
    //NON-PAID SITES - FREE!
    var free = ["forumsshop.com", "buy-forum", "alamountada", "new-forum", "2morpg.com", "ahlamontada.com", "ahlamontada.net", "forumaroc.net", "7olm.org", "yoo7.com", "ucoz.", "hooxs.com", "montadalhilal", "ba7r.biz", "arabstar.biz", "frbb.net", "editboard.com", "own0.com", "akbarmontada.com", "forumpalestine.com", "kalamfikalam.com", "dahek.net", "arabepro.com", "montadarabi.com", "fullboards.com", "egyptfree.net", "afdalmontada.net", "ba7r.org", "forumegypt.net", "forumarabia.com", "jordanforum.net", "tariqallah.net", "foroactivo.com", "3arabiyate.net", "ibda3.info", "1forum.biz", "top-me.com", "4umer.com", "echoroukonline.com", "hot4um.com", "arab.st", "mountada.net", "forumotion.com", "mam9.com", "bbactif.com", "nojoumarab.net", "rmooz-pub.com", "msnyou.com", "amuntada.com", "freesyria.biz", "lifeme.net", "nicetopics.com", "alafdal.net", "alhamuntada.com", "palestineforums.com", "4ulike.com", "almountadaalarabi.com", "herforum.net", "sudanforums.net", "almountadayat.com", "freedomiraq.com", "moontada.net", "ahlamuntada.net", "gamerzfun.com", "moroccofree.com", "bestgoo.com", "123.st"];
    var nonforums = ["hao123", ".tk", ".tv", "facebook", "twitter", "soundcloud", "youtube.com", "google", "almaany.com", "mubashier.com", "ahram.org", "youm7", "news", "wikipedia", "aljazeera", "behance", "blog", "wordreference.com", "arabic.rt.com", "goal.com", "alexa.com"];
    check:
        for (var x = 0; x < free.length; x++) {
            if (new RegExp("\\b" + free[x] + "\\b").test(url) || new RegExp("\\b" + nonforums[x] + "\\b").test(url)) {
                countfree++;
                forum = false;
                break check;
            }
        }
    return forum;
}
