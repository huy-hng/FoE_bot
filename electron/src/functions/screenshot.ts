import Logging from './logging';
import { desktopCapturer, remote } from "electron";
import { Buffer } from 'buffer';
import * as fs from 'fs';

import * as helpers from './helpers';

const logging = new Logging('get_screenshot');

export async function get_screenshot(image_name='screen.png') {
  let logger_screenshot = logging.get_logger('get_screenshot', 'WARN')
  let t0 = performance.now();

  let window_size = remote
    .getCurrentWindow()
    //@ts-ignore
    .webContents.getOwnerBrowserWindow()
    .getBounds();


  await desktopCapturer
    .getSources({ types: ["window"] })
    .then(async sources => {
      //@ts-ignore
      for (const source of sources) {
        if (source.name === "FoE Bot") {
          try {
            const stream = await navigator.mediaDevices.getUserMedia(
              {
                audio: false,
                video: {
                  //@ts-ignore
                  mandatory: {
                    chromeMediaSource: "desktop",
                    chromeMediaSourceId: source.id,
                    minWidth: window_size.width,
                    maxWidth: window_size.width,
                    minHeight: window_size.height,
                    maxHeight: window_size.height
                  }
                }
              }
            );
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

  let buf = Buffer.from(base64str, "base64");

  fs.writeFileSync(`temp/${image_name}`, buf);
}
