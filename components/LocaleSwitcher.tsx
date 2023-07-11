import * as React from 'react';
import { useLocale } from 'next-intl';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useRouter } from 'next/router';

export default function LocaleSwitcher() {
  const router = useRouter();
  const locales = router.locales ?? [];
  const [localeSwitcherMenu, setLocaleSwitcherMenu] = React.useState<HTMLElement | null>(null);
  const open = !!localeSwitcherMenu;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setLocaleSwitcherMenu(event.currentTarget);
  };

  const handleClose = () => {
    setLocaleSwitcherMenu(null);
  };

  const handleLocaleSwitch = (locale: string) => {
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale });
    handleClose();
  };

  return (
    <div>
      <Button onClick={handleClick} endIcon={<KeyboardArrowDownIcon />} color="inherit">
        {useLocale()}
      </Button>

      <Menu anchorEl={localeSwitcherMenu} open={open} onClose={handleClose}>
        {locales.map((locale) => {
          return (
            <MenuItem key={locale} onClick={() => handleLocaleSwitch(locale)}>
              {locale.toUpperCase()}
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
}
