import { useAuth0 } from "@auth0/auth0-react";
import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

const Stats = () => {
  const [scores, setScores] = useState([]);
  const { user } = useAuth0();

  useEffect(() => {
    if(user){
      fetchScores(user.name);
    }
  }, [user]);

  const fetchScores = async (username) => {
    const response = await fetch('https://velocikeys.onrender.com/get-scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username }),
    });

    const data = await response.json();
    setScores(data);
  };

  // Prepare data for the chart
  const chartData = {
    labels: scores.map((_, index) => `Test ${index + 1}`),
    datasets: [
      {
        label: 'Scores',
        data: scores.map(score => score.score),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="w-[80vw] flex flex-col gap-10">
      <h1>My Stats</h1>

      {/* Chart */}
      <div className="w-full h-[500px] flex items-center justify-center">
        <Line data={chartData} options={{ plugins: { datalabels: {} } }} />
      </div>
    </div>
  );
};

export default Stats;
