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
  time_slot: string;
  date: string;
  seat_number: number;
  created_at: string;
};