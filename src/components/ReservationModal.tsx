import React from "react";

interface ReservationModalProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
}

const ReservationModal: React.FC<ReservationModalProps> = ({ message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg text-center">
        <h2 className="text-lg font-bold text-green-600">{message}</h2>
        <button className="mt-4 bg-blue-500 text-white p-2 rounded w-full" onClick={onClose}>
          閉じる
        </button>
      </div>
    </div>
  );
};

export default ReservationModal;
