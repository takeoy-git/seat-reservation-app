"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname(); // ✅ usePathname() を使用して、Next.js のルーターから確実に取得
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    console.log("Current Path Updated:", pathname);
  }, [pathname]);

  const handleNavigation = (destination: string) => {
    console.log("Navigating from:", pathname, "to:", destination);

    if ((pathname === "/reserve" || pathname === "/maintenance") && destination === "/") {
      setPassword(""); // 初期化
      setError(""); // エラーメッセージをリセット
      setIsPasswordModalOpen(true);
      console.log("Password modal should open");
    } else {
      router.push(destination);
      console.log("Navigating without password");
    }
  };

  const handlePasswordSubmit = () => {
    if (password === "1234") {
      setIsPasswordModalOpen(false);
      router.push("/");
    } else {
      setError("パスコードが間違っています");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handlePasswordSubmit();
    }
  };

  return (
    <>
      <header
        className="fixed top-0 w-full bg-cover bg-center z-50"
        style={{ backgroundImage: "url('/backpattern.png')" }}
      >
        <div className="flex justify-between items-center bg-opacity-70 bg-black p-1">
          <h1 className="text-gray-500 text-s">Seat Reserve App</h1>
          <button
            className="text-gray-600 border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors ml-2"
            onClick={() => handleNavigation("/")}
          >
            Top
          </button>
        </div>
      </header>

      {/* パスワードモーダル */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center w-80">
            <h2 className="text-xl font-bold text-white mb-4">パスコード入力</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="p-2 w-full border border-gray-600 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="4桁のパスコード"
              maxLength={4}
            />
            <div className="flex justify-between mt-4">
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded transition duration-200"
              >
                キャンセル
              </button>
              <button
                onClick={handlePasswordSubmit}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200"
              >
                確定
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}