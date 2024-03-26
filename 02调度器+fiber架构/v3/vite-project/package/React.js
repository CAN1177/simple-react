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
        return typeof child === "object" ? child : createTextNode(child);
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
}

function initChildren(fiber) {
  const children = fiber.props.children || [];
  let prevChild = null;
  children.forEach((child, index) => {
    // 就是父节点，用来指向叔叔节点
    const newFiber = {
      type: child.type,
      props: child.props,
      parent: fiber,
      dom: null,
      child: null,
      sibling: null,
    };

    if (index === 0) {
      fiber.child = newFiber;
    } else {
      // 设置指针
      prevChild.sibling = newFiber;
    }
    prevChild = newFiber;
  });
}

/**
 * 任务调度器的模拟
 * @param {} deadline
 */
// nextWorkOfUnit当前执行的任务
let nextWorkOfUnit = null;
function workLoop(deadline) {
  let shouldYield = false;
  while (!shouldYield && nextWorkOfUnit) {
    console.log("%c Line:79 🥑 nextWorkOfUnit", "color:#f5ce50", nextWorkOfUnit);
    nextWorkOfUnit = performUnitOfWork(nextWorkOfUnit);
    shouldYield = deadline.timeRemaining() < 1;
  }

  requestIdleCallback(workLoop);
}

function performUnitOfWork(fiber) {
  // 1、 创建dom node
  if (fiber.dom === null) {
    const dom = (fiber.dom =
      fiber.type === "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(fiber.type));
    // 添加到父级容器里面
    fiber.parent.dom.appendChild(dom);

    // 2、 设置props
    const isProperty = (key) => key !== "children";
    Object.keys(fiber.props)
      .filter(isProperty)
      .forEach((name) => {
        dom[name] = fiber.props[name];
      });
  }

  // 3、 转化链表， 设置指针
  initChildren(fiber);
  //4、返回下一个要执行的任务
  if (fiber.child) {
    return fiber.child;
  }
  if (fiber.sibling) {
    return fiber.sibling;
  }
  return fiber.parent?.sibling;
}

requestIdleCallback(workLoop);

const React = {
  render,
  createElement,
};

export default React;
