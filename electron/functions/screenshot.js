const { desktopCapturer } = require("electron");

const helpers = require("./helpers");
const Logging = require("./logging");
const logging = new Logging('get_screenshot');

async function get_screenshot(image_name='screen.png') {
  logger_screenshot = logging.get_logger('get_screenshot', 'debug')
  let t0 = performance.now();

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
            logger_screenshot.error(e)
          }
          return;
        }
      }
    });

  let t1 = performance.now();
  logger_screenshot.info(`Screenshot took ${((t1 - t0) / 1000).toFixed(2)} seconds.`)
}

async function handleStream(stream, image_name) {

  const video = document.querySelector("video");
  video.srcObject = stream;

  let loading = true;
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
    loading = false;
  };

  while (loading) {
    await helpers.sleep(10);
  }
}

async function save_img(base64str, image_name) {
  const fs = require("fs");
  const Buffer = require("buffer").Buffer;

  let buf = Buffer.from(base64str, "base64");

  await fs.writeFile(`temp/${image_name}`, buf, err => {
    if (err) {
      return console.log(err);
    }
    return true;
  });
}

module.exports = get_screenshot;
