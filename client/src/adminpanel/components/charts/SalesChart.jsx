import React from "react";
import {Chart} from "react-chartjs-2"

const SalesChart = () => {

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
  //   colors: ['#17AF26', '#05422C'],
  // }

  // const series = [{
  //   name: 'Orders',
  //   data: [31, 40, 28, 51, 42, 109, 100]
  // }, {
  //   name: 'Sale $',
  //   data: [11, 32, 45, 32, 34, 52, 41]
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
    // <Chart 
    //   type="area" 
    //   options={options} 
    //   series={series} 
    // />
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

export default SalesChart;