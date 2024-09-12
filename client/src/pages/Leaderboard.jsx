import React, { useEffect, useState } from "react";

const Leaderboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const fetchTopScores = async () => {
      const response = await fetch("http://localhost:8000/leaderboard");
      const data = await response.json();
      setScores(data);
    };

    fetchTopScores();
  }, []);

  return (
    <div className="w-[80vw] flex flex-col gap-10">
      <h1>Leaderboard - Top 10 Global</h1>

      <table className="min-w-full text-xl bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="py-4 px-4 text-left">#</th>
            <th className="py-4 px-4 text-left">Name</th>
            <th className="py-4 px-4 text-left">Score (wpm)</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((score, index) => (
            <tr key={score._id} className="border-b">
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{score.username}</td>
              <td className="py-3 px-4">{score.score} wpm</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leaderboard;
