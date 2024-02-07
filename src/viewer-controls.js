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
screenshotImage.style.top = "10%";
screenshotImage.style.left = "17%";
screenshotImage.style.width = "75%";  // Use a percentage for width
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
    // Add a download button to the overlay
    const downloadButton = document.createElement("button");
    downloadButton.style.border = "none";
    downloadButton.style.background = "transparent";
    downloadButton.style.position = "absolute";
    downloadButton.style.width = "8%";
    downloadButton.style.height = "7%";
    downloadButton.style.top = "100%";
    downloadButton.style.left = "31%";
    downloadButton.style.backgroundImage = 'url("download.png")'; // Set the path to your background image
    downloadButton.style.backgroundSize = "cover"; // Ensure the background image covers the entire overlay
    downloadButton.style.backgroundRepeat = "no-repeat"; // Prevent background image from repeating
   
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
    overlay.appendChild(downloadButton);

    // Add a share button to the overlay
    const shareButton = document.createElement("button");
    shareButton.style.border = "none";
    shareButton.style.background = "transparent";
    shareButton.style.position = "absolute";
    shareButton.style.width = "8%";
    shareButton.style.height = "7%";
    shareButton.style.top = "100%";
    shareButton.style.left = "11%";
    shareButton.style.backgroundImage = 'url("sharebtn.png")'; // Set the path to your background image
    shareButton.style.backgroundSize = "cover"; // Ensure the background image covers the entire overlay
    shareButton.style.backgroundRepeat = "no-repeat"; // Prevent background image from repeating
    shareButton.addEventListener("click", async () => {
      try {
        // Check if the Web Share API is supported
        if (navigator.share) {
          const canvas = document.createElement("canvas");
          canvas.width = screenshotImage.width;
          canvas.height = screenshotImage.height;
          const context = canvas.getContext("2d");
          context.drawImage(screenshotImage, 0, 0, screenshotImage.width, screenshotImage.height);
    
          // Convert canvas to blob
          canvas.toBlob(async (blob) => {
            const shareData = {
              title: "Check out my screenshot!",
              files: [
                new File([blob], "screenshot.png", { type: "image/png" }),
                new File([blob], "canvas.png", { type: "image/png" }), // Add canvas as a file
              ],
            };
    
            // Use the Web Share API to share the image and canvas
            await navigator.share(shareData);
          }, "image/png");
        } else {
          // Web Share API not supported, provide fallback or inform the user
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
    closeButton.style.width = "8%";
    closeButton.style.height = "7%";
    closeButton.style.top = "-9%";
    closeButton.style.left = "87%";
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
