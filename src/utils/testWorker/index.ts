import MyWorker from "./work.js?worker";

export const worker = new MyWorker();
worker.onmessage = (e) => {
  if (e.data === "ended") {
    worker.terminate();
  } else {
    console.log("e.data:", e);
  }
};
