const images = document.querySelectorAll(".slideshow img");
let index = 0;

function showImage() {
  images.forEach((image, i) => {
    image.classList.remove("active");
    if (i === index) {
      image.classList.add("active");
    }
  });
}

function nextImage() {
  index++;
  if (index >= images.length) {
    index = 0;
  }
  showImage();
}

function previousImage() {
  index--;
  if (index < 0) {
    index = images.length - 1;
  }
  showImage();
}

showImage();
setInterval(nextImage, 5000);
