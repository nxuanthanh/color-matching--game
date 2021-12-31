import { createTimer, getRandomColorPairs } from "./utils.js";
import { GAME_STATE, GAME_TIME, PAIRS_COUNT } from "./constant.js";
import {
  getAgainButtonElement,
  getColorElementList,
  getColorListElement,
  getTimerElement,
} from "./selectors.js";

let selections = [];
let gameState = GAME_STATE.PLAYING;

const timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimerChange,
  onFinish: handleTimerFinish,
});

function handleTimerChange(seconds) {
  const countDown = `0${seconds}`.slice(-2) + "s";
  setTimerText(countDown);
}

function handleTimerFinish() {
  setTimerText("GAME OVER!");
  showAgainButton();

  gameState = GAME_STATE.FINISHED;
}

function showAgainButton() {
  const againButton = getAgainButtonElement();
  if (!againButton) return;

  againButton.style.display = "block";
}

function hideAgainButton() {
  const againButton = getAgainButtonElement();
  if (!againButton) return;

  againButton.style.display = "none";
}

function setTimerText(text) {
  const timer = getTimerElement();

  if (!timer) return;

  timer.textContent = text;
}

function handleColorClick(colorElement) {
  const blockClick = [GAME_STATE.FINISHED, GAME_STATE.BLOCKING].includes(
    gameState
  );
  const isClicked = colorElement.classList.contains("active");

  if (blockClick || isClicked) return;

  colorElement.classList.add("active");

  selections.push(colorElement);

  if (selections.length < 2) return;

  const firstColor = selections[0].dataset.color;
  const secondColor = selections[1].dataset.color;

  const isMatch = firstColor === secondColor;

  if (isMatch) {
    const colorElementList = getColorElementList();
    const isWin =
      Array.from(colorElementList).filter((x) => x.className === "active")
        .length === 16;
    if (isWin) {
      showAgainButton();
      setTimerText("YOU WIN!👑");
      timer.clear();

      gameState = GAME_STATE.FINISHED;
    }
    selections = [];
    return;
  }

  gameState = GAME_STATE.BLOCKING;

  setTimeout(() => {
    selections[0].classList.remove("active");
    selections[1].classList.remove("active");

    selections = [];

    // race-condition check with handleTimerClick
    if (gameState !== GAME_STATE.FINISHED) {
      gameState = GAME_STATE.PLAYING;
    }
  }, 500);
}

function resetGame() {
  gameState = GAME_STATE.PLAYING;
  setTimerText("");
  hideAgainButton();

  const colorElementList = getColorElementList();
  colorElementList.forEach((e, i) => {
    e.classList.remove("active");
  });

  startTimer();
  initColors();
}

function initColors() {
  const colorList = getRandomColorPairs(PAIRS_COUNT);
  const colorElementsList = getColorElementList();

  colorElementsList.forEach((element, index) => {
    element.dataset.color = colorList[index];
    const divOverlay = element.querySelector(".overlay");
    divOverlay.style.backgroundColor = colorList[index];
  });
}

function attachEventForColorList() {
  const colorListElement = getColorListElement();
  if (!colorListElement) return;
  colorListElement.addEventListener("click", (e) => {
    if (e.target.tagName !== "LI") return;
    handleColorClick(e.target);
  });
}

function attachEventForAgainButton() {
  const playAgainButton = getAgainButtonElement();
  if (!playAgainButton) return;

  playAgainButton.addEventListener("click", resetGame);
}

function startTimer() {
  timer.start();
}

(() => {
  initColors();

  attachEventForColorList();

  attachEventForAgainButton();

  startTimer();
})();
