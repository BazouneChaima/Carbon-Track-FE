import React, { useEffect, useRef, useState } from 'react';
import DZIcon from '@/icons/DZIcon';
import { Card, CardContent, CardHeader, Grid, Typography } from '@mui/material';

import Map from '@/components/commun/Map/Map';
import ListItemProgress from '@/components/special/ListItem/ListItemProgress';
import ARMIcon from '@/icons/ARMIcon';
import BLGIcon from '@/icons/BLGIcon';
import ARGIcon from '@/icons/ARGIcon';

export interface EmissionLocationProps {
  sx?: any;
  data: EmissionLocationData[]; // Define the data structure
}

interface EmissionLocationData {
  title: string;
  progress: number;
}

export function EmissionLocation({ sx, data }: EmissionLocationProps): React.JSX.Element {
  const [emissionLocations, setEmissionLocations] = useState<[]>([]);

  useEffect(() => {
    // Process data to extract title and progress values
    const processedData = data.map((item) => ({
      title: item.location || 'Unknown Location', // Use location if available, otherwise default to "Unknown Location"
      progress: item.emission_tracker || 0, // Use emission_tracker if available, otherwise default to 0
    }));

    // Sort data by progress in descending order (highest to lowest)
    const sortedData = processedData.sort((a, b) => b.progress - a.progress);

    // Take the top 5 elements (highest emissions)
    const top5Locations = sortedData.slice(0, 5);

    setEmissionLocations(top5Locations);
  }, [data]); // Dependency array to trigger useEffect when data changes

  return (
    <Card sx={sx}>
      <CardHeader title="Top 5 Emissions by Location" />
      <CardContent>
        <Grid container columnSpacing={5}>
          <Grid item lg={6} md={12} xs={12}>
            <Map value={0} title={''} />
          </Grid>
          <Grid item lg={6} md={12} xs={12}>
            {data.map((location, index) => (
              <ListItemProgress
                key={index}
                title={<Typography variant="body2">{location.label}</Typography>} // Use Typography for proper formatting
                icon={getIcon(location.title)} // Use a function to determine icon based on title
                progress={location.value}
              />
            ))}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

function getIcon(title: string): React.ReactNode {
  switch (title) {
    case 'Location 1':
      return <DZIcon />;
    case 'Location 2':
      return <ARMIcon />;
    case 'Location 3':
      return <BLGIcon />;
    case 'Location 4':
    case 'Unknown Location': // Handle the default case
      return <ARGIcon />;
    default:
      return null; // Or return a placeholder icon if no match is found
  }
}
