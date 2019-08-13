"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logging_1 = require("./logging");
const electron_1 = require("electron");
const buffer_1 = require("buffer");
const fs = require("fs");
const helpers = require("./helpers");
const logging = new logging_1.default('get_screenshot');
async function get_screenshot(image_name = 'screen.png') {
    let logger_screenshot = logging.get_logger('get_screenshot', 'WARN');
    let t0 = performance.now();
    let window_size = electron_1.remote
        .getCurrentWindow()
        //@ts-ignore
        .webContents.getOwnerBrowserWindow()
        .getBounds();
    await electron_1.desktopCapturer
        .getSources({ types: ["window"] })
        .then(async (sources) => {
        //@ts-ignore
        for (const source of sources) {
            if (source.name === "FoE Bot") {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
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
                    });
                    await handleStream(stream, image_name);
                }
                catch (e) {
                    logger_screenshot.error(e);
                }
                return;
            }
        }
    });
    let t1 = performance.now();
    logger_screenshot.info(`Screenshot took ${((t1 - t0) / 1000).toFixed(2)} seconds.`);
}
exports.get_screenshot = get_screenshot;
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
    let buf = buffer_1.Buffer.from(base64str, "base64");
    fs.writeFileSync(`temp/${image_name}`, buf);
}
