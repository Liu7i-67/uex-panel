/*
 * @Author: liu71
 * @Date: 2023-05-30 21:25:20
 * @Last Modified by: liu7i
 * @Last Modified time: 2023-05-31 15:29:53
 */
// import MyWorker from "utils/testWorker/work.js?worker";
import React, { useEffect } from "react";
import { worker } from "utils/testWorker";

// let worker = new MyWorker();
// worker.onmessage = (e) => {
//   if (e.data === "ended") {
//     worker.terminate();
//   } else {
//     console.log("e.data");
//   }
// };

const Other = function Other_() {
  useEffect(() => {
    console.log("可以不:", worker);
  }, []);
  return (
    <div>
      Other
      <div onClick={() => worker.postMessage("start")}>start</div>
      <div onClick={() => worker.postMessage("stop")}>end</div>
    </div>
  );
};

export default Other;
