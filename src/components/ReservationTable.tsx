import React from "react";

type ReservationTableProps = {
  seats: {
    seat_number: number;
    time_slot: string;
    visitor_name: string | null; // ← 修正
  }[];
  timeSlots: string[];
  handleSelectSeat: (seatNumber: number, timeSlot: string, reservationCode: string) => void;
};

const ReservationTable: React.FC<ReservationTableProps> = ({ timeSlots, seats, handleSelectSeat }) => {
  return (
    <div>
      <div className="grid grid-cols-[0.3fr_1fr_1fr] gap-2 pb-1 px-5 items-center">
        <div className="text-white font-bold text-xl text-center w-[100px]">時刻</div>
        <div className="text-white font-bold text-xl text-center">階段側席</div>
        <div className="text-white font-bold text-xl text-center">受付側席</div>
      </div>

      <div className="grid grid-cols-[0.3fr_1fr_1fr] gap-2 px-5 items-center">
        {/* 1列目：時刻 */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="py-2 rounded h-[50px] w-[100px] text-white font-bold text-center text-xl">{timeSlot}</div>
          ))}
        </div>

        {/* 2列目：席1 */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex justify-center">
              <button
                className={`p-2 rounded h-[50px] w-[320px] flex items-center justify-center ${seats.some((s) => s.seat_number === 1 && s.time_slot === timeSlot) ? "bg-gray-700 text-white" : "bg-white/80 border"}`}
                onClick={() => handleSelectSeat(1, timeSlot, `${timeSlot}-1`)}
              >
                {seats.some((s) => s.seat_number === 1 && s.time_slot === timeSlot)
                  ? `予約済: ${seats.find((s) => s.seat_number === 1 && s.time_slot === timeSlot)?.visitor_name}`
                  : `${timeSlot} [無料]`}
              </button>
            </div>
          ))}
        </div>

        {/* 3列目：席2 */}
        <div className="flex flex-col gap-3">
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="flex justify-center">
              <button
                className={`p-2 rounded h-[50px] w-[320px] ${seats.some((s) => s.seat_number === 2 && s.time_slot === timeSlot) ? "bg-gray-700 text-white" : "bg-white/80 border"}`}
                onClick={() => handleSelectSeat(2, timeSlot, `${timeSlot}-2`)}
              >
                {seats.some((s) => s.seat_number === 2 && s.time_slot === timeSlot)
                  ? `予約済: ${seats.find((s) => s.seat_number === 2 && s.time_slot === timeSlot)?.visitor_name}`
                  : `${timeSlot} [無料]`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReservationTable;