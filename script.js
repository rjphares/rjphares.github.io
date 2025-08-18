document.addEventListener("DOMContentLoaded", function () {
  var startBtn = document.getElementById("startButton");
  var frame = document.getElementById("mainFrame");
  var titleScreen = document.querySelector(".titleScreenContainer");
  if (startBtn && frame && titleScreen) {
    startBtn.onclick = function () {
      frame.src = "main.html";
      frame.style.display = "block";
      titleScreen.style.display = "none";
    };
  }
});
