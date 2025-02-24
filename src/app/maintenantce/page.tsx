"use client";

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-white text-center px-6 pt-[60px]">
      {/* メンテナンスメッセージ */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
        <h1 className="text-4xl font-bold mb-4">🚧 メンテナンス中 🚧</h1>
        <p className="text-lg mb-2">Maintenance in Progress</p>
        <p className="text-sm text-gray-400">
          ご不便をおかけしますが、しばらくお待ちください。
        </p>
      </div>
    </div>
  );
}