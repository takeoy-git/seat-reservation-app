"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"

export default function Signup() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null)
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      setMessage({ text: "メールアドレスとパスワードを入力してください", type: "error" })
      return
    }

    if (password !== confirmPassword) {
      setMessage({ text: "パスワードが一致しません", type: "error" })
      return
    }

    if (password.length < 6) {
      setMessage({ text: "パスワードは6文字以上で入力してください", type: "error" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        if (!data.user.identities || data.user.identities.length === 0) {
          setMessage({
            text: "このメールアドレスは既に登録されています。",
            type: "error",
          })
        } else {
          setMessage({
            text: "登録確認メールを送信しました。メールを確認してください。",
            type: "success",
          })

          setTimeout(() => {
            router.push("/login")
          }, 3000)
        }
      }
    } catch (error: unknown) {
      setMessage({ text: error instanceof Error ? error.message : "サインアップに失敗しました", type: "error" })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSignup(e as unknown as React.FormEvent)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-80 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">アカウント登録</h1>

        {message && (
          <div
            className={`p-3 mb-4 rounded ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-3 w-full rounded-md shadow-sm mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="パスワード（6文字以上）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-3 w-full rounded-md shadow-sm mb-3 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <input
            type="password"
            placeholder="パスワード（確認）"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border p-3 w-full rounded-md shadow-sm mb-4 focus:ring-2 focus:ring-indigo-400 outline-none"
            required
          />
          <div className="flex flex-col space-y-3">
            <button
              type="submit"
              className="bg-rose-500 text-white px-6 py-3 rounded-md shadow-md hover:bg-rose-600 transition disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "登録中..." : "アカウント登録"}
            </button>
            <div className="text-sm text-gray-600 mt-4">
              既にアカウントをお持ちの方は
              <Link href="/login" className="text-rose-500 hover:underline ml-1">
                ログイン
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
