const { desktopCapturer } = require("electron");
const { PythonShell } = require("python-shell");
const path = require("path");

function getScreenshot() {
  desktopCapturer.getSources({ types: ["window"] }).then(async sources => {
    for (const source of sources) {
      if (source.name === "FoE Bot") {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: "desktop",
                chromeMediaSourceId: source.id,
                minWidth: 1280,
                maxWidth: 1280,
                minHeight: 720,
                maxHeight: 720
              }
            }
          });
          handleStream(stream);
        } catch (e) {
          handleError(e);
        }
        return;
      }
    }
  });
}

async function handleStream(stream) {
  const video = document.querySelector("video");
  video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";
  video.srcObject = stream;
  video.onloadedmetadata = async () => {
    video.play();
    video.pause();
    // Create canvas
    let canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let byte_img = canvas.toDataURL().split(",");

    await save_img(byte_img[1]);
    launch_python();
  };
}

function handleError(e) {
  console.log(e);
}

function save_img(base64str) {
  const fs = require("fs");
  const Buffer = require("buffer").Buffer;

  let buf = Buffer.from(base64str, "base64");

  fs.writeFile("img.png", buf, err => {
    if (err) {
      return console.log(err);
    } else {
      console.log("image written");
      return true;
    }
  });
}

function launch_python() {
  let options = {
    // mode: "binary",
    scriptPath: path.join(__dirname, "/../python/"),
    args: []
  };

  let pyshell = new PythonShell("main.py", options);

  pyshell.on("message", function(message) {
    console.log(message);
  });
}
