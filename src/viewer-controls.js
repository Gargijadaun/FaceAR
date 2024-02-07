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
  let overlay = document.getElementById("overlay");
  let downloadButton = document.getElementById("downloadButton");
  let shareButton = document.getElementById("shareButton");
  let closeButton = document.getElementById("closeButton");
  let Back = document.getElementById("back");
  if (e.type === "mousedown") {
    screenshotButton.src = "assets/icons/controls/capture.png";
  } else {
    screenshotButton.src = "assets/icons/controls/capture.png";
    const screenshotBlob = await getScreenshot();
    const url = URL.createObjectURL(screenshotBlob);
    screenshotButton.style.display = "none";
    downloadButton.style.display = "block";
    shareButton.style.display = "block";
    closeButton.style.display = "block";
    Back.style.display = "none";
    // Create or retrieve the existing overlay
   
    if (!overlay) {
      // Create an overlay element
      overlay = document.createElement("div");
      overlay.id = "overlay";
      overlay.style.display = "none";
      overlay.style.position = "fixed"; // Fixed position to overlay the entire screen
      overlay.style.top = "0px";
      overlay.style.left = "0px";
      overlay.style.width = "100vw";
      overlay.style.height = "100vh";
      // overlay.style.backgroundImage = 'url("Photo_frame.png")';
      // overlay.style.backgroundSize = "cover";
      overlay.style.background = "transparent"; 
      document.body.appendChild(overlay);

      // Create a background div
      // const backgroundDiv = document.createElement("div");
      // backgroundDiv.style.position = "absolute";
      // backgroundDiv.style.top = "0";
      // backgroundDiv.style.left = "0";
      // backgroundDiv.style.width = "100%";
      // backgroundDiv.style.height = "100%";
      // backgroundDiv.style.backgroundImage = 'url("Photo_frame.png")';
      // backgroundDiv.style.backgroundSize = "cover";
      // backgroundDiv.style.backgroundRepeat = "no-repeat";
      // overlay.appendChild(backgroundDiv);
    }

    // Clear the overlay content
    overlay.innerHTML = "";

 const screenshotImage = document.createElement("img");
screenshotImage.src = url;
screenshotImage.id = "photo";

// Set the position and percentage-based size of the screenshot image in the overlay
screenshotImage.style.position = "fixed";
screenshotImage.style.top = "16%";
screenshotImage.style.left = "12%";
screenshotImage.style.width = "86%";  // Use a percentage for width
screenshotImage.style.height = "auto";  // Let the height adjust proportionally

// Append the screenshot image to the overlay
overlay.appendChild(screenshotImage);
const backgroundDiv = document.createElement("div");
backgroundDiv.style.position = "absolute";
backgroundDiv.style.top = "-0px";
backgroundDiv.style.left = "0px";
backgroundDiv.style.width = "100%";
backgroundDiv.style.height = "100%";
backgroundDiv.style.backgroundImage = 'url("Photo_frame.png")';
backgroundDiv.style.backgroundSize = "cover";
backgroundDiv.style.backgroundRepeat = "no-repeat";
overlay.appendChild(backgroundDiv);
    
   
downloadButton.addEventListener("click", async () => {
  try {
    const canvas = await html2canvas(overlay);
    const dataUrl = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = "overlay_screenshot.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("Error capturing overlay:", error);
  }
});

shareButton.addEventListener("click", async () => {
  try {
    // Check if the Web Share API is supported
    if (navigator.share) {
      // Capture the overlay using html2canvas
      const overlayCanvas = await html2canvas(overlay);

      // Convert overlayCanvas to blob
      overlayCanvas.toBlob(async (overlayBlob) => {
        const shareData = {
          title: "Check out my overlay!",
          files: [
            new File([overlayBlob], "overlay.png", { type: "image/png" }),
          ],
        };

        // Use the Web Share API to share the overlay
        await navigator.share(shareData);
      }, "image/png");
    } else {
      // Web Share API not supported, provide fallback or inform the user
      console.log("Web Share API not supported");
    }
  } catch (error) {
    console.error("Error sharing overlay:", error);
  }
});


    closeButton.addEventListener("click", () => {
      downloadButton.style.display = "none";
      shareButton.style.display = "none";
      closeButton.style.display = "none";
      Back.style.display = "block";
      screenshotButton.style.display = "block";
      overlay.style.display = "none";
    });
    // overlay.appendChild(closeButton);

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
