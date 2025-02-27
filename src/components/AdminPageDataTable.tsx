import React, { useState } from "react";
import { Reservation } from "@/types/reservation";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { Dot } from "lucide-react"; // ドットアイコン


type AdminPageDataTableProps = {
  reservations: Reservation[];
  sortKey: keyof Reservation;
  sortOrder: "asc" | "desc";
  handleSort: (key: keyof Reservation) => void;
  handleEdit: (id: number) => void;
  handleSave: () => void;
  handleDelete: (id: number) => void;
  handleChange: (field: keyof Reservation, value: string | number) => void;
  editingId: number | null;
  editedData: Partial<Reservation>;
};

const AdminPageDataTable: React.FC<AdminPageDataTableProps> = ({
  reservations,
  sortKey,
  sortOrder,
  handleSort,
  handleEdit,
  handleSave,
  handleDelete,
  handleChange,
  editingId,
  editedData,
}) => {

 const exportMultiSheetExcel = () => {
  const ws1 = XLSX.utils.json_to_sheet([
    { "予約ID": "id", "名前": "visitor_name", "時間枠": "time_slot", "日付": "date", "曜日": "day_of_week", "座席番号": "seat_number", "作成日時": "created_at" },
    ...reservations.map(({ id, visitor_name, time_slot, date, seat_number, created_at }) => ({
      予約ID: id,
      名前: visitor_name,
      時間枠: time_slot,
      日付: date,
      曜日: new Date(date).toLocaleDateString("ja-JP", { weekday: "long" }),
      座席番号: seat_number === 1 ? "階段側席" : seat_number === 2 ? "受付側席" : seat_number,
      作成日時: created_at
    }))
  ]);

  const ws2 = XLSX.utils.json_to_sheet(timeSlotStats());
  const ws3 = XLSX.utils.json_to_sheet(dayOfWeekData);
  const ws4 = XLSX.utils.json_to_sheet(seatStats());

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws1, "予約データ");
  XLSX.utils.book_append_sheet(wb, ws2, "時間帯別予約数");
  XLSX.utils.book_append_sheet(wb, ws3, "曜日別予約数");
  XLSX.utils.book_append_sheet(wb, ws4, "座席別予約数");

  XLSX.writeFile(wb, "reservations.xlsx");
};
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  const timeSlotStats = () => {
    const timeCount: { [key: string]: number } = {};
    reservations.forEach((res) => {
      timeCount[res.time_slot] = (timeCount[res.time_slot] || 0) + 1;
    });

    return Object.keys(timeCount).map((time) => ({
      time,
      count: timeCount[time],
    }));
  };

  const seatStats = () => {
    const seatCount: { [key: string]: number } = {};
    reservations.forEach((res) => {
      seatCount[res.seat_number] = (seatCount[res.seat_number] || 0) + 1;
    });

    return Object.keys(seatCount).map((seat) => ({
      seat,
      count: seatCount[seat],
    }));
  };

  // 曜日別の予約データ
  const dayOfWeekStats = reservations.reduce((acc, res) => {
    const day = new Date(res.date).toLocaleDateString("ja-JP", { weekday: "long" });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as { [key: string]: number });

  const dayOfWeekData = Object.keys(dayOfWeekStats).map(day => ({
    day,
    count: dayOfWeekStats[day]
  }));

  const charts = [
    { title: "時間帯別予約数", data: timeSlotStats(), dataKey: "time", fileName: "time_slots.xlsx" },
    { title: "座席別予約数", data: seatStats(), dataKey: "seat", fileName: "seat_stats.xlsx" },
    { title: "曜日別予約数", data: dayOfWeekData, dataKey: "day", fileName: "day_of_week.xlsx" }
  ];
  




  return (
   <>
   <div className="p-6 shadow-md rounded-lg w-full max-w-3xl mx-auto flex flex-col items-center">
      {/* ヘッダー */}
        <h1 className="text-white text-4xl p-6 font-bold">管理者ページ</h1>

      {/* テーブル */}
      <table className="w-full border-collapse border border-gray-400 text-xl">

      <thead>
  <tr className="bg-gray-100 border-b border-gray-400">
    {["id", "visitor_name", "time_slot", "date", "day_of_week", "seat_number", "created_at"].map((key) => (
      <th key={key} className={`border px-4 py-2 cursor-pointer ${sortKey === key ? "bg-blue-200" : ""}`} onClick={() => handleSort(key as keyof Reservation)}>
        {key.toUpperCase()} {sortKey === key && (sortOrder === "asc" ? "▲" : "▼")}
      </th>
    ))}
    <th className="border px-4 py-2">操作</th>
  </tr>
</thead>

        <tbody>
          {reservations.map((res) => (
            <tr key={res.id} className="border hover:bg-gray-50">
              <td className="border px-4 py-2 bg-white">{res.id}</td>
              <td className="border px-4 py-2 bg-white">
                {editingId === res.id ? (
                  <input type="text" value={editedData.visitor_name || ""} onChange={(e) => handleChange("visitor_name", e.target.value)} className="border p-1 w-full" />
                ) : (
                  res.visitor_name
                )}
              </td>
              <td className="border px-4 py-2 bg-white">
                {editingId === res.id ? (
                  <input type="text" value={editedData.time_slot || ""} onChange={(e) => handleChange("time_slot", e.target.value)} className="border p-1 w-full" />
                ) : (
                  res.time_slot
                )}
              </td>
              <td className="border px-4 py-2 bg-white">{res.date}</td>
              <td className="border px-4 py-2 bg-white">{new Date(res.date).toLocaleDateString("ja-JP", { weekday: "short" })}</td>
              <td className="border px-4 py-2 bg-white">
  {res.seat_number === 1 ? "階段側席" : res.seat_number === 2 ? "受付側席" : res.seat_number}
</td>
              <td className="border px-4 py-2 bg-white">{res.created_at}</td>
              <td className="border px-4 py-2 bg-white">
  <div className="flex gap-2 items-center">
    {editingId === res.id ? (
      <Button onClick={handleSave} className="bg-green-500 text-white px-3 py-1 rounded">保存</Button>
    ) : (
      <Button onClick={() => handleEdit(res.id)} className="bg-blue-500 text-white px-3 py-1 rounded">編集</Button>
    )}
    <Button onClick={() => handleDelete(res.id)} className="bg-red-500 text-white px-3 py-1 rounded">削除</Button>
  </div>
</td>
            </tr>
          ))}
        </tbody>
      </table>
<div className="p-6">
      <Button size="lg" onClick={exportMultiSheetExcel} className="bg-blue-500 text-white px-4 py-2 rounded">
  エクセル出力
</Button>
</div>

      {/* グラフのカルーセル */}
      <div className="w-full max-w-3xl bg-white shadow-md p-6 mt-6 rounded-lg">
         <Carousel className="relative">
           <div onClick={() => setCurrentSlide((prev) => (prev + 1) % charts.length)}>

          <CarouselContent>
            {charts.map((chart, index) => (
              <CarouselItem key={index} className="flex flex-col items-center">
                <h2 className="text-xl font-bold mb-4">{chart.title}</h2>
                <BarChart width={600} height={300} data={chart.data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
          dataKey={chart.dataKey} 
          tickFormatter={
            chart.title === "座席別予約数" 
              ? (seat) => seat === "1" ? "階段側席" : seat === "2" ? "受付側席" : seat
              : undefined
          } 
        />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill={index === 0 ? "#82ca9d" : index === 1 ? "#8884d8" : "#ffcc00"} />
                </BarChart>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          </div>
        </Carousel>

        {/* カルーセルのインジケーター */}
        <div className="flex justify-center mt-4">
          {charts.map((_, index) => (
            <Dot
              key={index}
              size={60}
              className={`mx-1 ${currentSlide === index ? "text-rose-500" : "text-gray-400"}`}
            />
          ))}
        </div>

      </div>

    </div>
    </>
  );
};

export default AdminPageDataTable;
