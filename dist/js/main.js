//Globals
var editorBoxHTML;
var editorConfig = {
    "columns":4,
    "rows":5
}
var JSONObject = {
    "className": "Template",
    "specName": "Spec",
    "classSkills": "Skill, Skill, Skill, Skill, Skill, Skill",
    "specSkills": "Skill, Skill, Skill, Skill",
    "talents": [
        [],
        [],
        [],
        [],
        [],
    ]
};
//Editor Functionality
//----------------------------------------------------------------------//

let editorInit = () => {
    loadEditorHTML();
}

let loadEditorHTML = () => {
    let htmlPath = "data/templates/editor-card.html";
    $("#editor_template_box").load(htmlPath, function(responseTxt, statusTxt, xhr){
        debugLog("HTML Loaded!");
        editorBoxHTML = responseTxt;
        $("#editor_template_box").remove();
        generateEditor();
    });
}

let generateEditor = () => {
    let cols = 0;
    let rows = 0;

    for(let r = 0; r<editorConfig.rows; r++){
        for(let c = 0; c<editorConfig.columns; c++){
            let eCard = document.createElement('div');
            eCard.id = "editor-card-"+r+"-"+c;
            eCard.append(stringToHTML(editorBoxHTML));

            $("#editor-row-"+rows).append(eCard);

            cols++;
            if(cols>=editorConfig.columns){
                rows++;
                cols = 0;
            }
        }
    }
}

let generateEditorJSON = () => {
    $("#editor-output-block").empty();
    JSONObject = {
        "className": "Template",
        "specName": "Spec",
        "classSkills": "Skill, Skill, Skill, Skill, Skill, Skill",
        "specSkills": "Skill, Skill, Skill, Skill",
        "talents": [
            [],
            [],
            [],
            [],
            [],
        ]
    };
    //Update Document
    JSONObject.className = document.querySelector("#editor-class-name").value;
    JSONObject.specName = document.querySelector("#editor-spec-name").value;
    JSONObject.classSkills = document.querySelector("#editor-class-skills").value;
    JSONObject.specSkills = document.querySelector("#editor-spec-skills").value;

    

    let cols = 0;
    let rows = 0;

    for(let r = 0; r<editorConfig.rows; r++){
        for(let c = 0; c<editorConfig.columns; c++){
            let talentJSON = {
                "talentName":"Template Test",
                "active":false,
                "description":"Test test test.",
                "bottomConnection":true,
                "rightConnection":true
            }

            let thisCard = document.querySelector("#editor-card-"+r+"-"+c);

            talentJSON.talentName = thisCard.querySelector(".editor-text-name").value;
            talentJSON.active = thisCard.querySelector(".editor-cb-active").checked;
            talentJSON.description = thisCard.querySelector(".editor-text-block").value;
            talentJSON.bottomConnection = thisCard.querySelector(".nerasa-t-editor__checkbox--bottom").checked;
            talentJSON.rightConnection = thisCard.querySelector(".nerasa-t-editor__checkbox--right").checked;

            JSONObject.talents[r].push(talentJSON);

            cols++;
            if(cols>=editorConfig.columns){
                rows++;
                cols = 0;
            }
        }
    }
    console.log(JSONObject);
    //Output
    document.querySelector("#editor-output-block").value = JSON.stringify(JSONObject);
}

let parseLoadedJSON = () => {
    //INPUT
    JSONObject = JSON.parse(document.querySelector("#editor-output-block").value);

    document.querySelector("#editor-class-name").value = JSONObject.className;
    document.querySelector("#editor-spec-name").value = JSONObject.specName
    document.querySelector("#editor-class-skills").value = JSONObject.classSkills;
    document.querySelector("#editor-spec-skills").value = JSONObject.specSkills;

    

    let cols = 0;
    let rows = 0;

    for(let r = 0; r<editorConfig.rows; r++){
        for(let c = 0; c<editorConfig.columns; c++){
            let talentJSON =  JSONObject.talents[r][c];

            let thisCard = document.querySelector("#editor-card-"+r+"-"+c);

            thisCard.querySelector(".editor-text-name").value = talentJSON.talentName;
            thisCard.querySelector(".editor-cb-active").checked = talentJSON.active;
            thisCard.querySelector(".editor-text-block").value = talentJSON.description;
            thisCard.querySelector(".nerasa-t-editor__checkbox--bottom").checked = talentJSON.bottomConnection;
            thisCard.querySelector(".nerasa-t-editor__checkbox--right").checked = talentJSON.rightConnection;

            cols++;
            if(cols>=editorConfig.columns){
                rows++;
                cols = 0;
            }
        }
    }
}



