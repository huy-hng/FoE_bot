"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helper = require("./modules/helper");
document.getElementById("start_button").addEventListener("click", helper.start);
document.getElementById("pause_button").addEventListener("click", helper.toggle_pause);
document.getElementById("stop_button").addEventListener("click", helper.toggle_stop);
async function auto_login() {
    console.log('asdf');
}
