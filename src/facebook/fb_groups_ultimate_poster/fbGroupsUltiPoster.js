////////////////////////////////////////////////////////////////////////////////////////
// DEBUG: For Developers only
const EASY_DEBUG_MODE = false; //To activate built-in Debug mode for testing in iMacros Add-on and support Firefox Developer Tools for source-code changes.
const USER_AGENT_STRING = ""; //Please not that change useragent may change the whole website interface
////////////////////////////////////////////////////////////////////////////////////////
//A variable being used as memory to remmeber the next loop session by using new lines between every command.
var jsLF = "\n";
//Loop, error handling variables
var i, retcode, errtext;
//Enumerating all windows of a given type and getting the most recent / any window of a given type.
var windowMediator = Components.classes["@mozilla.org/appshell/window-mediator;1"]
    .getService(Components.interfaces.nsIWindowMediator);
var window = windowMediator.getMostRecentWindow("navigator:browser");
////////////////////////////////////////////////////////////////////////////////////////
/**
 * @description This function will activate built-in iMacros Debug for every single step with more simple algorithm to track changes
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
        allow_debug = "SET !SINGLESTEP YES\nSET !EXTRACT_TEST_POPUP YES\n";
        return allow_debug;
    }
}
////////////////////////////////////////////////////////////////////////////////////////
//Variables for conent/images/groups values
let contents, images, groups;
//Main instructions for first click to close all other tabs and  stop testing extract as well as page time out and ignore any macro errors.
let mainCode = onDebug() + "TAB CLOSEALLOTHERS\n SET !EXTRACT_TEST_POPUP NO\n SET !TIMEOUT_PAGE 10\n SET !ERRORIGNORE YES\n SET !TIMEOUT_STEP 0.1\n";
//Second instructions for macro posting process no testing and page timeout as well as timeout step.
let mainpostCode = onDebug() + "SET !EXTRACT_TEST_POPUP NO\n SET !TIMEOUT_PAGE 10\n SET !ERRORIGNORE YES\n SET !TIMEOUT_STEP 0.1\n";
/** @returns random Interval between two numbers */
function randomInterval(a, b) {
    let c = b - a;
    return Math.floor((Math.random() * c) + a);
}
/** @returns an id for facebook group */
function groupID(name, url) {
    if (!url) url = location.href; //Check if facebook url isn't false
    //Get facebook url id parameter with regular expressions
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    let regexS = "[\\?&]" + name + "=([^&#]*)";
    let regex = new RegExp(regexS);
    let results = regex.exec(url);
    return results === null ? null : results[1];
}
/**  @param {string} id the textarea id */
function getParents(el) {
    let parents = []; //parents array
    let p = el.parentNode; //access parent node
    //Push parents nodes into parents array if doesn't equal null
    while (p !== null) {
        let o = p;
        parents.push(o);
        p = o.parentNode;
    }
    return parents;
}
/** @summary That function for start posting after dash board input */
function playMacro(groups, contents, images, time1, time2) {
    //Run the macro until the end of groups
    for (let key in groups) {
        //Check group key URL form the array.
        if (typeof (groups[key].href) != "undefined") {
            if (key === 0) code = "TAB OPEN\n TAB T=2\n"; //Open new tab for the macro
            else code = "";
            code += "URL GOTO=https://m.facebook.com/groups/" + groupID('group_id', groups[key].href) + "\n"; //go to group by id using gub function
            //Check if any inputs in images fields
            if (images.length === 0) {
                code += "TAG POS=1 TYPE=TEXTAREA ATTR=ID:* CONTENT=" + contents[randomInterval(0, contents.length - 1)].value.replace(/ /g, "<sp>").replace(/\n/g, "<br>") + "\n"; //Input group post
                code += "TAG POS=1 TYPE=INPUT:SUBMIT  ATTR=NAME:view_post\n"; //submit inputed post
                code += "WAIT SECONDS=" + randomInterval(10, 35) + "\n"; //Random Interval between every post
            } else {
                code += "TAG POS=1 TYPE=A  ATTR=TXT:Write<SP>Post\n";
                code += "TAG POS=1 TYPE=INPUT:SUBMIT  ATTR=name:view_photo\n";
                //input all images in array
                for (let key2 in images) {
                    //if image key isn't null push it into facebook
                    if (!isNaN(key2)) {
                        code += "TAG POS=1 TYPE=INPUT:FILE ATTR=NAME:file" + (parseInt(key2) + parseInt(1)) + " CONTENT=" + images[key2].getAttribute('data').replace(/ /g, "<sp>") + "\n";
                    }
                }
                code += "TAG POS=1 TYPE=INPUT:SUBMIT  ATTR=name:add_photo_done\n"; //submit photos
                code += "TAG POS=1 TYPE=TEXTAREA ATTR=ID:* CONTENT=" + contents[randomInterval(0, contents.length - 1)].value.replace(/ /g, "<sp>").replace(/\n/g, "<br>") + "\n"; //interval
                code += "TAG POS=1 TYPE=INPUT:SUBMIT  ATTR=NAME:view_post\n"; //submit post
                code += "WAIT SECONDS=" + randomInterval(time1, time2) + "\n";
            }
            iimPlayCode(mainpostCode + code);
        }
    }
}
//Open notfications of groups to inject the dashboard into it.
iimPlayCode(mainCode + "TAB OPEN\n TAB T=2\n URL GOTO=https://m.facebook.com/settings/notifications/groups/\n ");
//Dashboard in HTML textarea and button as well as start button
window.document.querySelector("#header").innerHTML = `<div class="contentap">
<div class="ctap"><textarea style="width:98%" placeholder="Content" class="ap"></textarea></div></div>
<div class="btcta" style="float:right;"><button class="act">add content</button><button class="rmct">Remove Content</button></div>
<div class="imgap"><input style="width:98%"  type="file" class="upfbgr" data="" >
<br><input style="width:98%"  type="file" class="upfbgr" data="" ><br>
<input style="width:98%"  type="file" class="upfbgr" data="" ><br></div>
<br>Time Random <input type="text" value="20" style="width:50px;" name="sd">-<input type="text" value="50" style="width:50px;" name="ss">
<div class="btcta" style="float:right;"><button class="editgroup">Edit Group</button><button class="run">RunPost</button></div>`;

