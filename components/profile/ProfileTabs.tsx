import { Box, Tab, Tabs, Typography, styled } from "@mui/material";
import React from "react";
import ProfileForm from "./ProfileForm";
import { useTranslations } from "next-intl";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface StyledTabProps {
  label: string;
}

const StyledTabs = styled(Tabs)({
  "& .MuiTabs-indicator": {
    backgroundColor: "transparent",
  },
});

const StyledTab = styled((props: StyledTabProps) => <Tab disableRipple {...props} />)(({ theme }) => ({
  textTransform: "none",
  minWidth: 0,
  [theme.breakpoints.up("sm")]: {
    minWidth: 0,
  },

  fontWeight: 600,
  color: "#24334B",
  transition: "all .3s ease-in",
  padding: "10px 16px",
  "&:hover": {
    color: "#1BAA75",
    backgroundColor: "#f6f6f6",
    opacity: 1,
  },
  "&.Mui-selected": {
    color: "#1BAA75",
    fontWeight: 600,
    backgroundColor: "#f6f6f6",
  },
  "&.Mui-focusVisible": {
    backgroundColor: "#d1eaff",
  },
}));

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 4 }}>{children}</Box>}
    </div>
  );
}

export default function ProfileTabs() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const t = useTranslations();

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ bgcolor: "#fff" }}>
        <StyledTabs value={value} onChange={handleChange} aria-label="ant example">
          <StyledTab label={t("Avatar")} />
          <StyledTab label={t("Notifications")} />
        </StyledTabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <ProfileForm />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <div>Уведомления</div>
      </CustomTabPanel>
    </Box>
  );
}
