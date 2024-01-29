import { doc, getDoc, getFirestore } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';

const db = getFirestore(); // Firestore 인스턴스 초기화

const RecyclabilityGraph1 = ({ productID, results }) => {
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const docRef = doc(db, 'products', productID);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists) {
          const category = docSnap.data().category;

          // 카테고리에 따른 데이터 설정
          if (category === '무선청소기') {
            setGraphData({
              labels: ['Other parts', 'Pre-treatment materials', 'Battery', 'PCB Assembly', 'External electric cable'],
              datasets: [{
                label: 'Recyclability Value',
                data: [results.otherPartValue, results.preTreatmentValue, results.batteryValue, results.pcbAssemblyValue, results.externalElecCableValue],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)', 'rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)', 'rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)'],
                borderWidth: 1,
              }],
            });
          } else if (category === '스마트폰') {
            setGraphData({
              labels: ['Other parts', 'Mono-Materials', 'Battery'],
              datasets: [{
                label: 'Recyclability Value',
                data: [results.phoneOtherPartValue, results.phoneMonoValue, results.phoneBatteryValue],
                backgroundColor: ['rgba(255, 99, 132, 0.2)', 'rgba(54, 162, 235, 0.2)', 'rgba(255, 206, 86, 0.2)'],
                borderColor: ['rgba(255, 99, 132, 1)', 'rgba(54, 162, 235, 1)', 'rgba(255, 206, 86, 1)'],
                borderWidth: 1,
              }],
            });
          } else {
            console.log("No such document!");
          }
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    };

    fetchCategory();
  }, [productID, results]);

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={graphData} options={options} />;
};

export default RecyclabilityGraph1;
