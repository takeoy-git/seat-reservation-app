"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Header() {
  const router = useRouter();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pendingDestination, setPendingDestination] = useState<string | null>(null);

  // すべてのページ遷移で簡易のパスワード認証を要求。イタズラ防止目的の認証のためフロントエンドからパスワードが見えるが目的と照らして問題なし
  const handleNavigation = (destination: string) => {
    setPassword(""); 
    setError(""); 
    setPendingDestination(destination); 
    setIsPasswordModalOpen(true); 
  };

  const handlePasswordSubmit = () => {
    if (password === "1234") {
      setIsPasswordModalOpen(false);
      if (pendingDestination) {
        router.push(pendingDestination); 
      }
    } else {
      setError("パスコードが間違っています");
      setPassword(""); 
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
        className="fixed top-0 w-full h-[60px] bg-cover bg-center z-50"
      >
        <div className="flex justify-between items-center bg-opacity-70 bg-black p-1">
        <div className="flex w-full">
  <button
    className="w-1/3 text-gray-700 text-sm px-2 py-1 border-none bg-transparent opacity-20 hover:opacity-100 transition-opacity"
    onClick={() => handleNavigation("/admin")}
  >
    Admin
  </button>
  <button
    className="w-1/3 text-gray-700 text-sm px-2 py-1 border-none bg-transparent opacity-20 hover:opacity-100 transition-opacity"
    onClick={() => handleNavigation("/reserve")}
  >
    Reserve
  </button>
  <button
    className="w-1/3 text-gray-700 text-sm px-2 py-1 border-none bg-transparent opacity-20 hover:opacity-100 transition-opacity"
    onClick={() => handleNavigation("/maintenance")}
  >
    Maintenance
  </button>
</div>

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
