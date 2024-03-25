import React from "./package/React.js";
// const App = React.createElement("div", { id: "app" }, "Simple React");

function Demo({count}) {
  return <div>Demo component: { count}</div>;
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
