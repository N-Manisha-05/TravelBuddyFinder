import React from "react";

const DiaryCard = ({ entry }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden w-full sm:w-80 hover:shadow-xl transition-all">
      {entry.photo && (
        <img
          src={`${import.meta.env.VITE_BACKEND_URL}${entry.photo}`}
          alt="Diary"
          className="w-full h-48 object-cover rounded-lg mt-2"
        />
      )}

      <div className="p-4">
        <h3 className="text-xl font-bold text-purple-700">{entry.place}</h3>
        {entry.date && <p className="text-sm text-gray-500 mb-2">{entry.date}</p>}
        <p className="text-gray-700 mb-2">{entry.experience}</p>
        {entry.views && (
          <p className="italic text-gray-600 border-t pt-2">“{entry.views}”</p>
        )}
      </div>
    </div>
  );
};

export default DiaryCard;
