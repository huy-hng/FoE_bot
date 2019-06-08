const { PythonShell } = require("python-shell");
const path = require("path");

function pass_args() {
  let text = document.getElementById("text").value;

  let options = {
    scriptPath: path.join(__dirname, "/../python/"),
    args: [text]
  };

  let pyshell = new PythonShell("main.py", options);

  pyshell.on("message", function(message) {
    console.log(message);
  });
  document.getElementById("text").value = "";
}
