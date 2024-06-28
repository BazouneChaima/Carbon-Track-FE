import React from 'react';
import { CardContent, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Chart from 'react-apexcharts';

import { palette } from '@/styles/theme/colors';

export interface MonthlyCarbonEmissionsProps {
  sx?: any; // Define any custom styling props here
  dataEmission: [];
  dataEmissionTarget: []
}

export function MonthlyCarbonEmissions({ sx, dataEmission,dataEmissionTarget }: MonthlyCarbonEmissionsProps): React.JSX.Element {
 
 console.log("data emiss",dataEmission.length)
 let categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 //console.log("dataEmission.length",dataEmission.length)
 if (dataEmission.length === 7) {
   categories = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Day 7'];
 } else if (dataEmission.length === 30) {
   categories = Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`);
 } else if (dataEmission.length === 3) {
   categories = ['Month 1', 'Month 2', 'Month 3'];
 } else if (dataEmission.length === 12) {
   categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
 }
 const guestSeries = [
  {
    name: 'Carbon Emissions',
    type: 'area',
    data: dataEmission.length ? dataEmission.slice(0, categories.length) : [50, 60, 70, 80, 19, 100, 15, 40, 55, 90, 100, 70, 26],
  },
  {
    name: 'Target Carbon Emissions',
    type: 'line',
    data: dataEmissionTarget.length ? dataEmissionTarget.slice(0, categories.length) : [60, 50, 60, 100, 40, 70, 120, 70, 90, 87, 34, 80, 60],
    color: '#CCCCCC',
    lineStyle: {
      dashArray: 5,
    },
  },
];
  const guestOption = {
    chart: {
      id: 'guest',
      group: 'social',
      animations: {
        speed: 100,
      },
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: categories,
    },
    colors: [palette.primary[400], '#CCCCCC'],
    legend: {
      show: true,
      labels: {
        colors: '#333333',
        useSeriesColors: false,
      },
      markers: {
        fillColors: [palette.primary[400], '#CCCCCC'],
      },
    },
  };

  return (
    <Card id="monthlyCarbonId" sx={sx}>
      <CardHeader title="Monthly Carbon Emissions" />
      <CardContent>
        <Chart type="area" series={guestSeries} options={guestOption} height={350} />
      </CardContent>
    </Card>
  );
}
