let { PythonShell } = require("python-shell");
var path = require("path");

function pass_args() {
  var text = document.getElementById("text").value;

  var options = {
    scriptPath: path.join(__dirname, "/../python/"),
    args: [text]
  };

  let pyshell = new PythonShell("main.py", options);

  pyshell.on("message", function(message) {
    console.log(message);
  });
  document.getElementById("text").value = "";
}
