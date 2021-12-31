function shuffle(colorList) {
  if (!Array.isArray(colorList) || colorList.length <= 2) return colorList;

  for (let i = colorList.length - 1; i > 1; i--) {
    const j = Math.floor(Math.random() * i);

    let temp = colorList[i];
    colorList[i] = colorList[j];
    colorList[j] = temp;
  }

  return colorList;
}

export const getRandomColorPairs = (count) => {
  const hueList = [
    "red",
    "yellow",
    "green",
    "blue",
    "pink",
    "monochrome",
    "goldenrod",
    "purple",
  ];
  const colorList = [];

  for (let i = 0; i < count; i++) {
    const color = window.randomColor({
      hue: hueList[i % hueList.length],
      luminosity: "dark",
    });

    colorList.push(color);
  }

  const fullColorList = [...colorList, ...colorList];
  shuffle(fullColorList);

  return fullColorList;
};

export function createTimer({ seconds, onChange, onFinish }) {
  let intervalId = null;

  function start() {
    clear();

    let currentSecond = seconds;

    intervalId = setInterval(() => {
      onChange?.(currentSecond);
      currentSecond--;

      if (currentSecond < 0) {
        clear();
        onFinish?.();
      }
    }, 1000);
  }

  function clear() {
    clearInterval(intervalId);
  }

  return {
    start,
    clear,
  };
}
