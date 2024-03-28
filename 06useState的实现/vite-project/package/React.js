function createTextNode(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      // 这里为[], 避免后续计算检测
      children: [],
    },
  };
}

/**
 * vdom 动态创建
 * @param {*} type
 * @param {*} props
 * @param  {...any} children
 * @returns
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map((child) => {
        // const is
        const isTextNode =
          typeof child === "string" || typeof child === "number";
        return isTextNode ? createTextNode(child) : child;
      }),
    },
  };
}

/***
 *  动态创建dom node
 * 1、create node
 * 2、 设置 props
 * 3、 添加节点
 */
function render(el, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // 根节点
  nextWorkOfUnit = wipRoot;
}

/**
 * 任务调度器的模拟
 * @param {} deadline
 */
// 当前任务
let wipRoot = null;
let nextWorkOfUnit = null;
let currentRoot = null;
let deletions = [];
let wipFiber = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit);

    // 更新时判断结束节点，优化更新
    if (wipRoot?.sibling?.type === nextWorkOfUnit?.type) {
      console.log(
        "%c Line:69 🥖 wipRoot",
        "color:#ed9ec7",
        wipRoot,
        nextWorkOfUnit
      );

      //  直接跳出更新
      nextWorkOfUnit = undefined;
    }

    shouldYield = deadline.timeRemaining() < 1;
  }

  // 链表结束(就是最后阶段， 再去统一提交)
  if (!nextWorkOfUnit && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitDeletionFn(fiber) {
  if (fiber.dom) {
    let fiberParent = fiber.parent;
    // 1、这里就是 function component  没dom, 那么就继续向上👆
    // 2、这里应该是while, 避免多个FC component
    while (!fiberParent.dom) {
      fiberParent = fiberParent.parent;
    }

    // 父节de dom 删除 当前的节点
    fiberParent.dom.removeChild(fiber.dom);
  } else {
    commitDeletionFn(fiber.child);
  }
}

function commitRoot() {
  deletions.forEach(commitDeletionFn);
  commitWork(wipRoot.child);
  currentRoot = wipRoot;
  wipRoot = null;
  // clear
  deletions = [];
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let fiberParent = fiber.parent;
  // 1、这里就是 function component  没dom, 那么就继续向上👆
  // 2、这里应该是while, 避免多个FC component
  while (!fiberParent.dom) {
    fiberParent = fiberParent.parent;
  }

  // 基于不同的fiber做进一步处理
  if (fiber.effectTag === "PLACEMENT" && fiber.dom) {
    fiberParent.dom.append(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom) {
    updateProps(fiber.dom, fiber.props, fiber.alternate?.props);
  }
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // 1、 old 有 new 没有 需要删除
  Object.keys(prevProps).forEach((key) => {
    if (key !== "children") {
      if (!(key in nextProps)) {
        // dom[key] = "";
        dom.removeAttribute(key);
      }
    }
  });

  // 2、 old 没有 new 有 需要添加
  Object.keys(nextProps).forEach((key) => {
    if (key !== "children") {
      if (prevProps[key] !== nextProps[key]) {
        if (key.startsWith("on")) {
          const eventType = key.toLowerCase().substring(2);
          // 卸载之前的dom
          dom.removeEventListener(eventType, prevProps[key]);
          dom.addEventListener(eventType, nextProps[key]);
        } else {
          dom[key] = nextProps[key];
        }
      }
    }
  });

  // 3、 old 有 new 也有 需要更新
  // ... 和2 一样
}

function reconcileChildren(fiber, children) {
  let oldFiber = fiber.alternate?.child;
  let prevChild = null;
  children.forEach((child, index) => {
    const isSameType = oldFiber && child && oldFiber.type === child.type;

    let newFiber;
    if (isSameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: oldFiber.dom,
        child: null,
        sibling: null,
        effectTag: "UPDATE",
        alternate: oldFiber,
      };
    } else {
      if (!child) {
        return;
      }
      // 就是prevChild的父节点，用来指向prevChild的叔叔节点
      newFiber = {
        type: child.type,
        props: child.props,
        parent: fiber,
        dom: null,
        child: null,
        sibling: null,
        effectTag: "PLACEMENT",
      };

      if (oldFiber) {
        // console.warn("%c Line:193 🥤 oldFiber", "color:#42b983", oldFiber);
        deletions.push(oldFiber);
      }
    }

    // 多节点情况下，更新oldFiber指针
    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 设置指针
      prevChild.sibling = newFiber;
    }
    if (newFiber) {
      prevChild = newFiber;
    }
  });

  while (oldFiber) {
    deletions.push(oldFiber);
    oldFiber = oldFiber.sibling;
  }
  console.warn(oldFiber, "++++++");
}

function updateFunctionComponent(fiber) {
  stateHooks = [];
  stateHookIndex = 0;
  wipFiber = fiber;
  const children = [fiber.type(fiber.props)];

  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = typeof fiber.type === "function";
  if (isFunctionComponent) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  // 4. 返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }

  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) return nextFiber.sibling;
    nextFiber = nextFiber.parent;
  }
}

requestIdleCallback(workLoop);

/**
 * 更新流程
 */
function update() {
  let currentFiber = wipFiber;

  return () => {
    console.log(
      "%c Line:269 🍿 currentFiber",
      "---------color:#2eafb0",
      currentFiber
    );
    // wipRoot = {
    //   dom: currentRoot.dom,
    //   props: currentRoot.props,
    //   alternate: currentRoot,
    // };

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    // 根节点
    nextWorkOfUnit = wipRoot;
  };
}

let stateHooks;
let stateHookIndex;
function useState(initialState) {
  console.log("%c Line:297 🌰 initialState", "color:#3f7cff", initialState);

  let currentFiber = wipFiber;

  const oldHook = currentFiber.alternate?.stateHooks[stateHookIndex];

  const stateHook = {
    state: oldHook ? oldHook?.state : initialState,
    queue: oldHook ? oldHook?.queue : [],
  };


  // 这里再去调用，做统一修改
  stateHook.queue.forEach((action) => {
    stateHook.state = action(stateHook.state);
  })

  // 清空当前队列
  stateHook.queue = []

  stateHookIndex++;
  stateHooks.push(stateHook);

  currentFiber.stateHooks = stateHooks;

  function setState(action) {
    // stateHook.state = action(stateHook.state);

    const eagerState  = typeof action === 'function' ? action(stateHook.state) : action;

    // 如果修改的值和当前的值一样，那么就不需要更新
    if (eagerState === stateHook.state) {
      return;
    }

    // typeof action !== 'function' ? ()=> action : action 模拟useState修改方式
    // 改用队列收集，模拟react的批量执行
    stateHook.queue.push(typeof action !== 'function' ? ()=> action : action);

    wipRoot = {
      ...currentFiber,
      alternate: currentFiber,
    };

    nextWorkOfUnit = wipRoot;
  }

  return [stateHook.state, setState];
}

const React = {
  render,
  createElement,
  update,
  useState,
};

export default React;
