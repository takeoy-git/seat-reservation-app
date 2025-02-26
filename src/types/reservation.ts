export type Seat = {
  seat_number: number;
  reservation_code: string | null;
  visitor_name: string | null;
  time_slot: string;
  seats?: Seat[]; 
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
