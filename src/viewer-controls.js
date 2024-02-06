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
    const downloadButton = document.createElement("button");
    downloadButton.style.border = "none";
    downloadButton.style.background = "transparent";
    downloadButton.style.position = "absolute";
    downloadButton.style.width = "11%";
    downloadButton.style.height = "10%";
    downloadButton.style.top = "95%";
    downloadButton.style.left = "36%";
    downloadButton.style.backgroundImage = 'url("download.png")'; // Set the path to your background image
    downloadButton.style.backgroundSize = "cover"; // Ensure the background image covers the entire overlay
    downloadButton.style.backgroundRepeat = "no-repeat"; // Prevent background image from repeating
    downloadButton.addEventListener("click", () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1080;
      canvas.height = 1920;
      const context = canvas.getContext("2d");
      context.drawImage(screenshotImage, 0, 0, 1080, 1920);
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
    // shareButton.textContent = "Share";
    shareButton.style.border = "none";
    shareButton.style.background = "transparent";
    shareButton.style.position = "absolute";
    shareButton.style.width = "11%";
    shareButton.style.height = "10%";
    shareButton.style.top = "95%";
    shareButton.style.left = "21%";
    shareButton.style.backgroundImage = 'url("sharebtn.png")'; // Set the path to your background image
    shareButton.style.backgroundSize = "cover"; // Ensure the background image covers the entire overlay
    shareButton.style.backgroundRepeat = "no-repeat"; // Prevent background image from repeating
    shareButton.addEventListener("click", () => {
      // Add your share logic here
    });
    overlay.appendChild(shareButton);

    // Add a close button to the overlay
    const closeButton = document.createElement("button");
    closeButton.style.border = "none";
    closeButton.style.background = "transparent";
    closeButton.style.position = "absolute";
    closeButton.style.width = "8%";
    closeButton.style.height = "7%";
    closeButton.style.top = "8%";
    closeButton.style.left = "21%";
    closeButton.style.backgroundImage = 'url("closebtn.png")'; // Set the path to your background image
    closeButton.style.backgroundSize = "cover"; // Ensure the background image covers the entire overlay
    closeButton.style.backgroundRepeat = "no-repeat"; // Prevent background image from repeating
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
