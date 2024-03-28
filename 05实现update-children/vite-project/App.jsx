import React from "./package/React.js";
// const App = React.createElement("div", { id: "app" }, "Simple React");

let num = 10;
let show = false;
function Demo({ count }) {
  const bar = <div>Bar</div>;
  // const foo = <div>Foo</div>
  const Foo = () => {
    return (
      <div>
        <div>Foo</div>
        <div>num is {num}</div>
        <div>9090</div>
      </div>
    );
  };
  const update =   React.update();
  function handleClick() {
    show = !show;
    num++;
    update();
  }

  return (
    <div>
      Demo component: {num}
      {show && bar}
      <div>{show ? bar : <Foo />}</div>
      <button onClick={handleClick}>click</button>
      {show && bar}
    </div>
  );
}

let demo = 1;
const NewDemo = () => {
  const update =   React.update();
  function handleClick() {
    demo += 1;
    update();
  }
  return (
    <div>
      <div onClick={handleClick}>NewDemo +1 : {demo}</div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      Simple React
      <Demo count={23} />
      <NewDemo />
    </div>
  );
};

export default App;
