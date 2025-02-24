export type Seat = {
    id: number;
    number: string; // 座席番号
    isReserved: boolean;
  };
  
  export interface Reservation {
    id: string;
    userId: string;
    seatId: number;
    time: string; // 予約時間（例: "14:00"）
  }
  