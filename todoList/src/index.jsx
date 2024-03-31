import React from "../package/React.js";

import add from "../icon/plus-circle.svg";

import del from "../icon/trash.svg";

import check from "../icon/check.svg";

import cancel from "../icon/cancel.svg";

import logo from "../icon/logo.svg";

import "./index.less";

const ToDo = () => {
  const [inputValue, setInputValue] = React.useState("");
  const [lists, setLists] = React.useState([
    {
      id: 1,
      name: "吃饭",
      status: "done",
    },
    {
      id: 2,
      name: "睡觉",
      status: "done",
    },
    {
      id: 3,
      name: "code",
      status: "todo",
    },
    {
      id: 4,
      name: "game",
      status: "todo",
    },
  ]);

  const handleAdd = () => {
    addItem(lists.length + 1, inputValue);
    setInputValue("");
  };

  const handleDel = (id) => {
    setLists(lists.filter((item) => item.id !== id));
  };

  const addItem = (id, name) => {
    inputValue &&
      inputValue !== "" &&
      setLists((lists) => [...lists, { id, name }]);
  };

  const handleDone = (id) => {
    setLists(
      lists.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: "done",
          };
        }
        return item;
      })
    );
  };

  const handleCancel = (id) => {
    setLists(
      lists.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            status: "todo",
          };
        }
        return item;
      })
    );
  };

  return (
    <div className="container">
      <h1 className="title">
        <img className="logo" src={logo} alt="icon" />
        待办*LIST
      </h1>
      <div className="header">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <img src={add} onClick={handleAdd} alt="icon" />
      </div>

      <ul>
        {...lists.map((item) => {
          return (
            <li key={item.id} className={item.status}>
              {item.name}
              <img onClick={() => handleDel(item.id)} src={del} alt="icon" />

              {item.status === "done" ? (
                <img
                  onClick={() => handleCancel(item.id)}
                  src={cancel}
                  alt="icon"
                />
              ) : (
                <img
                  onClick={() => handleDone(item.id)}
                  src={check}
                  alt="icon"
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ToDo;
