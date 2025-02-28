"use client";

import { AuthProvider, useAuth } from "@/components/AuthProvider";
import AdminPageDataTable from "@/components/AdminPageDataTable";
import { useReservations } from "@/components/useReservations";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
  } = useReservations();
  
  const { signOut } = useAuth(); // ✅ useAuth を呼び出して signOut を取得
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(); // ログアウト処理
    router.push("/login"); // ログインページにリダイレクト
  };




return (
<AuthProvider  requireAuth={true}>

<AdminPageDataTable
  reservations={reservations}
  sortKey={sortKey}
  sortOrder={sortOrder}
  handleSort={handleSort}
  handleEdit={handleEdit}
  handleSave={handleSave}
  handleDelete={handleDelete}
  handleChange={handleChange}
  editingId={editingId}
  editedData={editedData}
/>

 <Button onClick={() => handleLogout()} className="bg-red-500 text-white px-4 py-2 rounded">
          ログアウト
       </Button>

    </AuthProvider>
  );
};

export default AdminPage;
