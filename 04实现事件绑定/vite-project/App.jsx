import React from "./package/React.js";
// const App = React.createElement("div", { id: "app" }, "Simple React");

let num = 10 
function Demo({ count }) {
  function handleClick() {
    console.warn("%c Line:8 🍰 clicked", "color:#33a5ff");
    num ++
    React.update()
  }

  return (
    <div>
      Demo component: {num}
      <button onClick={handleClick}>点击</button>
    </div>
  );
}

const App = () => {
  return (
    <div>
      Simple React
      <Demo count={23} />
    </div>
  );
};

export default App;
