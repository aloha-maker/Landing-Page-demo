import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

const Auth = () => {
  const [isSignUp, setIsSignUp] = useState(false); // 新規登録モードかどうか
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignUp) {
      // 新規登録
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) alert(error.message);
      else alert("アカウントを作成しました！");
    } else {
      // ログイン
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) alert(error.message);
    }
  };

  return (
    <div style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}>
      <h2>{isSignUp ? "新規登録" : "ログイン"}</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>メールアドレス（IDとして使用）:</label><br />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>
        <div style={{ marginTop: "10px" }}>
          <label>パスワード:</label><br />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
        </div>
        <button type="submit" style={{ marginTop: "20px" }}>
          {isSignUp ? "登録する" : "ログインする"}
        </button>
      </form>

      <p style={{ marginTop: "15px", fontSize: "0.9em" }}>
        {isSignUp ? "すでにアカウントをお持ちですか？" : "初めての方はこちら："}
        <span 
          onClick={() => setIsSignUp(!isSignUp)} 
          style={{ color: "blue", cursor: "pointer", textDecoration: "underline", marginLeft: "5px" }}
        >
          {isSignUp ? "ログイン" : "アカウント作成"}
        </span>
      </p>
    </div>
  );
};

export default Auth;