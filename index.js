#!/usr/bin/env node

// Required Files
let colors = require("colors");
let copy = require("recursive-copy");
let fileSystem = require("fs");
let inquire = require("inquirer");
let mysql = require("mysql");
let operatingSystem = require("os");
let program = require('commander');
let unzipper = require("extract-zip");

// Converter
let convert = require("./@converter/converter");

// Init Directory
var initDirectory = operatingSystem.homedir() + "/documents/@AutoSource";

program
    .version("1.0.0")
    .description("A Program Made With Love");

program
    .command("init")
    .action(function(){

        if(!fileSystem.existsSync(initDirectory)) {

            // Create Directory
            fileSystem.mkdirSync(initDirectory, 0744);
            fileSystem.mkdirSync(initDirectory + "/@import", 0744);
            fileSystem.mkdirSync(initDirectory + "/@output", 0744);
            fileSystem.mkdirSync(initDirectory + "/@logs", 0744);
            fileSystem.mkdirSync(initDirectory + "/@JSON", 0744);
            console.log(colors.green(" + Directory (@AutoSource) succesfully created..."));

        } else {

            console.log(colors.red(" + Unable to create (@AutoSource) directory."));

        }

    });

program
    .command("output")
    .action(function() {

        // Read @imports Directory
        fileSystem.readdir(initDirectory + "/@import", function(err, files) {

            // Loop Through Files
            files.forEach(function(val, index) {

                // If File Is (EPUB)
                if(val.split(".")[1] === 'epub') {

                    // Copy File
                    copy(initDirectory + "/@import/" + val, initDirectory + "/@output/" + val.split(".")[0] + ".zip", {
                        override: false
                    })

                    // Extract Zip
                    .then(function(results) {

                        // Alert Files Have Been Copied
                        console.info(colors.green("(" + results.length + ') file(s) copied'));

                        // Unzip File Content
                        unzipper(initDirectory + "/@output/" + val.split(".")[0] + ".zip", {

                            // Directory Target
                            dir: initDirectory + "/@output/" + val.split(".")[0]

                        }, function(err) {

                        });
                    })

                    // Catch Error
                    .catch(function(error) {

                        // Log Errors
                        console.log(colors.yellow(error + " - (File Ignored)"));

                    });

                }
                
            });

        });

    });

program
    .command("convert")
    .action(function() {

        // Read @output Directory
        fileSystem.readdir(initDirectory + "/@output", function(err, files) {

            // Each File In @output
            files.forEach(function(val, index) {

                // If File Not (ZIP)
                if(val.split(".")[1] !== "zip" && val.split("_")[0] === "mwb") {

                    /*
                        Query Source Data
                            This function will collect all files that could,
                            potentially have source material...
                    */

                    querySource(val);

                }

            });

        });

    });

program
    .command("push")
    .action(function() {

        inquire.prompt([
            {
                type: "input",
                name: "host",
                message: "Database Host",
                default: "localhost"
            },
            {
                type: "input",
                name: "user",
                message: "Database User",
                default: "root"
            },
            {
                type: "input",
                name: "database",
                message: "Database Name?",
                default: "infoV2"
            },
            {
                type: "input",
                name: "password",
                message: "Database Password?",
                default: "mysql"
            }
        ])

        .then(function(answers) {

            // Database Connection
            var connection = mysql.createConnection({
                host: answers.host.trim(),
                user: answers.user.trim(),
                password: answers.password.trim(),
                database: answers.database.trim()
            });

            // Connect To Database
            connection.connect();

            // Read JSON Folder
            var getJSON = fileSystem.readdirSync(initDirectory + "/@json");

            var itemsCounted = 0;

            inquire.prompt([
                {
                    type: "list",
                    name: "uploadType",
                    message: "How are we uploading source material?",
                    choices: ["Push", "Update"]
                }
            ]).then(function(answer) {

                // Get Each JSON File
                getJSON.forEach(function (fileName, index, array){

                    itemsCounted++;

                    // Remove Any NON JSON Files
                    if(fileName.split(".")[1] === "json") {

                        // Read Single File & Parse()
                        var singleJSON = fileSystem.readFileSync(initDirectory + "/@json/" + fileName, 'utf8');
                        var parseJSON = JSON.parse(singleJSON);

                        var query = "SELECT * FROM `autosource` WHERE DATE(sDate) = DATE('"+ parseJSON["sDate"] +"') AND DATE(eDate) = DATE('"+ parseJSON['eDate'] +"')";

                        connection.query(query, function(err, results, fields) {

                            if (err) throw err;

                            if(results.length < 1 && answer.uploadType === "Push") {

                                var insertQuery = "INSERT INTO `autosource` SET ?";

                                // Upload Schedules To Database
                                connection.query(insertQuery, JSON.parse(singleJSON), function(err, results) {

                                    if (err) throw err;

                                    console.log( colors.green("\n + Source Uploaded: " + parseJSON['date']) );

                                });

                            } else if(results.length >= 1 && answer.uploadType === "Update") {

                                var insertQuery = "UPDATE `autosource` SET ? WHERE date = '"+ parseJSON["date"] +"'";

                                // Upload Schedules To Database
                                connection.query(insertQuery, JSON.parse(singleJSON), function(err, results, fields) {

                                    if (err) throw err;

                                    // Log Succesful Update
                                    console.log(colors.green("\n + Source Updated: ") + colors.grey(parseJSON['date']) + "\n");

                                    // Log Results
                                    console.log(results);

                                });

                            } else {

                                // Log Up To Date Status
                                console.log(colors.green("\n Up To Date: " + parseJSON['date']));

                            }

                        });

                    }

                    // If Items Have Been Succesfully Uploaded
                    if(itemsCounted === array.length) {

                        setTimeout(() => {

                            // Ending Connection
                            console.log(colors.yellow("\n Connection ended... \n"));
                
                            // End Connection
                            connection.end();

                        }, 5000);

                    }

                });

            });

        });

    });

/*
    Query Source Data
        This function will collect all files that could,
        potentially have source material...
*/
function querySource(val) {

    // Log Files Affected
    console.log(" - " + colors.blue(val));

    // Read OEBPS File Folder
    fileSystem.readdir(initDirectory + "/@output/" + val + "/OEBPS", function(err, files) {

        files.forEach(function(fval, index) {

            if(parseInt(fval.split(".")[0]) && fval.split(".")[1] === "xhtml") {

                if(fval.split("-")[1] !== "extracted.xhtml"){

                    convert.convertToJSON(initDirectory, initDirectory + "/@output/" + val + "/OEBPS/", fval, index);

                }

            }

        });

    });

}

// Proccess Program
program.parse(process.argv);