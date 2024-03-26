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
        console.log("%c Line:25 🌰 child", "color:#b03734", child);
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
  nextWorkOfUnit = {
    dom: container,
    props: {
      children: [el],
    },
  };
  // 根节点
  root = nextWorkOfUnit;
}

/**
 * 任务调度器的模拟
 * @param {} deadline
 */
// 当前任务
let root = null;
let nextWorkOfUnit = null;
let currentRoot = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // 链表结束(就是最后阶段， 再去统一提交)
  if (!nextWorkOfUnit && root) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

function commitRoot() {
  commitWork(root.child);
  currentRoot = root;
  root = null;
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

  // if (fiber.dom) {
  //   // 当前的dom 添加到父级dom里
  //   fiberParent.dom.append(fiber.dom);
  // }
  // fiberParent.dom.append(fiber.dom)
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function createDom(type) {
  return type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(type);
}

function updateProps(dom, nextProps, prevProps) {
  // const isProperty = (key) => key !== "children";
  // Object.keys(props)
  //   .filter(isProperty)
  //   .forEach((name) => {
  //     if (name.startsWith("on")) {
  //       const eventType = name.toLowerCase().substring(2);
  //       document.addEventListener(eventType, props[name]);
  //     }

  //     dom[name] = props[name];
  //   });

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
          dom.removeEventListener(eventType, prevProps[key])
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

function initChildren(fiber, children) {
  console.log("%c Line:116 🍐 fiber", "color:#f5ce50", fiber);

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
    prevChild = newFiber;
  });
}

function updateFunctionComponent(fiber) {
  const children = [fiber.type(fiber.props)];

  initChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    const dom = (fiber.dom = createDom(fiber.type));

    updateProps(dom, fiber.props, {});
  }

  const children = fiber.props.children;
  initChildren(fiber, children);
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
  nextWorkOfUnit = {
    dom: currentRoot.dom,
    props: currentRoot.props,
    alternate: currentRoot,
  };
  // 根节点
  root = nextWorkOfUnit;
}

const React = {
  render,
  createElement,
  update,
};

export default React;