//Globals
const configPath = "data/config.json";
var configData = {};
var templateHTML;
var selectedSheet = "class/template";
var loadedSheet;
var classList = [];
var classIndex = 0;
var specIndex = 0;
var eventBitch;

//Debug stuff
const debugMode = true;
const debugLog = (logStr,data) => {
    if(debugMode){
        console.log(logStr,data);
    }
}

//Talent Sheet Display
//----------------------------------------------------------------------//

let loadConfig = () => {
    debugLog("Loading Config...");
    $.getJSON(configPath, function(data) {
        debugLog("Config Loaded!", data);
        configData = data;
        loadBoxHTML();
    });
}

let loadBoxHTML = () => {
    debugLog("Loading Configured HTML Template...");
    let htmlPath = configData.htmlPath;
    $("#template_box").load(htmlPath, function(responseTxt, statusTxt, xhr){
        debugLog("HTML Loaded!");
        templateHTML = responseTxt;
        $("#template_box").remove();
        loadSheetLists();
    });
}

const loadSheetLists = (e) => {
    debugLog("Loading Sheet Inventory...");
    $.getJSON("data/sheets/inventory.json", function(data) {
        debugLog("Inventory Loaded!");
        for(let i = 0; i<data.classes.length; i++){
            classList.push(data.classes[i]);
        }
        debugLog(classList);
        debugLog("---------------");
        updateClasses();
    });
}

const updateClasses = (e) => {
    let i = 0;
    //Class selector
    $("#class-selector").empty();
    $("#spec-selector").empty();
    for(i = 0; i<classList.length; i++){
        let opt = document.createElement('option');
        opt.value = classList[i].folderName;
        $(opt).html(classList[i].className);
        $("#class-selector").append(opt);
    }
    classIndex = 0;
    $("#class-selector").selectedIndex = 0;
    updateSpecs();
}

const updateSpecs = (e) => {
    let i = 0;
    //Spec selector
    $("#spec-selector").empty();
    for(i = 0; i<classList[classIndex].specs.length; i++){
        let opt = document.createElement('option');
        opt.value = classList[classIndex].specs[i].fileName;
        $(opt).html(classList[classIndex].specs[i].specName);
        $("#spec-selector").append(opt);
    }
    specIndex = 0;
    $("#spec-selector").selectedIndex = 0;
    updateSheet();
}

const updateSheet = (e) => {
    selectedSheet = classList[classIndex].folderName+"/"+classList[classIndex].specs[specIndex].fileName;
    loadSheetData();
}


const loadSheetData = () => {
    if(selectedSheet != ""){
            $.getJSON("data/sheets/"+selectedSheet+".json", function(data) {
                debugLog("Sheet Load");
                loadedSheet = data;
                generateSheet();
            }).fail(function() { 
                debugLog("error"); 
            });
    }
}


const generateSheet = () => {
    document.title = loadedSheet.className+" - "+loadedSheet.specName;

    $("#nerasa-t-sheet__class-name").html(loadedSheet.className+": ");
    $("#nerasa-t-sheet__spec-name").html(loadedSheet.specName+" Talent Tree");
    $("#nerasa-t-sheet__class-skills").html(loadedSheet.classSkills);
    $("#nerasa-t-sheet__spec-skills").html(loadedSheet.specSkills);
    //nerasa-t-sheet__class-skills
    let rows = 0;
    let cols = 0;

    for(let r = 0; r<loadedSheet.talents.length; r++){
        $("#row-"+rows).empty();
        for(let c = 0; c<loadedSheet.talents[r].length; c++){
            let tCard = document.createElement('div');
            tCard.id = "card-"+r+"-"+c;
            tCard.append(stringToHTML(templateHTML));

            let talentName = tCard.querySelector(".nerasa-t-card__talent-name");
            let talentActivation = tCard.querySelector(".nerasa-t-card__talent-activation");
            let talentDesc = tCard.querySelector(".nerasa-t-card__text-block");
            let mainCard = tCard.querySelector(".nerasa-t-card");
            let cost = tCard.querySelector(".nerasa-t-card__cost");
            let bottomConnector = tCard.querySelector(".nerasa-t-card__connector--bottom");
            let rightConnector = tCard.querySelector(".nerasa-t-card__connector--right");
            
            let activePassive = "Passive";
            if(loadedSheet.talents[r][c].active){activePassive = "Active";}

            $(mainCard).addClass("nerasa-t-card--"+String(activePassive).toLowerCase());
            $(talentName).html(loadedSheet.talents[r][c].talentName);
            
            $(talentActivation).html(activePassive+" Talent");
            $(talentDesc).html(diceParse(loadedSheet.talents[r][c].description));
            $(cost).html("COST "+((r+1)*5));
            if(loadedSheet.talents[r][c].bottomConnection){
                $(bottomConnector).removeClass("nerasa-t-card__connector--hidden");
            }
            if(loadedSheet.talents[r][c].rightConnection){
                $(rightConnector).removeClass("nerasa-t-card__connector--hidden");
            }
            
            $("#row-"+rows).append(tCard);

            cols++;
            if(cols>3){
                rows++;
                cols = 0;
            }
        }
    }

    updateConnectors();
}

