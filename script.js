document.addEventListener("DOMContentLoaded", function () {
  var startBtn = document.getElementById("startButton");
  var frame = document.getElementById("mainFrame");
  var titleScreen = document.querySelector(".titleScreenContainer");
  if (startBtn && frame && titleScreen) {
    startBtn.onclick = function () {
      if (frame.src == "about:blank") {
        frame.src = "main.html";
      }
      frame.style.display = "block";
      titleScreen.style.display = "none";
      frame.focus();
    };
  }
});

window.onmessage = function (e) {
  var frame = document.getElementById("mainFrame");
  var titleScreen = document.querySelector(".titleScreenContainer");
  if (e.data == "return") {
    frame.src = "about:blank";
    frame.style.display = "none";
    titleScreen.style.display = "flex";
  } else if (e.data == "pause") {
    frame.style.display = "none";
    titleScreen.style.display = "flex";
  }
};
