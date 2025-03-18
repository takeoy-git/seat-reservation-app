"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  
    if (error) {
      alert(error.message);
      return;
    }
    console.log("ログイン成功:", data);
    router.push("/reserve");
  };

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      alert(error.message);
      return;
    }
  

    router.refresh();
    router.push("/login");
  };

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };



  useEffect(() => {
    const refreshSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (!data.session) {
          console.warn("セッションが見つからないため、リフレッシュは実行しません。");
          return;
        }

        const { error: refreshError } = await supabase.auth.refreshSession();
        if (refreshError) {
          console.error("セッションのリフレッシュエラー:", refreshError.message);
        } else {
          console.log("セッションリフレッシュ成功:", data);
        }
      } catch (err) {
        console.error("セッションリフレッシュ処理中にエラー:", err);
      }
    };

    refreshSession();
  }, []);




  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
     <div className="bg-white p-8 rounded-xl shadow-lg w-80 text-center">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">ログイン</h1>
      <input
        type="email"
        placeholder="メールアドレス"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border p-3 w-full rounded-md shadow-sm mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <input
        type="password"
        placeholder="パスワード"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyDown}
        className="border p-3 w-full rounded-md shadow-sm mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
      />
      <div className="flex flex-col space-y-3">
        <button onClick={handleLogin} className="bg-rose-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-rose-600 transition">
          ログイン
        </button>
        <button onClick={handleLogout} className="bg-gray-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-gray-600 transition">
          ログアウト
        </button>
      </div>
      </div>
    </div>
  );
}
