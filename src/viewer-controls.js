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
<<<<<<< HEAD
    const screenshotBlob = await getScreenshot();
    const url = URL.createObjectURL(screenshotBlob);
=======
    const url = URL.createObjectURL(await getScreenshot());
    const popup = document.createElement("div");
    popup.classList.add("popup", "popup__hidden");
    popup.innerHTML = `<span class="popup__bold">Screenshot is ready</span> Check the <span id="screenshot-link"><a href="${url}" target="_blank">link</a></span>`;
    popups.prepend(popup);
>>>>>>> 16cf5a99ae658bb8272be9fd9357589729e6a743

    // Create an overlay element
    const overlay = document.createElement("div");
    overlay.classList.add("overlay");

    // Append the screenshot image to the overlay
    const screenshotImage = document.createElement("img");
    screenshotImage.src = url;
    overlay.appendChild(screenshotImage);

    // Add a download button to the overlay
    const downloadButton = document.createElement("button");
    downloadButton.textContent = "Download";
    downloadButton.addEventListener("click", () => {
      const a = document.createElement("a");
      a.href = url;
      a.download = "screenshot.png";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    });
    overlay.appendChild(downloadButton);

    // Add a share button to the overlay
    const shareButton = document.createElement("button");
    shareButton.textContent = "Share";
    shareButton.addEventListener("click", () => {
      if (navigator.share) {
        console.log('Sharing URL:', url); // Log the URL for debugging
        navigator.share({
          title: "Screenshot",
          text: "Check out this screenshot!",
          url: url,
        })
          .then(() => console.log('Shared successfully'))
          .catch((error) => console.error('Error sharing:', error));
      } else {
        // Fallback if Web Share API is not supported
        alert("Web Share API is not supported in your browser.");
      }
    });
    overlay.appendChild(shareButton);

    // Add the overlay to the document body
    document.body.appendChild(overlay);

    // Close the overlay after a certain time
    setTimeout(() => {
      // overlay.remove();
    }, 5000); // Adjust the time as needed
  }
};

const renderRecDuration = () => {
  const str_pad_left = (string) => {
    return (new Array(3).join("0") + string).slice(-2);
  };

  const minutes = Math.floor(recDuration / 60);
  const seconds = recDuration - minutes * 60;

  recDurationBlock.innerText =
    str_pad_left(minutes) + ":" + str_pad_left(seconds);
  recDuration += 1;
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
