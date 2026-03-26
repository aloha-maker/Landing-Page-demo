import { useState, useRef } from "react";
import TodoList from "./TodoList";
import {v4 as uuidv4} from "uuid";

function App() {
  // todosを監視
  const [todos, setTodos] = useState([]);

  const todoNameRef = useRef();

  // 2. チェックボックスを切り替える関数を作成
  const toggleTodo = (id) => {
    const newTodos = [...todos]; // Stateを直接触らずにコピーを作る
    const todo = newTodos.find((todo) => todo.id === id);
    todo.completed = !todo.completed; // 反転させる
    setTodos(newTodos);
  };

  const handleAddTodo = () => {
    // タスクを追加する
    const name = todoNameRef.current.value;
    if(name === "") return;
    setTodos((prevTodos) =>{
      return [...prevTodos, {id:uuidv4(),name:name,completed:false}]
      
    });
    todoNameRef.current.value = null;

  }

  const handleClear = () =>{
    const newTodos = todos.filter((todo) => !todo.completed);
    setTodos(newTodos);
  }

  return (
    <>
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input type="text" ref={todoNameRef}></input>
      <button onClick={handleAddTodo}>タスクを追加</button>
      <button onClick={handleClear}>完了したタスクの削除</button>
      <div>残りのタスク：{todos.filter((todo) => !todo.completed).length}</div>
    </>
  )
}

export default App;
