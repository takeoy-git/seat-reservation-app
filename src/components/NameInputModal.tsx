import React from "react";

interface NameInputModalProps {
  visitorName: string;
  setVisitorName: (name: string) => void;
  handleReserve: () => void;
  handleBack: () => void;
}

const NameInputModal: React.FC<NameInputModalProps> = ({ visitorName, setVisitorName, handleReserve, handleBack }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-[50%] bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-lg font-bold mb-2">名前を入力してください</h2>
        <input
          type="text"
          className="border p-2 w-full mt-2"
          placeholder="名前を入力"
          value={visitorName}
          onChange={(e) => setVisitorName(e.target.value)}
        />
        <div className="flex justify-between mt-4">
          <button className="bg-blue-500 text-white p-2 rounded w-full" onClick={handleReserve} disabled={!visitorName.trim()}>
            予約する
          </button>
          <button className="bg-gray-400 text-white p-2 rounded w-full ml-2" onClick={handleBack}>
            戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default NameInputModal;
