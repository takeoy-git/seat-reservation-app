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
  
  const auth = useAuth(); // ✅ useAuth() を変数に格納
  const router = useRouter();

  const handleLogout = async () => {
    if (auth?.signOut) { // ✅ auth が null でないかチェック
      await auth.signOut();
      router.push("/login");
    }
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
