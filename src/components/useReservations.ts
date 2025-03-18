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

 
  const addNewReservation = async (newReservationData: Partial<Reservation>) => {
    if (!newReservationData.date || !newReservationData.time_slot || newReservationData.seat_number === undefined) {
      alert("日付、時間枠、座席番号は必須です。");
      return;
    }
  
    // 予約がすでに存在するか確認
    const { data: existingReservations, error: fetchError } = await supabase
      .from("reservations")
      .select("id") 
      .eq("date", newReservationData.date)
      .eq("time_slot", newReservationData.time_slot)
      .eq("seat_number", newReservationData.seat_number);
  
    if (fetchError) {
      console.error("予約の確認中にエラーが発生しました:", fetchError);
      alert("予約の確認に失敗しました");
      return;
    }
  
    if (existingReservations.length > 0) {
      alert("この座席はすでに予約されています。他の座席を選んでください。");
      return;
    }
  

    const { data, error } = await supabase
      .from("reservations")
      .insert([newReservationData]);
  
    if (error) {
      console.error("新規予約の保存に失敗しました:", error.message);
      alert(`新規予約の保存に失敗しました: ${error.message}`);
      return;
    }
  
    if (data) {
      setReservations((prev) => [...prev, ...data]);
      alert("予約が完了しました！");
    }
  };
  

  // 予約データをソートする関数
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
    addNewReservation,
    fetchReservations,
  };
};
