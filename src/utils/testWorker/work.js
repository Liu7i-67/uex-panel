import { createFromBuffer, Formatter } from "@dprint/formatter";

let timer = null;
const now1 = performance.now();
let count = 0;

const interval = () => {
  timer = setInterval(() => {
    count++;
    const now2 = performance.now();
    postMessage(count);
    console.log("误差值：", now2 - now1 - 1000 * count);
  }, 1000);
};

onmessage = function (event) {
  const { data } = event;
  if (data === "start") {
    interval();
  }
  if (data === "stop") {
    clearInterval(timer);
    this.postMessage("ended");
  }
  console.log(event.data);
};
