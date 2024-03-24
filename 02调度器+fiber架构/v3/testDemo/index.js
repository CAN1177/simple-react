let id = 0;

function workLoop(deadline) {
  console.log(deadline.timeRemaining());
  id++;
  let shouldYield = false;
  while (!shouldYield) {
    console.log("%c Line:7 🥖", "color:#b03734", "task id is ", id);
    shouldYield = deadline.timeRemaining() < 1 ;
    // 渲染逻辑
  }

  // requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
