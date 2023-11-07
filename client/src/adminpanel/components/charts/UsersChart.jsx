import React from "react";
import {Chart} from "react-chartjs-2"

const UsersChart = () => {

  // const options = {
  //   chart: {
  //     type: 'area',
  //     zoom: {
  //       enabled: false
  //     },
  //     width: '100%',
  //     height: '320px',
  //     fontFamily: 'Lexend, sans-serif',
  //     toolbar: {
  //       show: false,
  //     }
  //   },
  //   dataLabels: {
  //     enabled: false
  //   },
  //   stroke: {
  //     curve: 'smooth'
  //   },
  //   xaxis: {
  //     type: 'datetime',
  //     categories: ["2018-09-19T00:00:00.000Z", "2018-09-19T01:30:00.000Z", "2018-09-19T02:30:00.000Z", "2018-09-19T03:30:00.000Z", "2018-09-19T04:30:00.000Z", "2018-09-19T05:30:00.000Z", "2018-09-19T06:30:00.000Z"]
  //   },
  //   tooltip: {
  //     x: {
  //       format: 'dd/MM/yy HH:mm'
  //     },
  //   },
  //   yaxis: {
  //     opposite: true
  //   },
  //   legend: {
  //     horizontalAlign: 'left'
  //   },
  //   colors: ['#F2BC1B'],
  // }

  // const series = [{
  //   name: 'Users',
  //   data: [31, 40, 28, 51, 42, 109, 100]
  // }]

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    datasets: [{
      label: "My Dataset",
      data: [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
      fill: true,
      backgroundColor: "rgba(0, 0, 255, 0.2)",
      borderColor: "rgba(0, 0, 255, 1)"
    }]
  };

  return (
    <Chart
      type="area"
      data={data}
      options={{
        title: {
          display: true,
          text: "Area Chart"
        },
        legend: {
          display: true
        }
      }}
    />
  )
}

export default UsersChart;