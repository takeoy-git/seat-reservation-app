"use client";

import { AuthProvider, useAuth } from "@/components/AuthProvider";
import AdminPageDataTable from "@/components/AdminPageDataTable";
import { useReservations } from "@/components/useReservations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface NewReservationData {
  visitor_name: string;
  date: string;
  time_slot: string;
  seat_number: number[];
  remark: string;
}

const AdminPage = () => {
  const {
    reservations,
    sortKey,
    sortOrder,
    editingId,
    editedData,
    handleSort,
    handleEdit,
    handleSave,
    handleDelete,
    handleChange,
    addNewReservation,
    fetchReservations,
  } = useReservations();
  
  const { signOut } = useAuth();
  const router = useRouter();
  
  const handleEditClick = (id: number) => {
    handleEdit(id); 
  };

  const handleDeleteClick = (id: number) => {
    if (confirm("本当に削除しますか？")) {
      handleDelete(id); 
    }
  };
  
  const handleLogout = async () => {
    await signOut();
    router.push("/login");
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newReservationData, setNewReservationData] = useState<NewReservationData>({
    visitor_name: "",
    date: "",
    time_slot: "10:30",
    seat_number: [],
    remark: ""
  });

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setNewReservationData((prevData) => ({ ...prevData, date: today }));
  }, []);

  const handleAddNewReservation = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleNewReservationChange = (field: string, value: string | number | number[]) => {
    setNewReservationData(prev => ({ ...prev, [field]: value }));
  };

  const handleCheckboxChange = (seatNumber: number) => {
    setNewReservationData(prev => {
      const newSeatNumbers = prev.seat_number.includes(seatNumber)
        ? prev.seat_number.filter(num => num !== seatNumber)
        : [...prev.seat_number, seatNumber];
      return { ...prev, seat_number: newSeatNumbers };
    });
  };

  const handleCreateNewReservation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newReservationData.seat_number.length === 0) {
      alert("少なくとも1つの座席を選択してください。");
      return;
    }
  
    // 予約の重複チェック
    const isDuplicate = reservations.some((reservation) =>
      newReservationData.seat_number.some((seat) =>
        reservation.date === newReservationData.date &&
        reservation.time_slot === newReservationData.time_slot &&
        reservation.seat_number === seat 
      )
    );
  
    if (isDuplicate) {
      alert("この時間枠の座席は既に予約されています。");
      return;
    }
  
    for (const seatNumber of newReservationData.seat_number) {
      await addNewReservation({ ...newReservationData, seat_number: seatNumber });
    }
  
    await fetchReservations(); 
    closeModal();
  };
  

  return (
    <AuthProvider requireAuth={true}>
 <div className="flex flex-col items-center  h-screen">

  
        <h1 className="text-2xl font-bold mb-4 justify-center items-centeritems-center text-white">管理画面</h1>
        <Button onClick={handleAddNewReservation} className="bg-green-500 text-white px-4 py-2 rounded mb-1">
          新規予約追加
        </Button>

        <AdminPageDataTable
          reservations={reservations}
          sortKey={sortKey}
          sortOrder={sortOrder}
          handleSort={handleSort}
          handleSave={handleSave}
          handleChange={handleChange}
          editingId={editingId}
          editedData={editedData}
          handleEdit={handleEditClick}  
          handleDelete={handleDeleteClick} 
        />
        <Button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded mt-4">
          ログアウト
        </Button>

        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded shadow-md w-[40%]">
              <h2 className="text-xl mb-4">新規予約</h2>
              <form onSubmit={handleCreateNewReservation}>
                <label className="block mb-2">
                  名前:
                  <input type="text" className="block w-full mt-1 p-2 border rounded" onChange={(e) => handleNewReservationChange('visitor_name', e.target.value)} required />
                </label>
                <label className="block mb-2">
                  日付:
                  <input type="date" className="block w-full mt-1 p-2 border rounded" value={newReservationData.date} onChange={(e) => handleNewReservationChange('date', e.target.value)} required />
                </label>
                <label className="block mb-2">
                  時間枠:
                  <select className="block w-full mt-1 p-2 border rounded" value={newReservationData.time_slot} onChange={(e) => handleNewReservationChange('time_slot', e.target.value)} required>
                    {Array.from({ length: 33 }, (_, i) => {
                      const hour = String(6 + Math.floor(i / 2)).padStart(2, '0');
                      const minute = i % 2 === 0 ? '00' : '30';
                      const time = `${hour}:${minute}`;
                      const isRed = (i < 8 || i >= 26);
                      return <option key={time} value={time} style={{ color: isRed ? 'red' : 'black', textDecoration: isRed ? 'line-through' : 'none' }}>{time}</option>;
                    })}
                  </select>
                </label>
                <label className="block mb-2">
                  座席番号:
                  <div className="flex space-x-4 mt-1">
                    <label>
                      <input type="checkbox" checked={newReservationData.seat_number.includes(1)} onChange={() => handleCheckboxChange(1)} />
                      階段側席
                    </label>
                    <label>
                      <input type="checkbox" checked={newReservationData.seat_number.includes(2)} onChange={() => handleCheckboxChange(2)} />
                      受付側席
                    </label>
                  </div>
                </label>
                <div className="flex justify-end mt-4">
                  <Button type="button" onClick={closeModal} className="bg-gray-500 text-white px-4 py-2 rounded mr-2">
                    キャンセル
                  </Button>
                  <Button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                    追加
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AuthProvider>
  );
};

export default AdminPage;