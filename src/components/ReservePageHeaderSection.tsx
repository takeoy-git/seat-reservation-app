import React from "react";

interface HeaderSectionProps {
  todayDate: string;
}

const ReservePageHeaderSection: React.FC<HeaderSectionProps> = ({ todayDate }) => {
  return (
    <div className="max-w-4xl mx-auto text-center p-5">
      <h2 className="text-white text-xl font-light">
        「AWE体験」に着目した、見るだけで美しくなれる映像
      </h2>

      <h1 className="text-white text-5xl font-bold mb-12">Beauty Retreat Theater</h1>

      <div className="text-white text-xl font-bold py-3 w-full rounded-lg shadow-lg inline-block bg-black/50 mb-3">
        本日の予約：{todayDate}
      </div>
      <p className="text-gray-100 text-lg leading-relaxed">
        特別席での鑑賞を希望される方は、座席/時間帯を押して予約をしてください。
        <br />
      </p>
    </div>
  );
};

export default ReservePageHeaderSection;
