function mouse_press(coord) {
  // let webview = document.getElementById('webview');
  let x = coord[0];
  let y = coord[1];

  webview.sendInputEvent({
    type: "mouseDown",
    x: x,
    y: y,
    button: "left",
    clickCount: 1
  });
  webview.sendInputEvent({
    type: "mouseUp",
    x: x,
    y: y,
    button: "left",
    clickCount: 1
  });
}

// mouse_press(950, 430);

module.exports = mouse_press;
