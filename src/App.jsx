import { useState, useRef, useEffect } from "react";
import TodoList from "./components/TodoList";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [todos, setTodos] = useState([]);
  const todoNameRef = useRef();

// --- 1. DBからデータを取得する ---
useEffect(() => {
  const fetchTodos = async () => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .order('id', { ascending: true });
    
    if (error) console.log('error', error);
    else setTodos(data); // DBの [ { title, is_complete }, ... ] が入る
  };
  fetchTodos();
}, []);

// --- 2. チェックボックスを切り替える ---
const toggleTodo = async (id) => {
  const todo = todos.find((todo) => todo.id === id);
  
  const { error } = await supabase
    .from('todos')
    .update({ is_complete: !todo.is_complete }) // completed -> is_complete
    .eq('id', id);

  if (!error) {
    setTodos(todos.map(t => t.id === id ? { ...t, is_complete: !t.is_complete } : t));
  }
};

// --- 3. タスクを追加する ---
const handleAddTodo = async () => {
  const name = todoNameRef.current.value;
  if (name === "") return;

  const { data, error } = await supabase
    .from('todos')
    .insert([{ title: name, is_complete: false }]) // name -> title, completed -> is_complete
    .select();

  if (error) {
    console.error("詳細エラー:", error.message);
    return;
  }

  if (data) {
    setTodos([...todos, data[0]]);
  }
  todoNameRef.current.value = null;
};

  // --- 4. 完了済みを削除する (Delete) ---
  const handleClear = async () => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('is_complete', true);

    if (!error) {
      setTodos(todos.filter((todo) => !todo.is_complete));
    }
  };

  // return部分は今のままで動作します（todosの構造が同じため）
  return (
    <>
      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input type="text" ref={todoNameRef}></input>
      <button onClick={handleAddTodo}>タスクを追加</button>
      <button onClick={handleClear}>完了したタスクの削除</button>
      <div>残りのタスク：{todos.filter((todo) => !todo.is_complete).length}</div>
    </>
  )
}

export default App;