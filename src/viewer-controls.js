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
    screenshotButton.style.display = "none";

    // Create or retrieve the existing overlay
    let overlay = document.getElementById("overlay");
    if (!overlay) {
      // Create an overlay element
      overlay = document.createElement("div");
      overlay.id = "overlay";
      overlay.style.display = "none";
      overlay.style.position = "fixed"; // Fixed position to overlay the entire screen
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      overlay.style.backgroundImage = 'url("Photo_frame.png")';
      overlay.style.backgroundSize = "cover";
      overlay.style.backgroundRepeat = "no-repeat";
      document.body.appendChild(overlay);

      // Create a background div
      const backgroundDiv = document.createElement("div");
      backgroundDiv.style.position = "absolute";
      backgroundDiv.style.top = "0";
      backgroundDiv.style.left = "0";
      backgroundDiv.style.width = "100%";
      backgroundDiv.style.height = "100%";
      backgroundDiv.style.backgroundImage = 'url("Photo_frame.png")';
      backgroundDiv.style.backgroundSize = "cover";
      backgroundDiv.style.backgroundRepeat = "no-repeat";
      overlay.appendChild(backgroundDiv);
    }

    // Clear the overlay content
    overlay.innerHTML = "";

    // Load the image and wait for it to load
    const screenshotImage = new Image();
    screenshotImage.src = url;
    await new Promise((resolve) => {
      screenshotImage.onload = resolve;
    });

    // Calculate the dimensions for displaying the image in the center
    const screenAspectRatio = window.innerWidth / window.innerHeight;
    const imageAspectRatio = screenshotImage.width / screenshotImage.height;
    let displayWidth, displayHeight;

    if (screenAspectRatio > imageAspectRatio) {
      // Screen is wider, adjust height to fit
      displayHeight = window.innerHeight * 0.7;
      displayWidth = displayHeight * imageAspectRatio;
    } else {
      // Screen is taller, adjust width to fit
      displayWidth = window.innerWidth * 0.7;
      displayHeight = displayWidth / imageAspectRatio;
    }

    // Calculate the position for centering the image
    const top = (window.innerHeight - displayHeight) / 2;
    const left = (window.innerWidth - displayWidth) / 2;

    // Set the position and size of the screenshot image in the overlay
    screenshotImage.style.position = "absolute";
    screenshotImage.style.top = `${top}px`;
    screenshotImage.style.left = `${left}px`;
    screenshotImage.style.width = `${displayWidth}px`;
    screenshotImage.style.height = `${displayHeight}px`;

    overlay.appendChild(screenshotImage);

// Add a download button to the overlay
const downloadButton = document.createElement("button");
downloadButton.style.border = "none";
downloadButton.style.background = "transparent";
downloadButton.style.position = "absolute";
downloadButton.style.width = "10%";
downloadButton.style.height = "5%";
downloadButton.style.top = "79%";
downloadButton.style.left = "31%";
downloadButton.style.backgroundImage = 'url("download.png")';
downloadButton.style.backgroundSize = "cover";
downloadButton.style.backgroundRepeat = "no-repeat";
downloadButton.addEventListener("click", () => {
  const canvas = document.createElement("canvas");
  canvas.width = screenshotImage.width; // Change this to the desired width
  canvas.height = screenshotImage.height; // Change this to the desired height
  const context = canvas.getContext("2d");
  context.drawImage(screenshotImage, 0, 0, screenshotImage.width, screenshotImage.height);
  const dataUrl = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = dataUrl;
  a.download = "screenshot.png";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
});
overlay.appendChild(downloadButton);

// Add a share button to the overlay
const shareButton = document.createElement("button");
shareButton.style.border = "none";
shareButton.style.background = "transparent";
shareButton.style.position = "absolute";
shareButton.style.width = "10%";
shareButton.style.height = "5%";
shareButton.style.top = "79%";
shareButton.style.left = "11%";
shareButton.style.backgroundImage = 'url("sharebtn.png")';
shareButton.style.backgroundSize = "cover";
shareButton.style.backgroundRepeat = "no-repeat";
shareButton.addEventListener("click", async () => {
  try {
    if (navigator.share) {
      const canvas = document.createElement("canvas");
      canvas.width = 1080; // Change this to the desired width for sharing
      canvas.height = 1920; // Change this to the desired height for sharing
      const context = canvas.getContext("2d");
      context.drawImage(screenshotImage, 0, 0, 1080, 1920);

      canvas.toBlob(async (blob) => {
        const shareData = {
          title: "Check out my screenshot!",
          files: [new File([blob], "screenshot.png", { type: "image/png" })],
        };

        await navigator.share(shareData);
      }, "image/png");
    } else {
      console.log("Web Share API not supported");
    }
  } catch (error) {
    console.error("Error sharing screenshot:", error);
  }
});
overlay.appendChild(shareButton);

    // Add a close button to the overlay
    const closeButton = document.createElement("button");
    closeButton.style.border = "none";
    closeButton.style.background = "transparent";
    closeButton.style.position = "absolute";
    closeButton.style.width = "14%";
    closeButton.style.height = "7%";
    closeButton.style.top = "8%";
    closeButton.style.left = "10%";
    closeButton.style.backgroundImage = 'url("closebtn.png")';
    closeButton.style.backgroundSize = "cover";
    closeButton.style.backgroundRepeat = "no-repeat";
    closeButton.addEventListener("click", () => {
      screenshotButton.style.display = "block";
      overlay.style.display = "none";
    });
    overlay.appendChild(closeButton);

    // Show the overlay
    overlay.style.display = "block";
  }
};

const onRecButtonClick = async () => {
  if (!!isRecording) {
    recButton.src = "assets/icons/controls/icon-record.svg";
    recDurationBlock.classList.add("hidden");
    clearInterval(recDurationInterval);

    const url = URL.createObjectURL(await stopRecord());
    const popup = document.createElement("div");

    popup.classList.add("popup", "popup__hidden");
    popup.innerHTML = `<span class="popup__bold">Video is ready</span> Check the <span id="rec-link"><a href="${url}" target="_blank">link</a></span>`;
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
