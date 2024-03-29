import React from "./package/React.js";

const NewDemo = () => {
  const [demo, setDemo] = React.useState(0);
  const [str, setStr] = React.useState("11");
  function handleClick() {
    setDemo((demo) => demo + 1);
    setStr('999');
  }

  React.useEffect(() => {
    console.log("%c Line:13 🍇", "color:#4fff4B", "useEffect");
  }, [str]);

  React.useEffect(() => {
    console.log("%c Line:17 🍣 demo", "color:#4fff4B", demo);

   return () => {
      console.log("%c Line:20 🍦", "color:#4fff4B", "useEffect will unmount");
    }
  }, [demo]);

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