const updateConnectors = () => {
    let rows = 0;
    let cols = 0;

    for(let r = 0; r<loadedSheet.talents.length; r++){
        
        let thisRow = document.querySelector("#row-"+r);

        let rowHeight = thisRow.offsetHeight;

        for(let c = 0; c<loadedSheet.talents[r].length; c++){

            let thisCard = document.querySelector("#card-"+r+"-"+c);
            let cardHeight = thisCard.querySelector(".nerasa-t-card__content-wrapper").offsetHeight;

            thisCard.querySelector(".nerasa-t-card__connector--bottom").style.height = (rowHeight-cardHeight+60) + "px" ;

            cols++;
            if(cols>3){
                rows++;
                cols = 0;
            }
        }
    }
}

const stringToHTML = (str) => {
	var parser = new DOMParser();
	var doc = parser.parseFromString(str, 'text/html');
	return doc.body;
};

const diceParse = (str) => {
    //Gonna take this string and replace all the placeholder symbols with the actual dice spans
    //All dice icons
    let setbackHTML = "<span class=\"nerasa-d nerasa-d--setback\">b</span>"; //SETB
    let boostHTML = "<span class=\"nerasa-d nerasa-d--boost\">b</span>"; //BOOS
    let difficultyHTML = "<span class=\"nerasa-d nerasa-d--difficulty\">d</span>"; //DIFF
    let abilityHTML = "<span class=\"nerasa-d nerasa-d--ability\">s</span>"; //ABIL
    let challengeHTML = "<span class=\"nerasa-d nerasa-d--challenge\">s</span>"; //CHAL
    let proficiencyHTML = "<span class=\"nerasa-d nerasa-d--proficiency\">s</span>"; //PROF

    str = str.replace(/SETB/g,setbackHTML);
    str = str.replace(/BOOS/g,boostHTML);
    str = str.replace(/DIFF/g,difficultyHTML);
    str = str.replace(/ABIL/g,abilityHTML);
    str = str.replace(/CHAL/g,challengeHTML);
    str = str.replace(/PROF/g,proficiencyHTML);

    //All result symbols
    let advantageHTML = "<span class=\"nerasa-r nerasa-r--advantage\">a</span>"; //ADVT
    let successHTML = "<span class=\"nerasa-r nerasa-r--success\">s</span>"; //SUCC
    let triumphHTML = "<span class=\"nerasa-r nerasa-r--triumph\">r</span>"; //TRIU
    let threatHTML = "<span class=\"nerasa-r nerasa-r--threat\">t</span>"; //THRT
    let failureHTML = "<span class=\"nerasa-r nerasa-r--failure\">f</span>"; //FAIL
    let despairHTML = "<span class=\"nerasa-r nerasa-r--despair\">d</span>"; //DESP

    str = str.replace(/ADVT/g,advantageHTML);
    str = str.replace(/SUCC/g,successHTML);
    str = str.replace(/TRIU/g,triumphHTML);
    str = str.replace(/THRT/g,threatHTML);
    str = str.replace(/FAIL/g,failureHTML);
    str = str.replace(/DESP/g,despairHTML);

    return str;
}

let init = () => {
    loadConfig();
}

const classChange = () => {
    classIndex =  document.querySelector("#class-selector").selectedIndex;
    debugLog("Class Change",classIndex);
    updateSpecs();
}

const specChange = () => {
    debugLog("Spec Change");
    specIndex = document.querySelector("#spec-selector").selectedIndex;
    updateSheet();
}


