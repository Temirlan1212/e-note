import { useState } from "react";
import { useLocale } from "next-intl";
import { useRouter } from "next/router";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import LanguageIcon from "@mui/icons-material/Language";

const activeMenuItemStyles = {
  color: "primary.contrastText",
  bgcolor: "primary.main",
  "&:hover": {
    color: "primary.contrastText",
    bgcolor: "primary.main",
  },
};

export default function LocaleSwitcher() {
  const router = useRouter();
  const locale = useLocale();
  const locales = router.locales ?? [];
  const [menu, setMenu] = useState<HTMLElement | null>(null);

  const handlePopupToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMenu(menu == null ? event.currentTarget : null);
  };

  const handleLocaleSwitch = (locale: string) => {
    router.push({ pathname: router.pathname, query: router.query }, router.asPath, { locale });
    setMenu(null);
  };

  return (
    <Box>
      <IconButton onClick={handlePopupToggle} color="inherit">
        <LanguageIcon />
      </IconButton>

      <Menu anchorEl={menu} open={!!menu} onClose={handlePopupToggle}>
        {locales.map((itemLocale) => {
          return (
            <MenuItem
              key={itemLocale}
              onClick={() => handleLocaleSwitch(itemLocale)}
              sx={locale === itemLocale ? activeMenuItemStyles : {}}
            >
              {itemLocale.toUpperCase()}
            </MenuItem>
          );
        })}
      </Menu>
    </Box>
  );
}
