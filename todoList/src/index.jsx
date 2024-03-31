import React from "../package/React.js";

import add from "../icon/plus-circle.svg";

import del from "../icon/trash.svg";

import check from "../icon/check.svg";

import cancel from "../icon/cancel.svg";

import logo from "../icon/logo.svg";

import save from "../icon/save.svg";

import "./index.less";

const ToDo = () => {
  const [inputValue, setInputValue] = React.useState("");

  const [filter, setFilter] = React.useState("all");
  const [showLists, setShowLists] = React.useState([]);
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
    addItem(lists.length + 1, inputValue, "todo");
    setInputValue("");
  };

  const handleDel = (id) => {
    setLists(lists.filter((item) => item.id !== id));
  };

  const addItem = (id, name, status) => {
    inputValue &&
      inputValue !== "" &&
      setLists((lists) => [...lists, { id, name, status }]);
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

  const handleSave = () => {
    localStorage.setItem("todoList", JSON.stringify(lists));
    alert("保存成功");
  };

  React.useEffect(() => {
    const todoList = localStorage.getItem("todoList");
    if (todoList) {
      setLists(JSON.parse(todoList));
    }
  }, []);

  React.useEffect(() => {
    // 筛选
    if (filter === "all") {
      setShowLists(lists);
    }

    if (filter === "todo") {
      setShowLists(lists.filter((item) => item.status === "todo"));
    }

    if (filter === "done") {
      setShowLists(lists.filter((item) => item.status === "done"));
    }
  }, [filter, lists]);

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
        <img src={save} onClick={handleSave} alt="icon" />
      </div>
      <div>
        <input
          type="radio"
          name="filter"
          id="all"
          checked={filter === "all"}
          onChange={() => setFilter("all")}
        />
        <label htmlFor="all">all</label>

        <input
          type="radio"
          name="filter"
          id="todo"
          checked={filter === "todo"}
          onChange={() => setFilter("todo")}
        />
        <label htmlFor="todo">todo</label>

        <input
          type="radio"
          name="filter"
          id="done"
          checked={filter === "done"}
          onChange={() => setFilter("done")}
        />
        <label htmlFor="done">done</label>
      </div>
      <ul>
        {...showLists.map((item) => {
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
