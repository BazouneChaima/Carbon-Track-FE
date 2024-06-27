import React, { FC } from 'react';
import { useTheme } from '@mui/material';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';

import { palette } from '@/styles/theme/colors';

interface TabOption {
  label: string;
  value: string;
}

interface ScopesTabsProps {
  value: string;
  handleChange: (event: React.ChangeEvent<any>, value: string) => void;
}

const ScopesTabs: FC<ScopesTabsProps> = ({ value, handleChange }) => {
  const tabOptions: TabOption[] = [
    { label: 'All Scopes', value: 'all' },
    { label: 'Scopes O1', value: 'scope1' },
    { label: 'Scopes O2', value: 'scope2' },
    { label: 'Scopes O3', value: 'scope3' },
  ];

  const theme = useTheme();

  const styles = {
    tabs: {
      backgroundColor: theme.palette.background.paper,
      minHeight: '10px',
    },
    tab: {
      textTransform: 'none',
      fontWeight: 400,
      fontSize: '14px',
      display: 'flex',
      flexDirection: 'row',
      padding: '4px 16px',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '8px',
      border: `1px solid ${theme.palette.divider}`,
      marginLeft: 0,
      '&:first-child': {
        borderTopLeftRadius: '5px',
        borderBottomLeftRadius: '5px',
      },
      '&:last-child': {
        borderTopRightRadius: '5px',
        borderBottomRightRadius: '5px',
      },
      '&.MuiButtonBase-root': {
        margin: 0,
      },
      '&.Mui-selected': {
        borderBottom: 'none',
        backgroundColor: palette.primary[500],
        color: palette.common.white,
      },
    },
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      aria-label="tabs"
      sx={styles.tabs}
      TabIndicatorProps={{
        style: {
          backgroundColor: 'transparent',
        },
      }}
    >
      {tabOptions.map((option) => (
        <Tab key={option.value} label={option.label} value={option.value} sx={styles.tab} />
      ))}
    </Tabs>
  );
};

export default ScopesTabs;
