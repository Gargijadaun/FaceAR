import { fps, getSource, startPlayer } from "../BanubaPlayer.js";

import {
  webcamSourceButton,
  imageSourceButton,
  startScreen,
  overlay,
  fpsBlock,
} from "./elements.js";

const onSourceSelect = () => {
  startScreen.classList.add("hidden");
  overlay.classList.add("hidden");
  setInterval(() => {
    fpsBlock.querySelectorAll("span").forEach((el) => {
      el.innerText = fps[el.id].toFixed(1);
    });
  });
};

const onWebcamSelect = (e) => {
  const source = getSource(e.target.value);
  startPlayer(source);
  onSourceSelect();
};

const onImageSelect = (e) => {
  const source = getSource(e.target.value, e.target.files[0]);
  startPlayer(source);
  onSourceSelect();
};

// Function to automatically select the webcam when the page loads
const autoSelectWebcam = () => {
  const source = getSource(webcamSourceButton.value);
  startPlayer(source);
  onSourceSelect();
};

// Trigger click event on webcamSourceButton when the page loads
window.addEventListener('load', () => {
  webcamSourceButton.click();
});

webcamSourceButton.addEventListener("click", onWebcamSelect);
imageSourceButton.addEventListener("change", onImageSelect);
