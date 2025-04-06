"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { timeSlots } from "@/lib/timeSlots";
import { useFetchSeats } from "@/components/useFetchSeats";
import { AuthProvider } from "@/components/AuthProvider";
import CancelReservationButton from "@/components/CancelReservationButton";
import ReservationTable from "@/components/ReservationTable";
import ReservePageHeaderSection from "@/components/ReservePageHeaderSection";

export default function SeatReservation() {
  const [selectedReservation, setSelectedReservation] = useState<{
    seatNumber: number;
    timeSlot: string;
    reservationCode: string | null;
    visitorName: string | null;
  } | null>(null);
  const [visitorName, setVisitorName] = useState<string>("");
  const [completedReservation, setCompletedReservation] = useState<{
    reservationCode: string;
    ticketNumber: number;
  } | null>(null);
  const [isNameInputVisible, setIsNameInputVisible] = useState<boolean>(false);
  const [isCancelMode, setIsCancelMode] = useState<boolean>(false);
  const [isCancelSuccessModalVisible, setIsCancelSuccessModalVisible] = useState<boolean>(false);
  const [todayDate, setTodayDate] = useState("");

  const { seats, setSeats } = useFetchSeats(todayDate);

  useEffect(() => {
    const today = new Date().toLocaleDateString("ja-JP").split("T")[0]; // YYYY-MM-DD
    console.log("Today's Date:", today);
    setTodayDate(today);
  }, []);

  const getTicketNumber = (timeSlot: string, seatNumber: number) => {
    const timeIndex = timeSlots.indexOf(timeSlot);
    return timeIndex * 2 + seatNumber;
  };

  // 時刻ボタンが押されたときに名前入力フォームを表示する
  const handleSelectSeat = (seatNumber: number, timeSlot: string, reservationCode: string) => {
    const reservedSeat = seats.find(
      (seat) => seat.seat_number === seatNumber && seat.time_slot === timeSlot
    );

    if (reservedSeat) {
      setSelectedReservation({
        seatNumber,
        timeSlot,
        reservationCode,
        visitorName: reservedSeat.visitor_name,
      });
      setIsCancelMode(true);
    } else {
      setSelectedReservation({
        seatNumber,
        timeSlot,
        reservationCode,
        visitorName: null,
      });
      setIsCancelMode(false);
      setIsNameInputVisible(true);
    }
  };

  const handleReserve = async () => {
    if (!selectedReservation) return;
    if (visitorName.trim().length < 1) {
      alert("名前を1文字以上入力してください");
      return;
    }

    const { seatNumber, timeSlot } = selectedReservation;
    const today = new Date().toLocaleDateString("ja-JP").split("T")[0].replace(/-/g, "");
    const dayOfWeek = new Date().toLocaleDateString("ja-JP", { weekday: "long" });

    const { data: existingReservations, error } = await supabase
      .from("reservations")
      .select("reservation_code, seat_number, time_slot, visitor_name")
      .eq("time_slot", timeSlot)
      .eq("seat_number", seatNumber)
      .eq("date", today)
      .limit(1);

    if (error) {
      console.error("予約情報の取得に失敗しました:", error);
      alert("予約情報の取得に失敗しました");
      return;
    }

    if (existingReservations.length > 0) {
      setSelectedReservation({
        seatNumber,
        timeSlot,
        reservationCode: existingReservations[0].reservation_code,
        visitorName: existingReservations[0].visitor_name,
      });
      setIsCancelMode(true);
      return;
    }

    const reservationCode = `${timeSlot}-${seatNumber}-${today}`;
    const ticketNumber = getTicketNumber(timeSlot, seatNumber);

    const { error: insertError } = await supabase.from("reservations").insert({
      time_slot: timeSlot,
      seat_number: seatNumber,
      reservation_code: reservationCode,
      visitor_name: visitorName,
      date: today,
      created_at: new Date(),
      day_of_week: dayOfWeek,
    });

    if (insertError) {
      console.error("予約の保存に失敗しました:", insertError);
      alert("予約に失敗しました");
      return;
    }

    setCompletedReservation({ reservationCode, ticketNumber });
    setSelectedReservation(null);
    setVisitorName("");

    setSeats((prevSeats) => {
      if (!prevSeats.find((s) => s.seat_number === seatNumber && s.time_slot === timeSlot)) {
        return [
          ...prevSeats,
          {
            seat_number: seatNumber,
            reservation_code: reservationCode,
            visitor_name: visitorName,
            time_slot: timeSlot,
          },
        ];
      }
      return prevSeats;
    });

    setIsNameInputVisible(false);
  };

  const handleBack = () => {
    setIsNameInputVisible(false);
    setVisitorName("");
    setIsCancelMode(false);
  };

  return (
    <AuthProvider requireAuth={true}>
      <div className="p-3 w-full mx-auto">
        <ReservePageHeaderSection todayDate={todayDate} />

        <ReservationTable seats={seats} timeSlots={timeSlots} handleSelectSeat={handleSelectSeat} />

        {/* 予約完了ウィンドウ */}
        {completedReservation && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-lg font-bold text-green-600">予約完了！</h2>
              <p className="text-xl font-bold mt-2">
                予約番号: {completedReservation.reservationCode}
              </p>
              <p className="mt-2 text-red-600 font-bold">
                番号札をお取りください: {completedReservation.ticketNumber}
              </p>
              <button
                className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
                onClick={() => setCompletedReservation(null)}
              >
                閉じる
              </button>
            </div>
          </div>
        )}

        {/* 予約キャンセル後の成功メッセージ */}
        {isCancelSuccessModalVisible && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded shadow-lg text-center">
              <h2 className="text-lg font-bold text-green-600">予約がキャンセルされました。</h2>
              <button
                className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
                onClick={() => setIsCancelSuccessModalVisible(false)}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* 名前入力モーダル */}
        {isNameInputVisible && !isCancelMode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[40%] bg-white p-8 rounded-lg shadow-xl text-center">
              <div className="text-left bg-red-100 p-4 rounded-lg border-l-4 border-red-500">
                <p className="text-red-600 font-bold">
                  ⚠️
                  以下の注意事項を読み、同意される方は氏名を入力し「予約する」ボタンを押してください。
                </p>
                <ul className="text-sm text-gray-800 mt-2 space-y-1">
                  <li>
                    <strong>・妊娠中の方</strong>、またはその可能性のある方は利用できません
                  </li>
                  <li>
                    <strong>・高血圧や心臓疾患のある方</strong>は利用できません
                  </li>
                  <li>
                    <strong>・頭、首、背中、足等に怪我</strong>
                    のある方、または不自由な方は利用できません
                  </li>
                  <li>
                    <strong>・乗り物酔いしやすい方</strong>
                    、飲酒・薬物の影響下にある方は利用できません
                  </li>
                  <li>
                    <strong>・香りや煙、光などの刺激に弱い方</strong>
                    、アレルギーのある方は利用できません
                  </li>
                </ul>
              </div>

              <h2 className="text-lg font-bold mt-6 mb-3">氏名を入力してください</h2>
              <input
                type="text"
                className="border border-gray-300 p-3 w-full rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="例：山田"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
              />

              <div className="flex justify-between items-center mt-6">
                <button
                  className={`p-3 w-1/2 rounded-lg font-bold transition-colors ${
                    visitorName.trim().length < 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-blue-500 text-white hover:bg-blue-600"
                  }`}
                  onClick={handleReserve}
                  disabled={visitorName.trim().length < 1}
                >
                  予約する
                </button>
                <button
                  className="p-3 w-1/2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors ml-2"
                  onClick={handleBack}
                >
                  戻る
                </button>
              </div>
            </div>
          </div>
        )}

        {/* キャンセルモード */}
        {isCancelMode && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-[40%] bg-white p-6 rounded shadow-lg text-center">
              {" "}
              {/* モーダルの横幅を50%に設定 */}
              <h2 className="text-lg font-bold mb-2">
                予約をキャンセルしますか？
                <br />
                予約時の名前を入力してください
              </h2>
              <input
                type="text"
                className="border p-2 w-full mt-2"
                placeholder="名前を入力"
                value={visitorName}
                onChange={(e) => setVisitorName(e.target.value)}
              />
              <div className="flex justify-between mt-4">
                {selectedReservation && (
                  <CancelReservationButton
                    visitorName={visitorName}
                    seatNumber={selectedReservation.seatNumber}
                    timeSlot={selectedReservation.timeSlot}
                    todayDate={todayDate}
                    seats={seats}
                    setSeats={setSeats}
                    setIsCancelSuccessModalVisible={setIsCancelSuccessModalVisible} // 関数として渡す
                    setIsCancelMode={setIsCancelMode}
                  />
                )}
                <button
                  className="bg-gray-400 text-white px-2 py-4 rounded w-full mt-2 mx-3"
                  onClick={handleBack}
                >
                  戻る
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthProvider>
  );
}
