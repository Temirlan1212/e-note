import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function LocaleSwitcher() {
  const router = useRouter();
  const locales = router.locales ?? [];
  const [menu, setMenu] = useState<HTMLElement | null>(null);
  const open = !!menu;

  const handlePopupToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(menu == null ? event.currentTarget : null);
  };

  const handleLocaleSwitch = (locale: string) => {
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale });
    setMenu(null);
  };

  return (
    <div>
      <Button onClick={handlePopupToggle} endIcon={<KeyboardArrowDownIcon />} color="inherit">
        {useLocale().toUpperCase()}
      </Button>

      <Menu anchorEl={menu} open={open} onClose={handlePopupToggle}>
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
