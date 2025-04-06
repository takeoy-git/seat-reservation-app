import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";
import { Seat } from "@/types/reservation";

export const useFetchSeats = (todayDate: string | null) => {
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!todayDate) return;
    const fetchSeats = async () => {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase
        .from("reservations")
        .select("seat_number, reservation_code, visitor_name, time_slot")
        .eq("date", todayDate);

      setLoading(false);

      if (error) {
        console.error("予約データの取得に失敗:", error);
        setError("予約データの取得に失敗しました");
        return;
      }

      if (!data || data.length === 0) {
        console.log("本日の予約はありません。");
        setSeats([]);
        return;
      }

      setSeats(data as Seat[]);
    };

    fetchSeats();
  }, [todayDate]);

  return { seats, setSeats, loading, error };
};
