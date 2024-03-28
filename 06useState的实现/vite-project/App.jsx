import React from "./package/React.js";

const NewDemo = () => {
  const [demo, setDemo] = React.useState(0);
  const [str, setStr] = React.useState("11");
  function handleClick() {
    setDemo((demo) => demo + 1);
    setStr('999');
  }
  return (
    <div style={{ cursor: "pointer" }}>
      <div onClick={handleClick}>
        NewDemo +1 : {demo}
        <div>str is: {str}</div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div>
      Simple React
      <NewDemo />
    </div>
  );
};

export default App;
