"use client"
// 使い方：認証が必要なページは <AuthProvider requireAuth={true}> で囲む
import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import type { User } from "@supabase/auth-js"

type AuthContextType = {
  user: User | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children, requireAuth = false }: { children: React.ReactNode; requireAuth?: boolean }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true)
      try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
          console.error("セッション取得エラー:", error.message)
          setLoading(false)
          return
        }

        if (data.session) {
          console.log("ユーザーセッションが見つかりました:", data.session.user.email)
          setUser(data.session.user)
        } else {
          console.log("セッションが見つかりません。未ログイン状態です。")
          setUser(null)
        }
      } catch (error) {
        console.error("セッション取得中にエラー:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("認証状態が変化:", event, session?.user?.email)

      if (event === "SIGNED_IN" && session) {
        setUser(session.user)
      } else if (event === "SIGNED_OUT") {
        setUser(null)
      } else if (event === "TOKEN_REFRESHED" && session) {
        setUser(session.user)
      }
    })

    return () => {
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (requireAuth && !loading && user === null) {
      router.push("/login")
    }
  }, [requireAuth, user, loading, router])

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error("ログアウトエラー:", error.message)
        return
      }

      setUser(null)
      router.push("/login")
    } catch (error) {
      console.error("ログアウト処理中にエラー:", error)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return <AuthContext.Provider value={{ user, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

