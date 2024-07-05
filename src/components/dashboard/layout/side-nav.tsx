'use client';

import * as React from 'react';
import Image from 'next/image';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import { LeftChevronIcon, SettingsIcon, SupportIcon } from '@/icons';
import { Close as CloseIcon, Menu as MenuIcon } from '@mui/icons-material';
import { Avatar, styled } from '@mui/material';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';
import { useSelector } from 'react-redux';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { companyApis } from '@/lib/company/companyApis';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';
import { palette } from '@/styles/theme/colors';

import { navItems } from './config';
import { navIcons } from './nav-icons';

const ProfilePicture = styled(Avatar)({
  width: '50px',
  height: '32px',
  // border: '3px solid white',
});
export function SideNav({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }): React.JSX.Element {
  const pathname = usePathname();
  const [image, setImage] = React.useState<any>(null);
  const { company } = useSelector((state: any) => state.company);
  const getImage = React.useCallback(async (): Promise<void> => {
    const { res } = await companyApis.getImage(company._id);

    const blob = new Blob([res?.data], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);
    setImage(imageUrl);
  }, [company]);

  React.useEffect(() => {
    getImage();
  }, [company]);
  return (
    <Box>
      {/* Sidebar */}
      <Box
        sx={{
          bgcolor: 'var(--SideNav-background)',
          color: 'var(--SideNav-color)',
          display: { xs: isOpen ? 'flex' : 'none', lg: 'flex' },
          flexDirection: 'column',
          height: '100%',
          left: 0,
          maxWidth: '100vh',
          position: 'fixed',
          scrollbarWidth: 'none',
          width: 'var(--SideNav-width)',
          zIndex: 'var(--SideNav-zIndex)',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        <Box sx={{ p: '10px', display: 'flex', alignItems: 'center' }}>
          <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
            <ProfilePicture
              src={image || ''}
              alt={company.name}
             
            />
             {/* <Avatar
          // onClick={userPopover.handleOpen}
          // ref={userPopover.anchorRef}
          src={image || ''}
          sx={{ cursor: 'pointer' }}
        /> */}
            {/* <Logo height={32} width={122} /> */}
          </Box>

          {/* Sidebar toggle button */}
          <Button onClick={toggleSidebar} sx={{ ml: 'auto' }}>
            {isOpen ? <CloseIcon /> : <LeftChevronIcon />}
          </Button>
        </Box>
        <Divider sx={{ borderColor: '#DBDBDB' }} />
        <Box
          sx={{
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              height: '80vh',
            }}
          >
            <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
              {renderNavItems({ pathname, items: navItems })}
            </Box>
            <Stack sx={{ padding: '10px' }}>
              <NavItem key="7" pathname={pathname} icon={SupportIcon} title="Support" />
              <NavItem
                key="Settings"
                href={paths.dashboard.settings}
                pathname={pathname}
                icon={SettingsIcon}
                title="Settings"
              />
              {/* 
              
              {
    key: 'Settings',
    title: 'Settings',
    href: paths.dashboard.settings,
    icon: SettingsIcon,
  },
              */}
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

function renderNavItems({ items = [], pathname }: { items?: NavItemConfig[]; pathname: string }): React.JSX.Element {
  const children = items.reduce((acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
    const { key, ...item } = curr;

    acc.push(<NavItem key={key} pathname={pathname} {...item} />);

    return acc;
  }, []);

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

function NavItem({ disabled, external, href, icon, matcher, pathname, title }: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });

  const Icon = icon ? icon : null;

  return (
    <li style={{ listStyleType: 'none' }}>
      <Box
        {...(href
          ? {
              component: external ? 'a' : RouterLink,
              href,
              target: external ? '_blank' : undefined,
              rel: external ? 'noreferrer' : undefined,
            }
          : { role: 'button' })}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: active ? palette.primary[800] : 'var(--NavItem-color)',
          cursor: 'pointer',
          display: 'flex',

          flex: '0 0 auto',
          gap: 1,
          p: '6px 16px',
          position: 'relative',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          bgcolor: active ? palette.primary[50] : 'transparent',
          ...(disabled && {
            bgcolor: 'var(--NavItem-disabled-background)',
            color: 'var(--NavItem-disabled-color)',
            cursor: 'allowed',
          }),
        }}
      >
        <Box sx={{ alignItems: 'center', display: 'flex', justifyContent: 'center', flex: '0 0 auto' }}>
          {Icon ? (
            <Icon
              fill={active ? 'green' : 'var(--NavItem-icon-color)'}
              stroke={active ? 'green' : '#88909F'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: '1 1 auto' }}>
          <Typography
            component="span"
            sx={{
              color: palette.gray[400],
              fontSize: '0.875rem',
              fontWeight: 500,
              lineHeight: '28px',
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
