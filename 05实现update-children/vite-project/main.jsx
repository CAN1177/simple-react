import React from "./package/React.js";
import ReactDom from "./package/ReactDom.js";
import App from "./App.jsx";

ReactDom.createRoot(document.querySelector("#root")).render(<App/>);
