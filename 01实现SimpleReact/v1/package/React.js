

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
				return typeof child === "object" 
					? child
					: createTextNode(child);
			})
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
  const dom =
    el.type === "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(el.type);

  // 设置props
  const isProperty = (key) => key !== "children";
  Object.keys(el.props).filter(isProperty).forEach((name) => {
      dom[name] = el.props[name];
	});

	// 处理子节点
	const children = el.props.children || [];
	children.forEach((child) => {
		render(child, dom);
	})
	

	// 添加节点
	container.appendChild(dom)
}

const React = {
	render,
	createElement,
}

export default React;