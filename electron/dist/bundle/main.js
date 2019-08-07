"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
process.chdir('./dist/modules/');
const fs = require("fs");
fs.readdir('.', (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
});
// import * as helper from "./src/modules/helper"
const helper = require("src/modules/helper");
document.getElementById("start_button").addEventListener("click", helper.start);
// document.getElementById("pause_button").addEventListener("click", helper.toggle_pause);
// document.getElementById("stop_button").addEventListener("click", helper.toggle_stop);
async function auto_login() {
    console.log('asdf');
}
