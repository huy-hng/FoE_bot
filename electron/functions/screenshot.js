const { desktopCapturer } = require("electron");

const sleep = require("./sleep");

async function get_screenshot(image_name) {
  await desktopCapturer
    .getSources({ types: ["window"] })
    .then(async sources => {
      for (const source of sources) {
        if (source.name === "FoE Bot") {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: false,
              video: {
                mandatory: {
                  chromeMediaSource: "desktop",
                  chromeMediaSourceId: source.id,
                  minWidth: 1920,
                  maxWidth: 1920,
                  minHeight: 1080,
                  maxHeight: 1080
                }
              }
            });
            await handleStream(stream, image_name);
          } catch (e) {
            handleError(e);
          }
          return;
        }
      }
    });
}

async function handleStream(stream, image_name) {
  const video = document.querySelector("video");
  video.style.cssText = "position:absolute;top:-10000px;left:-10000px;";
  video.srcObject = stream;

  let loaded = false;
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

    await save_img(byte_img[1], image_name);
    loaded = true;
  };

  while (!loaded) {
    await sleep(10);
  }
}

function handleError(e) {
  console.log(e);
}

async function save_img(base64str, image_name) {
  const fs = require("fs");
  const Buffer = require("buffer").Buffer;

  let buf = Buffer.from(base64str, "base64");

  await fs.writeFile(image_name, buf, err => {
    if (err) {
      return console.log(err);
    }
    return true;
  });
}

module.exports = get_screenshot;
