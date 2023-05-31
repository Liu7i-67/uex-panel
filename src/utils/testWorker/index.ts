import MyWorker from "workerize-loader!./work";

export const worker = MyWorker();
worker.onmessage = (e) => {
  if (e.data === "ended") {
    worker.terminate();
  } else {
    console.log("e.data:", e);
  }
};
