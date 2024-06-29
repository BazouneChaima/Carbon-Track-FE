import * as React from 'react';
import { Box } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import type { SxProps } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { ArrowDown as ArrowDownIcon } from '@phosphor-icons/react/dist/ssr/ArrowDown';
import { ArrowUp as ArrowUpIcon } from '@phosphor-icons/react/dist/ssr/ArrowUp';
import { CurrencyDollar as CurrencyDollarIcon } from '@phosphor-icons/react/dist/ssr/CurrencyDollar';

import { palette } from '@/styles/theme/colors';

export interface BudgetProps {
  diff?: number;
  trend: 'up' | 'down';
  sx?: SxProps;
  value: string;
}

export function CarbonPerMonth({ diff, trend, sx, value }: BudgetProps): React.JSX.Element {
  const TrendIcon = trend === 'up' ? ArrowUpIcon : ArrowDownIcon;
  const trendColor = trend === 'up' ? 'var(--mui-palette-success-main)' : 'var(--mui-palette-error-main)';

  return (
    <Card sx={{ backgroundColor: palette.primary[500], color: palette.common.white, position: 'relative', ...sx }}>
      <CardContent>
        <Stack spacing={3}>
          <Stack direction="row" sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }} spacing={3}>
            <Stack spacing={1}>
              <Typography variant="body1" fontWeight={700}>
                Carbon per Months
              </Typography>
              <Box display="flex" gap={2} alignItems="flex-end">
                <Typography variant="h4" fontWeight={700}>
                  {value}{' '}
                </Typography>
                <Typography variant="body2">tCO2e</Typography>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        {/* Add SVG for crossed circles */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          width="200"
          height="200"
          style={{ position: 'absolute', top: '40px', left: '180px' }}
        >
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="0.1" transform="translate(1 1) rotate(90 21 18)" />
          <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="0.1" transform="translate(3 3) rotate(45 6 16)" />
        </svg>
      </CardContent>
    </Card>
  );
}
