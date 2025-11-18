import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const ChartsPanel = ({ entries }) => {
  const waterRef = useRef(null);
  const exerciseRef = useRef(null);
  const sugarRef = useRef(null);

  // Keep refs to chart instances so we can destroy them
  const waterChartRef = useRef(null);
  const exerciseChartRef = useRef(null);
  const sugarChartRef = useRef(null);

  useEffect(() => {
    const labels = entries.map(e => new Date(e.createdAt).toLocaleDateString());
    const waterData = entries.map(e => e.water);
    const exerciseData = entries.map(e => e.exercise);
    const sugarData = entries.map(e => e.sugar);

    // If a previous chart exists, destroy it before creating a new one
    if (waterChartRef.current) {
      waterChartRef.current.destroy();
    }
    if (exerciseChartRef.current) {
      exerciseChartRef.current.destroy();
    }
    if (sugarChartRef.current) {
      sugarChartRef.current.destroy();
    }

    waterChartRef.current = new Chart(waterRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: 'Water (ml)', data: waterData, borderColor: 'blue' }]
      }
    });

    exerciseChartRef.current = new Chart(exerciseRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: 'Exercise (min)', data: exerciseData, borderColor: 'green' }]
      }
    });

    sugarChartRef.current = new Chart(sugarRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [{ label: 'Sugar (mg/dL)', data: sugarData, borderColor: 'red' }]
      }
    });

    // Cleanup when component unmounts
    return () => {
      if (waterChartRef.current) {
        waterChartRef.current.destroy();
      }
      if (exerciseChartRef.current) {
        exerciseChartRef.current.destroy();
      }
      if (sugarChartRef.current) {
        sugarChartRef.current.destroy();
      }
    };
  }, [entries]);

  return (
    <div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="card-title">Water (ml)</h6>
          <canvas ref={waterRef} height="120"></canvas>
        </div>
      </div>
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h6 className="card-title">Exercise (min)</h6>
          <canvas ref={exerciseRef} height="120"></canvas>
        </div>
      </div>
      <div className="card shadow-sm">
        <div className="card-body">
          <h6 className="card-title">Blood Sugar (mg/dL)</h6>
          <canvas ref={sugarRef} height="120"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ChartsPanel;
