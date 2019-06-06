// In the renderer process.
const { desktopCapturer } = require("electron");

function getScreenshot() {
  desktopCapturer
    .getSources({ types: ["window", "screen"] })
    .then(async sources => {
      for (const source of sources) {
        console.log(source.name);

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

function handleStream(stream) {
  const video = document.querySelector("video");
  video.srcObject = stream;
  video.onloadedmetadata = () => {
    video.play();
    // Create canvas
    let canvas = document.createElement("canvas");
    canvas.height = video.videoHeight;
    canvas.width = video.videoWidth;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    let img = new Image();
    img.src = canvas.toDataURL();
    console.log(img);
    document.getElementById("img").setAttribute("src", img.src);

    // let li = document.createElement("li");
    // li.appendChild(img);
    // document.getElementById("olFrames").appendChild(li);
  };
  console.log(stream);
}

function handleError(e) {
  console.log(e);
}
