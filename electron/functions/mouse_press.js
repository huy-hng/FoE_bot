function mouse_press(x, y) {
  // let webview = document.getElementById('webview');
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

mouse_press(950, 430);
