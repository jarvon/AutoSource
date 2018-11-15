
// Load File System
let fileSystem = require('fs');

// Load Cheerio
let cheerio = require('cheerio');

var exports = module.exports = {};

/*

    Created: November 9th, 2018

    // KHI-TheSource
    Add Code Here To Allow User To Upload EPUB File
        Use This File As A Reference Point.

*/

/*

        Get Interger From Any String
            - Accepts One Value (value)
            * Update Over Time To Include More Advanced Queries

    */
   let getInt = function(value = "") {

    // Algorithum to Parse Song Number
    var regex = /\d+/g;

    // Check If Song Number Exist
    if(value.match(regex).length > 0){

        // Save Songe Value To Object
        return value.match(regex)[0];

    }

}

/*

    Checks For Match In Given String
        - Accepts Two Params (Value, CheckValue)
        - Returns {BOOL} Value

*/
let checkForMatch = function(value = "", checkValue = "") {

    // Check If Values Match
    if(value.toUpperCase() === checkValue.toUpperCase()){

        return true;

    } else {

        return false;

    }

}

exports.convertToJSON = function(initDirectory, location, documentName, index){

    // Read File
    fileSystem.readFile(location + documentName, 'utf8', function(err, data){

        // Init Cheerio
        let $ = cheerio.load(data);

        /*
            // AutoEntry[]
            These Items Will Be Automaticly Included Based On Constant Values That Never Change,
                Update This List Accordingly As Meeting Workbook Changes.
        */
        var autoEntry = [
            'TREASURES FROM GOD’S WORD',
            'APPLY YOURSELF TO THE FIELD MINISTRY',
            'LIVING AS CHRISTIANS'
        ]

        // Combined Source Material
        var combinedSource = {
            sDate: '',
            eDate: '',
            date: '',
            wbr: '',
            song1: '',
            song2: '',
            song3: '',
            part1: '',
            part2: '',
            part3: '',
            part4: '',
            part5: '',
            part6: '',
            part7: '',
            part8: '',
            part9: '',
            part10: '',
            part11: '',
            time1: '',
            time2: '',
            time3: '',
            time4: '',
            time5: '',
            time6: '',
            time7: '',
            time8: '',
            time9: '',
            time10: '',
            time11: '',
            part1Material: '',
            part2Material: '',
            part3Material: '',
            part4Material: '',
            part5Material: '',
            part6Material: '',
            part7Material: '',
            part8Material: '',
            part9Material: '',
            part10Material: ''
        };

        // Get Year
        var formatScheduleYear = documentName.trim().split('.')[0];
        var scheduleYear = parseInt(formatScheduleYear.substr(2, 4));

        // Source Values
        var applyStarterValue = 4;
        var livingAssignments = 8;
        var livingStarter = 0;
        var starterValue = 0;

        // Breakpoints
        var scheduleValidDate = false;

        var hasTreasures = false;
        var hasApply = false;
        var hasLiving = false;

        var savedBibleStudy = false;

        // Empty Apply Items Array[]
        var applyItems = [];

        switch($("title").text().trim().split(" ")[0].toLowerCase()) {

            case "january":
                scheduleValidDate = true;
                break;

                case "february":
                scheduleValidDate = true;
                break;

                case "march":
                scheduleValidDate = true;
                break;

                case "april":
                scheduleValidDate = true;
                break;

                case "may":
                scheduleValidDate = true;
                break;

                case "june":
                scheduleValidDate = true;
                break;

                case "july":
                scheduleValidDate = true;
                break;

                case "august":
                scheduleValidDate = true;
                break;

                case "september":
                scheduleValidDate = true;
                break;

                case "october":
                scheduleValidDate = true;
                break;

                case "november":
                scheduleValidDate = true;
                break;

                case "december":
                scheduleValidDate = true;
                break;


        }

        if(scheduleValidDate){

            // Each Element With [data=pid] Attr()
            $('[data-pid]').each(function(index, el){

                // console.log( index +": "+ $(el).text().trim() );

                // Increment Value
                starterValue += 1;

                // Has An Auto Entry 
                var hasAutoEntry = false;

                /*

                    // Info [var]
                        - Keeps A Reference Of The Current Source Material.
                            This Item Will Be Maniplulated Over Time... 

                */
                var info = $(el).text().trim();

                // Loop Through Auto Entries
                autoEntry.forEach(function(val, index){

                    // Inital Check For Exact Values
                    if(info.toUpperCase() === val){

                        switch (val) {
                            case 'TREASURES FROM GOD’S WORD':

                                hasTreasures = true;

                                // Set Auto Entry Value To True
                                hasAutoEntry = true;

                                break;

                            case 'APPLY YOURSELF TO THE FIELD MINISTRY':

                                hasApply = true;

                                // Set Auto Entry Value To True
                                hasAutoEntry = true;

                                break;

                            case 'LIVING AS CHRISTIANS':

                                hasLiving = true;

                                // Set Auto Entry Value To True
                                hasAutoEntry = true;

                                break;
                        }

                    }

                });

                // If Info Text Needs To Be Broken Down More
                if(!hasAutoEntry){

                    // Get (Date, WBR, Song)
                    if( starterValue <= 4 && !hasAutoEntry ){

                        switch(starterValue) {

                            case 1:

                            // Save Schedule Date
                            combinedSource.date = info;

                            // Convert Schedule Date To Timestamp

                                break;

                            case 2:
                            
                            // Save Weekly Bible Reading
                            combinedSource.wbr = info;

                                break;

                            case 3:

                            // Save Songe Value To Object
                            combinedSource.song1 = getInt(info);

                                break;

                        }

                    }

                    else if(starterValue > 5 && hasTreasures){

                        // First Part
                        if(starterValue === 6){

                            // Split Text
                            var dataToUse = info.split(":");

                            // Set Values
                            combinedSource.part1 = dataToUse[0].trim().slice(1, -1);
                            combinedSource.time1 = getInt(dataToUse[1].trim());

                        }

                        // Triggered Before (HasApply) Has Been Triggered
                        else if(starterValue > 6 && !hasApply){

                            // Split String
                            var strToSplit = info.split(':');

                            // Check for "Digging For Spiritual Gems"
                            if(checkForMatch(strToSplit[0], 'Digging for spiritual gems')) {

                                combinedSource.part2 = strToSplit[0].trim();
                                combinedSource.time2 = getInt(strToSplit[1]);

                            }

                            // Check For "Bible Reading"
                            if(checkForMatch(strToSplit[0], 'bible reading')) {

                                combinedSource.part3 = strToSplit[0].trim();
                                combinedSource.part3Material = strToSplit[1].replace(/ *\([^)]*\) */, "") +":"+ strToSplit[2].trim();
                                combinedSource.time3 = getInt(strToSplit[1]);

                            }

                        }

                        // Triggered Before HasLiving And After HasApply
                        else if(hasApply && !hasLiving) {

                            // Push Items
                            applyItems.push(info);
                        
                        }

                        // Grab Song Information
                        else if(hasLiving && livingStarter === 0) {

                            // Increment Living Starter
                            livingStarter++;

                            // Add Song To Combined Source Material
                            combinedSource.song2 = getInt(info);

                        }

                        else if(hasLiving && livingStarter > 0) {

                            // Split String
                            var strToSplit = info.split(':');

                            // If Congregation Bible Study
                            if(checkForMatch(strToSplit[0], 'Congregation Bible Study')) {

                                // Congregation Bible Study
                                combinedSource.part10 = strToSplit[0].trim();
                                combinedSource.time10 = getInt(strToSplit[1]);

                                // Notify System Of Bible Study Addition
                                savedBibleStudy = true;

                            }

                            // Review Is Available
                            else if(checkForMatch(strToSplit[0].replace(/ *\([^)]*\) */, "").trim(), 'Review Followed by Preview of Next Week')) {

                                // Review Part
                                combinedSource.part11 = strToSplit[0].replace(/ *\([^)]*\) */, "").trim();

                                // Review Time
                                combinedSource.time11 = getInt(strToSplit[0]);

                            }

                            // Save Living As Christians Parts To Source
                            else if(!savedBibleStudy && strToSplit[0] !== '' && livingAssignments <= 9) {

                                // Formatted Data
                                var infoEdited = info.split(/:(.+)/);
                                var infoEditedPart = infoEdited[0].trim();
                                var infoEditedMaterial = infoEdited[1].replace(/ *\([^)]*\) */, "").trim();

                                // Add up to two assignments
                                switch(livingAssignments) {

                                    case 8:
                                    
                                    combinedSource.part8 = infoEditedPart;
                                    combinedSource.part8Material = infoEditedMaterial;
                                    combinedSource.time8 = getInt(infoEdited[1]);

                                        break;

                                    case 9:

                                    combinedSource.part8 = infoEditedPart;
                                    combinedSource.part8Material = infoEditedMaterial;
                                    combinedSource.time8 = getInt(infoEdited[1]);

                                        break;

                                }

                                // Increment Living Assignmnet
                                livingAssignments++

                            }

                            // Save Song Number
                            else if(savedBibleStudy && strToSplit[0] !== '') {

                                // Save Song To Source
                                combinedSource.song3 = getInt(strToSplit[0]);

                            }

                        }

                    }

                }

            });

            // Loop Through Items In Apply Items Array[]
            applyItems.forEach(function(val, index) {

                // Formatted Data
                var infoEdited = val.split(/:(.+)/);
                var infoEditedPart = infoEdited[0].trim();
                var infoEditedMaterial = infoEdited[1].replace(/ *\([^)]*\) */, "").trim();

                // Switch Between Parts(4-7)
                switch(applyStarterValue) {

                    /*

                        // Apply Yourself Items
                        --------------------------------------------
                        This Switch Statement is Used To Loop Though
                            All The Apply Yourself To LIfe And Ministry Assignments.
                            These Assignments Are Then Mapped To The Combined Source.

                        These Assigments Have A Designated Section In Souce.
                            Parts(4-7) Are Designated... Only Valid Opions will be used.
                            Othewise Living As Christians Will Default To Part(8)

                        // Variable Key
                        var val === info
                        var infoEditedPart === Info Trimmed Down

                    */

                    case 4:

                        combinedSource.part4 = infoEditedPart;
                        combinedSource.part4Material = infoEditedMaterial;
                        combinedSource.time4 = getInt(infoEdited[1]);

                        break;

                    case 5:

                        combinedSource.part5 = infoEditedPart;
                        combinedSource.part5Material = infoEditedMaterial;
                        combinedSource.time5 = getInt(infoEdited[1]);

                        break;

                    case 6:

                        combinedSource.part6 = infoEditedPart;
                        combinedSource.part6Material = infoEditedMaterial;
                        combinedSource.time6 = getInt(infoEdited[1]);

                        break;

                    /*
                        Case (7) Is Only Used If There Are Four Assigments
                            Otherwise Item Is Skipped And Left As (Null)
                    */
                    case 7:

                        combinedSource.part7 = infoEditedPart;
                        combinedSource.part7Material = infoEditedMaterial;
                        combinedSource.time7 = getInt(infoEdited[1]);

                        break;

                }

                // Increment Apply Starter Value
                applyStarterValue++;

            });

            // Log Source Material JSON()
            // console.log( JSON.stringify(combinedSource, null, '\t') );

            var jsonFileName = "mykhinfo-" + documentName.split(".")[0] + "@" + index;

            fileSystem.writeFile(initDirectory + "/@json/" + jsonFileName + ".json", JSON.stringify(combinedSource, null, '\t'), "utf8", function(err) {

                if(err) {
                    console.log(err);
                } else {

                    console.log(" - File Converted To JSON");

                }

            });

            // Log Conversion
            console.log(jsonFileName + " - Source Conversion Completed");

        }

    });

}