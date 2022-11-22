import Axios from 'axios';

const getMetrics = async () => {
  // ]);
  const data1 = await Axios.get('http://localhost:5000/time');

  const data2 = await Axios.get('http://localhost:5000/metrics', {
    headers: {
      Authorization: 'Basic mysecrettoken',
    },
  });

  return [data1.data, data2.data];
};

export default getMetrics;
