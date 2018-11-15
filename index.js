#!/usr/bin/env node

// Required Files
let program = require('commander');
let colors = require("colors");
let copy = require("recursive-copy");
let unzipper = require("extract-zip");
let fileSystem = require("fs");
let operatingSystem = require("os");

// Converter
let convert = require("./@converter/converter");

// Init Directory
var initDirectory = operatingSystem.homedir() + "/documents/@AutoSource";

program
    .version("0.0.1")
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
    .command("output", )
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