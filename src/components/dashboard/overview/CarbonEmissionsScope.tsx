'use client';

import * as React from 'react';
import { Box, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import { alpha, useTheme } from '@mui/material/styles';
import type { SxProps } from '@mui/material/styles';
import { ArrowClockwise as ArrowClockwiseIcon } from '@phosphor-icons/react/dist/ssr/ArrowClockwise';
import { ArrowRight as ArrowRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowRight';
import type { ApexOptions } from 'apexcharts';

import { Chart } from '@/components/core/chart';
import { palette } from '@/styles/theme/colors';

export interface SalesProps {
  chartSeries: { name: string; data: number[] }[];
  sx?: SxProps;
}

export function CarbonEmissionsScope({ chartSeries, sx,value }: SalesProps): React.JSX.Element {
  const chartOptions = useChartOptions();

  return (
    <Card sx={sx}>
      <CardHeader
        action={
          <Box display="flex" alignItems="flex-end">
            <Typography
              fontWeight={700}
              sx={{
                color: palette.common.black,
                fontSize: '16px',
              }}
            >
              {value}
            </Typography>
            <Typography variant="caption">tCO2e</Typography>
          </Box>
        }
        title={
          <Typography variant="h6" component="div">
            Carbon Emissions by Scope
          </Typography>
        }
        sx={{
          display: 'flex',
          alignItems: 'center',
        }}
      />
      <CardContent>
        <Chart height={350} options={chartOptions} series={chartSeries} type="bar" width="100%" />
      </CardContent>
      <Divider />
    </Card>
  );
}

function useChartOptions(): ApexOptions {
  const theme = useTheme();

  return {
    chart: { background: 'transparent', stacked: true, toolbar: { show: false } },
    colors: ['#73E2A3', '#FF8F6B', '#FFD66B'],
    dataLabels: { enabled: false },
    fill: { opacity: 1, type: 'solid' },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    legend: {
      show: true,
      labels: {
        colors: theme.palette.text.primary,
      },
      position: 'bottom',
      markers: {
        width: 12,
        height: 12,
        radius: 4,
      },
      offsetY: 10,
    },

    plotOptions: { bar: { columnWidth: '20px', borderRadius: 6 } },
    stroke: { colors: ['transparent'], show: true, width: 2 },
    theme: { mode: theme.palette.mode },
    xaxis: {
      axisBorder: { color: theme.palette.divider, show: true },
      axisTicks: { color: theme.palette.divider, show: true },
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      labels: { offsetY: 5, style: { colors: theme.palette.text.secondary } },
    },
    yaxis: {
      title: {
        text: 'Equivalent CO2 (t)',
        style: { color: theme.palette.text.secondary },
      },
      labels: {
        formatter: (value) => (value > 0 ? `${value}t` : `${value}`),
        style: { colors: theme.palette.text.secondary },
      },
    },
  };
}
