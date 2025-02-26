"use client";
// 使い方：認証が必要なページは <AuthProvider requireAuth={true}> で囲む

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { User } from "@supabase/auth-js";

type AuthContextType = {
  user: User | null;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children, requireAuth = false }: { children: React.ReactNode; requireAuth?: boolean }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // 認証状態を取得中かどうか
  const router = useRouter();

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("セッション取得エラー:", error.message);
          return;
        }

        console.log("Session Data:", data);
        setUser(data.session?.user ?? null);
      } catch (error) {
        console.error("セッション取得中にエラー:", error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // 認証状態の変更を監視
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("認証状態が変化:", session);
      setUser(session?.user ?? null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (requireAuth && !loading && user === null) {
      router.push("/login"); // 未ログインならログインページへリダイレクト
    }
  }, [requireAuth, user, loading, router]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.push("/login"); // ログアウト後はログインページへ
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}