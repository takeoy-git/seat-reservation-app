export type Seat = {
  seat_number: number;
  reservation_code: string | null;
  visitor_name: string | null;
  time_slot: string;
};

export interface CancelReservationButtonProps {
  seatNumber: number;
  timeSlot: string;
  todayDate: string;
  visitorName: string;
  seats: Seat[];
  setSeats: React.Dispatch<React.SetStateAction<Seat[]>>;
  setIsCancelSuccessModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setIsCancelMode: React.Dispatch<React.SetStateAction<boolean>>;
}

export type Reservation = {
  id: number;
  visitor_name: string;
  date: string;
  day_of_week?: string;
  time_slot: string;
  seat_number: number;
  created_at: string;
  remark?: string; 
};