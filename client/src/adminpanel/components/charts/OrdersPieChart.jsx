import React from "react";
import {Chart} from "react-chartjs-2"

const OrdersPieChart = () => {

  // const options = {
  //   chart: {
  //     width: '100%',
  //     type: 'pie',
  //     dataLabels: {
  //       enabled: false
  //     },
  //   },
  //   labels: ['No-account orders', 'Account orders'],
  //   legend: {
  //     show: false,
  //     horizontalAlign: 'left'
  //   },
  //   colors: ['#05422C', '#84d18c']
  // }

  const data = {
    labels: ["Red", "Green", "Blue"],
    datasets: [{
      label: "My Dataset",
      data: [10, 20, 30],
      backgroundColor: ["red", "green", "blue"]
    }]
  };

  // const series = [44, 56];

  return (
    <div className="orderspiechart">
      {/* <Chart 
        type="pie" 
        options={options} 
        series={series}         
      /> */}

    <Chart
      type="pie"
      data={data}
      options={{
        title: {
          display: true,
          text: "My Pie Chart"
        },
        legend: {
          display: true
        }
      }}
    />
    </div>
  )
}

export default OrdersPieChart;