import { useEffect } from 'react';
import { Bar } from 'react-chartjs-2';

export default function RecycledGraph({
  preConsumerValue, postConsumerValue, unspecifiedValue,
  preConsumerRatio, postConsumerRatio, unSpecifiedRatio
}) {
  useEffect(() => {
    console.log(preConsumerValue, postConsumerValue, unspecifiedValue, preConsumerRatio, postConsumerRatio, unSpecifiedRatio);
  }, [preConsumerValue, postConsumerValue, unspecifiedValue, preConsumerRatio, postConsumerRatio, unSpecifiedRatio]);

  const data = {
    labels: ['Pre Consumer Value', 'Post Consumer Value', 'Unspecified Value',
      'Pre Consumer Ratio', 'Post Consumer Ratio', 'Unspecified Ratio'],
    datasets: [{
      label: '재생소재 함유량 및 함유율',
      data: [preConsumerValue, postConsumerValue, unspecifiedValue,
        preConsumerRatio, postConsumerRatio, unSpecifiedRatio],
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'
      ],
      borderWidth: 1
    }]
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return <Bar data={data} options={options} />;
}
