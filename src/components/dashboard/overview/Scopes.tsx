import React from 'react'; // Use specific imports for better readability

import { CardContent, Typography } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { PieChart } from '@mui/x-charts/PieChart';

// const originalData = [
//   { label: 'Scope 1', value: "38.6%",color:"red" },
//   { label: 'Scope 2', value: "38.5%" ,color:"#FF8F6B"},
//   { label: 'Scope 3', value: "22.9%",color:"#FFD66B" },
// ];

interface ScopesProps {
  scope1?: number;
  scope2?: number;
  scope3?: number;
}
export default function Scopes({ scope1, scope2, scope3 }: ScopesProps) {
  // Define colors for each slice
  const originalData = [
    { label: 'Scope 1', value: scope1, color: 'red' },
    { label: 'Scope 2', value: scope2, color: '#FF8F6B' },
    { label: 'Scope 3', value: scope3, color: '#FFD66B' },
  ];
  const data = originalData.map((item) => ({
    label: item.label,
    value: item.value
    // value: parseFloat(item.value.slice(0, -1)),
  }));
  const colors = ['#73E2A3', '#FF8F6B', '#FFD66B'];
  return (
    <Card id="scopeid" sx={{ height: '100%',backgroundColor:"transparent" }}>
      <CardHeader title="Scopes" />
      <CardContent>
        <PieChart
          colors={colors}

          series={[
            {
              data,

              paddingAngle: 10, // Optional: Add separation between slices
              innerRadius: 70, // Optional: Set inner radius for a donut effect
              outerRadius: 50, // Optional: Set outer radius
              cornerRadius: 20,
            },
          ]}
          margin={{ left: 10 }} // Optional: Set margin around the chart
          width={300}
          height={300}
        />
      </CardContent>
    </Card>
  );
}
