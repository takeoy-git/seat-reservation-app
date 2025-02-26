"use client";

import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { timeSlots } from "@/lib/timeSlots";
import { useFetchSeats } from "@/components/useFetchSeats";
import CancelReservationButton from "@/components/CancelReservationButton";
import { AuthProvider } from "@/components/AuthProvider";

export default function SeatReservation() {
  const [selectedReservation, setSelectedReservation] = useState<{ seatNumber: number; timeSlot: string; reservationCode: string | null; visitorName: string | null } | null>(null); // 修正された型
  const [visitorName, setVisitorName] = useState<string>("");
  const [completedReservation, setCompletedReservation] = useState<{ reservationCode: string; ticketNumber: number } | null>(null);
  const [isNameInputVisible, setIsNameInputVisible] = useState<boolean>(false); // 名前入力フォームを表示するフラグ
  const [isCancelMode, setIsCancelMode] = useState<boolean>(false); // キャンセルモード
  const [isCancelSuccessModalVisible, setIsCancelSuccessModalVisible] = useState<boolean>(false); // キャンセル成功モーダル表示
  const [todayDate, setTodayDate] = useState("");
  
  const {seats, setSeats} = useFetchSeats(todayDate);

  // 今日の日付を YYYY-MM-DD 形式で取得
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
      // 予約済みの場合、そのままキャンセルモードに遷移
      setSelectedReservation({
        seatNumber,
        timeSlot,
        reservationCode,
        visitorName: reservedSeat.visitor_name,
      });
      setIsCancelMode(true); // キャンセルモード
    } else {
      // 予約されていない場合
      setSelectedReservation({
        seatNumber,
        timeSlot,
        reservationCode,
        visitorName: null,
      });
      setIsCancelMode(false); // キャンセルモードを無効
      setIsNameInputVisible(true); // 名前入力フォームを表示
    }
  };

  // 予約確定処理
  const handleReserve = async () => {
    if (!selectedReservation) return;
    if (visitorName.trim().length < 1) {
      alert("名前を1文字以上入力してください");
      return;
    }

    const { seatNumber, timeSlot } = selectedReservation;
    const today = new Date().toLocaleDateString("ja-JP").split("T")[0].replace(/-/g, "");

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
      // 予約済みの場合、そのままキャンセルモードに遷移
      setSelectedReservation({
        seatNumber,
        timeSlot,
        reservationCode: existingReservations[0].reservation_code,
        visitorName: existingReservations[0].visitor_name,
      });
      setIsCancelMode(true); // キャンセルモード
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
        return [...prevSeats, { seat_number: seatNumber, reservation_code: reservationCode, visitor_name: visitorName, time_slot: timeSlot }];
      }
      return prevSeats;
    });

    setIsNameInputVisible(false);
  };


  // 戻るボタンの処理
  const handleBack = () => {
    setIsNameInputVisible(false); // 名前入力フォームを非表示にする
    setVisitorName(""); // 名前をリセット
    setIsCancelMode(false); // キャンセルモードを無効化
  };






  return (
    <AuthProvider requireAuth={true}>
    <div className="p-3 w-full mx-auto">
<div className="max-w-4xl mx-auto text-center p-5">
  {/* サブタイトル */}
  <h2 className="text-white text-xl font-light">
    「AWE体験」に着目した、見るだけで美しくなれる映像  </h2>

  {/* メインタイトル */}
  <h1 className="text-white text-5xl font-bold mb-12">    Beauty Retreat Theater  </h1>


  <div className="text-white text-xl font-bold py-3 w-full rounded-lg shadow-lg inline-block bg-black/50 mb-3">
   本日の予約：{todayDate}  </div>
  <p className="text-gray-100 text-lg leading-relaxed">
特別席での鑑賞を希望される方は、座席/時間帯を押して予約をしてください。<br/>
  </p>
</div>

      {/* 予約完了ウィンドウ */}
      {completedReservation && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-lg font-bold text-green-600">予約完了！</h2>
            <p className="text-xl font-bold mt-2">予約番号: {completedReservation.reservationCode}</p>
            <p className="mt-2 text-red-600 font-bold">番号札をお取りください: {completedReservation.ticketNumber}</p>
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

{/* 時刻と座席を並べるテーブルレイアウト */}
<div className="grid grid-cols-[0.3fr_1fr_1fr] gap-2 pb-1 px-5 items-center">
  <div className="text-white font-bold text-xl text-center w-[100px]">時刻</div>
  <div className="text-white font-bold text-xl text-center">階段側席</div>
  <div className="text-white font-bold text-xl text-center">受付側席</div>
</div>
      <div className="grid grid-cols-[0.3fr_1fr_1fr] gap-2 px-5 items-center">
        {/* 1列目：時刻 */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="py-2 rounded h-[50px] w-[100px] text-white  font-bold text-center text-xl">{timeSlot}</div>
          ))}
        </div>

        {/* 2列目：席1の予約ボタン */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex justify-center">
              <button
                className={`p-2 rounded h-[50px] w-[320px] flex items-center justify-center ${seats.some((s) => s.seat_number === 1 && s.time_slot === timeSlot) ? "bg-gray-700 text-white" : "bg-white/80 border"} `} // 横幅を1.2倍に設定, 高さを80%に設定
                onClick={() => handleSelectSeat(1, timeSlot, `${timeSlot}-1`)} // reservationCodeを渡す
              >
                {seats.some((s) => s.seat_number === 1 && s.time_slot === timeSlot) ? `予約済: ${seats.find((s) => s.seat_number === 1 && s.time_slot === timeSlot)?.visitor_name}` : `${timeSlot}　[無料]`}
              </button>
            </div>
          ))}
        </div>

        {/* 3列目：席2の予約ボタン */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex justify-center">
              <button
                className={`p-2 rounded h-[50px] w-[320px] ${seats.some((s) => s.seat_number === 2 && s.time_slot === timeSlot) ? "bg-gray-700 text-white" : "bg-white/80 border"} `} // 横幅を1.2倍に設定, 高さを80%に設定
                onClick={() => handleSelectSeat(2, timeSlot, `${timeSlot}-2`)} // reservationCodeを渡す
              >
                {seats.some((s) => s.seat_number === 2 && s.time_slot === timeSlot) ? `予約済: ${seats.find((s) => s.seat_number === 2 && s.time_slot === timeSlot)?.visitor_name}` : `${timeSlot}　[無料]`}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 名前入力モーダル */}
      {isNameInputVisible && !isCancelMode && (
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
              <button
                className="bg-blue-500 text-white p-2 rounded w-full"
                onClick={handleReserve}
                disabled={visitorName.trim().length < 1} // 名前が未入力なら無効化
              >
                予約する
              </button>
              <button
                className="bg-gray-400 text-white p-2 rounded w-full ml-2"
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
          <div className="w-[40%] bg-white p-6 rounded shadow-lg text-center"> {/* モーダルの横幅を50%に設定 */}
            <h2 className="text-lg font-bold mb-2">予約をキャンセルしますか？<br />予約時の名前を入力してください</h2>
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