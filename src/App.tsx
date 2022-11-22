import { useEffect, useState } from 'react';
import moment from 'moment';
import getMetrics from './getMetrics';
import './App.css';

function App() {
  const [stateMetricsLoading, setMetricsLoading] = useState<boolean>(false);
  const [stateMetrics, setMetrics] = useState<string>('');
  const [stateTime, setTime] = useState<number>(0);
  const [diff, setDiff] = useState<string>('');

  useEffect(() => {
    getData();
  }, []);

  useEffect(() => {
    if (stateTime) {
      const newIntervalId = setInterval(() => {
        setDiff(() => {
          const now = Math.round(Date.now() / 1000);

          if (now - stateTime >= 30 || stateMetricsLoading) {
            clearInterval(newIntervalId);
            return '00:00:00';
          }
          return moment
            .unix(now - stateTime)
            .utc()
            .format("HH:mm:ss");
        });
      }, 1000);
    }
  }, [stateMetricsLoading]);

  useEffect(() => {
    setInterval(() => {
      getData();
    }, 30000);
  }, []);

  const getData = async () => {
    setMetricsLoading(true);

    const metrics = await getMetrics();

    setTime(metrics[0].time);
    setMetrics(metrics[1]);
    setMetricsLoading(false);
  };

  return (
    <div className="container">
      <div className='time'>
        <div className='card'>
          <h1>Time in epoch:</h1>
          <p>{stateMetricsLoading ? <p>Loading...</p> : stateTime}</p>
          <h2>Was last updated: {diff} seconds ago</h2>
        </div>
      </div>
      <div className='metrics'>
        {stateMetricsLoading ? (
          <h1>Loading...</h1>
        ) : (
          <>
            <h2>Metrics from prometheus</h2>
            <p>{stateMetrics}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
