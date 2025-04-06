import { supabase } from "@/lib/supabaseClient";
import { CancelReservationButtonProps } from "@/types/reservation";

export default function CancelReservationButton({
  seatNumber,
  timeSlot,
  todayDate,
  visitorName,
  seats,
  setSeats,
  setIsCancelSuccessModalVisible,
  setIsCancelMode,
}: CancelReservationButtonProps) {
  const handleCancelReservation = async () => {
    if (visitorName.trim().length < 1) {
      alert("名前を入力してください");
      return;
    }

    console.log("🔍 削除リクエスト:", {
      visitorName,
      seatNumber,
      timeSlot,
      todayDate,
    });

    const reservedSeat = seats.find(
      (seat) => seat.seat_number === seatNumber && seat.time_slot === timeSlot
    );

    if (!reservedSeat) {
      alert("該当の予約が見つかりません。");
      return;
    }

    const { data, error } = await supabase
      .from("reservations")
      .delete()
      .eq("visitor_name", visitorName)
      .eq("seat_number", seatNumber)
      .eq("time_slot", timeSlot)
      .eq("date", todayDate)
      .select("*");

    if (error) {
      console.error("❌ 削除エラー:", error);
      alert("キャンセルに失敗しました");
      return;
    }

    if (reservedSeat.visitor_name === visitorName) {
      console.log("✅ 削除成功:", data);
      setSeats(
        seats.filter((seat) => seat.seat_number !== seatNumber || seat.time_slot !== timeSlot)
      );
      setIsCancelSuccessModalVisible(true);
      setIsCancelMode(false);
    } else {
      alert("名前が一致しません。キャンセルできません。");
    }
  };

  return (
    <button
      className="bg-red-500 text-white px-2 py-4 rounded w-full mt-2"
      onClick={handleCancelReservation}
    >
      予約キャンセル
    </button>
  );
}
