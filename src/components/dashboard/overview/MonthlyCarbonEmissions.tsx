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
  const guestSeries = [
    {
      name: 'Carbon Emissions',
      type: 'area',
     data: dataEmission ? dataEmission.slice(0, 12) : [50, 60, 70, 80, 19, 100, 15, 40, 55, 90, 100, 70, 26],
     // data: dataEmission ? dataEmission.slice(0, 12) : [],
   
    },
    {
      name: 'Target Carbon Emissions',
      type: 'line',
      data:dataEmissionTarget ? dataEmissionTarget :  [60, 50, 60, 100, 40, 70, 120, 70, 90, 87, 34, 80, 60],
   //   data:dataEmissionTarget ? dataEmissionTarget :  [],
    
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
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
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
