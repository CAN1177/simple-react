// // console.log("%c Line:2 🥑", "color:#e41a6a", "simple-react");

// // // 创建结构
// // const dom = document.createElement("div");
// // dom.id = "app";
// // document.querySelector("#root").appendChild(dom);

// /**
//  *
//  * 1、appendChild只接受一个节点类型的参数，即要附加的节点。如果要插入多个节点或字符串，需要多次调用appendChild。
//  * 2、append可以接受多个参数，并且参数不限于节点，也可以是字符串。如果参数是字符串，append会将其作为当前节点的一部分进行处理，而appendChild会忽略非节点类型的参数。
//  * 3、appendChild返回的是被添加的节点，可以用于链式操作，而append返回的是undefined。
//  * 4、appendChild如果使用已存在的 DOM 节点作为参数，它会把该节点从原来的位置删除并附加到新位置；而使用append则不会移动节点，而是复制添加。
//  * 5、尽管append在功能上更加强大，但是必须注意到，它的浏览器兼容性较差，尤其是在 IE 中无法使
//  */
// // // 添加内部节点
// // const textNode = document.createTextNode("");
// // textNode.nodeValue = "Simple React";
// // dom.appendChild(textNode);

// // const textElementObj = {
// //   type: "TEXT_ELEMENT",
// //   props: {
// //     nodeValue: "Simple React",
// //     // 这里为[], 避免后续计算检测
// //     children: [],
// //   },
// // };

// // // 引入vdom js object ==>> type props children
// // const vdom = {
// //   type: "div",
// //   props: {
// //     id: "app",
// //     children: [textElementObj],
// //   },
// // };

// // // dan这里的还是写死的结构
// // const dom = document.createElement(vdom.type);
// // dom.id = vdom.props.id;
// // document.querySelector("#root").appendChild(dom);

// // const textNode = document.createTextNode("");
// // textNode.nodeValue = textElementObj.props.nodeValue
// // dom.appendChild(textNode);

// // 改为动态 创建
// function createTextNode(text) {
//   return {
//     type: "TEXT_ELEMENT",
//     props: {
//       nodeValue: text,
//       // 这里为[], 避免后续计算检测
//       children: [],
//     },
//   };
// }

// /**
//  * vdom 动态创建
//  * @param {*} type
//  * @param {*} props
//  * @param  {...any} children
//  * @returns
//  */
// function createElement(type, props, ...children) {
//   return {
//     type,
//     props: {
//       ...props,
// 			children: children.map((child) => {
// 				return typeof child === "object" 
// 					? child
// 					: createTextNode(child);
// 			})
//     },
//   };
// }

// // const textElementObj = createTextNode("Simple React");
// // console.log("%c Line:71 🥛 textElementObj", "color:#2eafb0", textElementObj);

// // const App = createElement("div", { id: "app" }, textElementObj);

// // const dom = document.createElement(App.type);
// // dom.id = App.props.id;
// // document.querySelector("#root").appendChild(dom);

// // const textNode = document.createTextNode("");
// // textNode.nodeValue = textElementObj.props.nodeValue
// // dom.appendChild(textNode);

// /***
//  *  动态创建dom node
//  * 1、create node
//  * 2、 设置 props
//  * 3、 添加节点
//  */
// function render(el, container) {
//   const dom =
//     el.type === "TEXT_ELEMENT"
//       ? document.createTextNode("")
//       : document.createElement(el.type);

//   // 设置props
//   const isProperty = (key) => key !== "children";
//   Object.keys(el.props).filter(isProperty).forEach((name) => {
//       dom[name] = el.props[name];
// 	});

// 	// 处理子节点
// 	const children = el.props.children || [];
// 	children.forEach((child) => {
// 		render(child, dom);
// 	})
	

// 	// 添加节点
// 	container.appendChild(dom)
// }

// const textElementObj = createTextNode("Simple React");

// // const App = createElement("div", { id: "app" }, textElementObj); 处理createElement 函数
// const App = createElement("div", { id: "app" }, "Simple React");
// render(App, document.querySelector("#root"));





// /**
//  *  和 官方保持一致
//  * ReactDOM.createRoot(document.querySelector('#root')).render(<App/>);
//  */

// const ReactDom = {
// 	createRoot(container) {
// 		return {
// 			render(APP) {
// 				render(APP, container);
// 			}
// 		}
// 	}
// }

// ReactDom.createRoot(document.querySelector("#root")).render(App);

import ReactDom from "./package/ReactDom.js";
import React from "./package/React.js";
const App = React.createElement("div", { id: "app" }, "Simple React");
ReactDom.createRoot(document.querySelector("#root")).render(App);