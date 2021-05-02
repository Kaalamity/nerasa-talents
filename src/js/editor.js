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
