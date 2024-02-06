import {
  getScreenshot,
  muteToggle,
  startRecord,
  stopRecord,
} from "../BanubaPlayer.js";

import {
  muteButton,
  screenshotButton,
  popups,
  recDurationBlock,
  recButton,
} from "./elements.js";

let isSoundOn = 0;
let recDurationInterval;
let recDuration;
let isRecording = 0;

const onMuteButtonClick = () => {
  muteButton.src = !!isSoundOn
    ? "assets/icons/controls/icon-sound.svg"
    : "assets/icons/controls/icon-sound-active.svg";
  isSoundOn = 1 - isSoundOn;
  muteToggle(isSoundOn);
};

const onScreenshotButtonClick = async (e) => {
  if (e.type === "mousedown") {
    screenshotButton.src = "assets/icons/controls/capture.png";
  } else {
    screenshotButton.src = "assets/icons/controls/capture.png";
    const screenshotBlob = await getScreenshot();
    const url = URL.createObjectURL(screenshotBlob);

    // Create or retrieve the existing overlay
    let overlay = document.getElementById("overlay");
    if (!overlay) {
      // Create an overlay element
      overlay = document.createElement("div");
      overlay.id = "overlay";
      overlay.style.display = "none";
      overlay.style.position = "fixed"; // Fixed position to overlay the entire screen
      overlay.style.top = "44px";
      overlay.style.left = "-58px";
      overlay.style.width = "116vw";
      overlay.style.height = "68vh";
      overlay.style.backgroundImage = 'url("Photo_frame.png")'; // Set the path to your background image
      overlay.style.backgroundSize = "cover"; // Ensure the background image covers the entire overlay
      overlay.style.backgroundRepeat = "no-repeat"; // Prevent background image from repeating
      document.body.appendChild(overlay);
      screenshotButton.style.display = "none";
    }

    // Clear the overlay content
    overlay.innerHTML = "";

    // Append the screenshot image to the overlay
    const screenshotImage = document.createElement("img");
    screenshotImage.src = url;
    screenshotImage.id = "photo";
    screenshotImage.style.position = "absolute"; // Position absolute for custom positioning
    screenshotImage.style.top = "15%"; // Adjust the top position as needed
    screenshotImage.style.left = "16%"; // Adjust the left position as needed
    screenshotImage.style.width = "83%";
    screenshotImage.style.height = "72%";
    overlay.appendChild(screenshotImage);

    // Add a download button to the overlay
    const downloadButton = createButton("download.png", "11%", "10%", "36%", "95%");
    downloadButton.addEventListener("click", () => {
      captureVisibleArea(screenshotImage, "screenshot.png");
    });
    overlay.appendChild(downloadButton);

    // Add a share button to the overlay
    const shareButton = createButton("sharebtn.png", "11%", "10%", "21%", "95%");
    shareButton.addEventListener("click", () => {
      // Add your share logic here
    });
    overlay.appendChild(shareButton);

    // Add a close button to the overlay
    const closeButton = createButton("closebtn.png", "8%", "7%", "21%", "8%");
    closeButton.addEventListener("click", () => {
      screenshotButton.style.display = "block";
      overlay.style.display = "none";
    });
    overlay.appendChild(closeButton);

    // Show the overlay
    overlay.style.display = "block";
  }
};

// Helper function to create button elements
const createButton = (bgImage, width, height, left, top) => {
  const button = document.createElement("button");
  button.style.border = "none";
  button.style.background = "transparent";
  button.style.position = "absolute";
  button.style.width = width;
  button.style.height = height;
  button.style.top = top;
  button.style.left = left;
  button.style.backgroundImage = `url(${bgImage})`;
  button.style.backgroundSize = "cover";
  button.style.backgroundRepeat = "no-repeat";
  return button;
};

// Helper function to capture the visible area of the image
// Helper function to capture the visible area of the image
// Helper function to capture the visible area of the image
const captureVisibleArea = (image, fileName) => {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  // Set canvas dimensions based on the visible area of the image
  let visibleWidth, visibleHeight;

  // Check if it's on a phone
  if (window.innerWidth <= 768) {
    visibleWidth = image.width * 0.9;  // Adjust as needed for phone
    visibleHeight = image.height * 0.8;  // Adjust as needed for phone
  } else {
    visibleWidth = image.width * 0.83;  // Adjust as needed for other devices
    visibleHeight = image.height * 0.72;  // Adjust as needed for other devices
  }

  canvas.width = visibleWidth;
  canvas.height = visibleHeight;

  // Calculate the centering offsets to maintain the aspect ratio
  const offsetX = (image.width - visibleWidth) / 2;
  const offsetY = (image.height - visibleHeight) / 2;

  // Draw the visible area of the image onto the canvas
  context.drawImage(image, offsetX, offsetY, visibleWidth, visibleHeight, 0, 0, canvas.width, canvas.height);

  // Convert the canvas content to a data URL and trigger download
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};



const onRecButtonClick = async () => {
  if (!!isRecording) {
    recButton.src = "assets/icons/controls/icon-record.svg";
    recDurationBlock.classList.add("hidden");
    clearInterval(recDurationInterval);

    const url = URL.createObjectURL(await stopRecord());
    const popup = document.createElement("div");

    popup.classList.add("popup", "popup__hidden");
    popup.innerHTML = `<span class="popup__bold">Video is ready</span> Check the <span id="rec-link"><a href="${url}" target="_blank">link</a</span>`;
    popups.prepend(popup);

    setTimeout(() => {
      popup.classList.remove("popup__hidden");
    }, 20);
    setTimeout(() => {
      popup.classList.add("popup__hidden");
      setTimeout(() => {
        popup.remove();
      }, 5500);
    }, 5000);
  } else {
    recButton.src = "assets/icons/controls/icon-record-active.svg";
    recDurationBlock.classList.remove("hidden");
    recDurationBlock.innerText = "00:00";

    startRecord();

    recDuration = 0;
    renderRecDuration();

    recDurationInterval = setInterval(renderRecDuration, 1000);
  }
  isRecording = 1 - isRecording;
};

// muteButton.addEventListener("click", onMuteButtonClick);
screenshotButton.addEventListener("mousedown", onScreenshotButtonClick);
screenshotButton.addEventListener("mouseup", onScreenshotButtonClick);
// recButton.addEventListener("click", onRecButtonClick);
