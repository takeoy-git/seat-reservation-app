import { useEffect, useState } from "react";
import { Reservation } from "@/types/reservation";
import { supabase } from "@/lib/supabaseClient";


export const useReservations = () => {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [sortKey, setSortKey] = useState<keyof Reservation>("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedData, setEditedData] = useState<Partial<Reservation>>({});

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    const { data, error } = await supabase
      .from("reservations")
      .select("*")
      .order("date", { ascending: true });

    if (error) {
      console.error("データ取得エラー:", error);
      return;
    }
    setReservations(data || []);
  };

  const handleEdit = (id: number) => {
    setEditingId(id);
    const targetRow = reservations.find((res) => res.id === id);
    if (targetRow) {
      setEditedData(targetRow);
    }
  };

  const handleChange = (field: keyof Reservation, value: string | number) => {
    setEditedData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editedData.visitor_name || !editedData.time_slot || !editedData.date) {
      alert("必須項目を入力してください。");
      return;
    }

    if (typeof editedData.seat_number !== "number") {
      alert("座席番号は数値である必要があります。");
      return;
    }

    const { error } = await supabase
      .from("reservations")
      .update(editedData)
      .eq("id", editingId);

    if (error) {
      console.error("更新エラー:", error);
    } else {
      setReservations((prev) =>
        prev.map((res) => (res.id === editingId ? { ...res, ...editedData } : res))
      );
      setEditingId(null);
      setEditedData({});
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("この予約を削除しますか？")) return;

    const { error } = await supabase.from("reservations").delete().eq("id", id);

    if (error) {
      console.error("削除エラー:", error);
    } else {
      setReservations((prev) => prev.filter((res) => res.id !== id));
    }
  };

  const handleSort = (key: keyof Reservation) => {
    const newOrder = sortKey === key && sortOrder === "asc" ? "desc" : "asc";
    setSortKey(key);
    setSortOrder(newOrder);
    
    setReservations((prev) =>
      [...prev].sort((a, b) => {
        const aValue = a[key];
        const bValue = b[key];

        if (typeof aValue === "number" && typeof bValue === "number") {
          return newOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
        if (typeof aValue === "string" && typeof bValue === "string") {
          return newOrder === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }
        return 0;
      })
    );
  };



  const getWeekdayStats = () => {
    const weekdayCount: { [key: string]: number } = {};
    reservations.forEach((res) => {
      const day = new Date(res.date).toLocaleDateString("ja-JP", {
        weekday: "long",
      });
      weekdayCount[day] = (weekdayCount[day] || 0) + 1;
    });

    return Object.keys(weekdayCount).map((day) => ({
      day,
      count: weekdayCount[day],
    }));
  };


  return {
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
    getWeekdayStats,
  };
};
