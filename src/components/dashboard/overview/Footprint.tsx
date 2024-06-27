import React from 'react';
import { CardContent, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart from 'react-apexcharts';

import { palette } from '@/styles/theme/colors';

export interface FootprintsProps {
  sx?: any; // Define any custom styling props here
 data:any; 
}

export function Footprints({ sx,data }: FootprintsProps): React.JSX.Element {
 console.log("fonntprints==========")
  const maxValue = Math.max(...data.map((item) => item.value));
  const options = {
    chart: {
      height: 200,
    },
    plotOptions: {
      bar: {
        distributed: true,
        horizontal: false,
        borderRadius: 6,
        columnWidth: 39,
      },
    },
    dataLabels: {
      enabled: false,
      formatter: function (val: any) {
        return val.toFixed(2); // Format data label value
      },
      offsetY: -20,
      style: {
        fontSize: '12px',
        colors: ['#3ccb7f'],
      },
    },
    xaxis: {
      categories: data.map((item) => item.label),
      labels: {
        style: {
          fontSize: '12px',
        },
      },
    },
    legend: {
      show: false, // Hide legend
    },
    yaxis: {
      tickAmount: 3,
      title: {
        text: '',
      },
    },
    fill: {
      colors: data.map((item) => (item.value === maxValue ? '#3ccb7f' : '#d3f8df')),
    },
    // tooltip: {
    //   enabled: true,
    //   y: {
    //     formatter: function (val: any) {
    //       return val.toFixed(2); // Format tooltip value
    //     },
    //   },
    // },
  };

  const series = [
    {
      name: 'Value',
      data: data.map((item) => item.value),
    },
  ];

  return (
    <Card sx={{ height: 200, ...sx }}>
      <CardHeader title="Footprints" />
      <Typography variant="body2" sx={{ marginX: 3 }} color="text.secondary">
        Activities
      </Typography>
      <CardContent>
        <Chart type="bar" series={series} options={options} height={242} />
      </CardContent>
    </Card>
  );
}
