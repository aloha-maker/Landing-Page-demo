import { useState, useRef, useEffect } from "react";
import TodoList from "./components/TodoList";
import Auth from "./components/Auth";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [todos, setTodos] = useState([]);
  const [session, setSession] = useState(null); // ログイン状態を管理
  const todoNameRef = useRef();

  // --- 1. ログイン状態の監視 ---
  useEffect(() => {
    // 初回起動時に現在のセッションを取得
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // ログイン・ログアウトのイベントを購読
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // --- 2. DBからデータを取得する ---
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
  }, [session]);

  // --- 3. チェックボックスを切り替える ---
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

  // --- 4. タスクを追加する ---
  const handleAddTodo = async () => {
    const name = todoNameRef.current.value;
    if (name === "") return;

    const { data, error } = await supabase
      .from('todos')
      .insert([{ title: name, is_complete: false,user_id: session.user.id }])
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

  // --- 5. 完了済みを削除する (Delete) ---
  const handleClear = async () => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('is_complete', true);

    if (!error) {
      setTodos(todos.filter((todo) => !todo.is_complete));
    }
  };

  // --- 6. ログアウト処理 ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // --- 7. 表示の切り替え ---
  
  // ログインしていない場合は認証画面を表示
  if (!session) {
    return (
      <div style={{ display: "flex", justifyContent: "center", marginTop: "50px" }}>
        <Auth />
      </div>
    );
  }

  // return部分は今のままで動作します（todosの構造が同じため）
  return (
    <div style={{ padding: "20px" }}>
      <header style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px" }}>
        <span>ログイン中: {session.user.email}</span>
        <button onClick={handleLogout}>ログアウト</button>
      </header>

      <TodoList todos={todos} toggleTodo={toggleTodo} />
      <input type="text" ref={todoNameRef}></input>
      <button onClick={handleAddTodo}>タスクを追加</button>
      <button onClick={handleClear}>完了したタスクの削除</button>
      <div style={{ marginTop: "10px" }}>
        残りのタスク：{todos.filter((todo) => !todo.is_complete).length}
      </div>
    </div>
  )
}

export default App;