//This is listener for remove contents
window.document.querySelectorAll('.rmct')[0].addEventListener("click", function () {
    window.document.querySelectorAll('.ctap')[window.document.querySelectorAll('.ctap').length - 1].remove();
});
//This is listner for adding more contents
window.document.querySelectorAll('.act')[0].addEventListener("click", function () {
    if (window.document.querySelectorAll('.ctap').length < 3) {
        window.document.querySelectorAll('.contentap')[0].innerHTML = window.document.querySelectorAll('.contentap')[0].innerHTML + '<div class="ctap"><textarea style="width:98%" placeholder="Content" class="ap"></textarea></div></div>';
    }
});
//Check all files inputs for images.
for (let i in window.document.querySelectorAll('input[type="file"]'))
    if (!isNaN(i))
        window.document.querySelectorAll('input[type="file"]')[i].addEventListener("change", function () {
            this.setAttribute('data', this.value);
        });
//Reset edit to zero
let edit = 0;
window.document.querySelectorAll('.editgroup')[0].addEventListener("click", function () {
    if (edit === 0) {
        let gr = window.document.querySelectorAll("h3");
        for (let i in gr) {
            if (!isNaN(i)) {
                gr[i].innerHTML = gr[i].innerHTML + ' <button class="rmgr"> Delete</button> '; //Inject remove button
                window.document.querySelectorAll("h3 button")[i].addEventListener("click", function () {
                    getParents(this)[1].remove(); //Remvoe the textarea
                });
            }
        }
        edit = 1;
    }
});
//Main dashboard for main listener auto posting
window.document.querySelectorAll('.run')[0].addEventListener("click", function () {
    contents = window.document.querySelectorAll(".ap"); //Get textarea contents
    if (contents[0].value !== "") {
        images = window.document.querySelectorAll(".upfbgr:not([data=\"\"])"); //Post images
        groups = window.document.querySelectorAll("h3 a"); //User groups
        time1 = window.document.querySelectorAll("input[name='sd']")[0].value; //Min interval
        time2 = window.document.querySelectorAll("input[name='ss']")[0].value; //Max interval
        playMacro(groups, contents, images, time1, time2); //Run play macro
    } else {
        contents[0].style.border = "1px solid #C82828"; //Change border color if contents  is empty for textarea
    }
});
//Timeout for client side dashboard input.
iimPlayCode('WAIT SECONDS=9999');