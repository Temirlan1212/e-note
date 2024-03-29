import { ReactNode, Ref, forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Badge, Box, Tabs as MuiTabs, Tab, TabsProps } from "@mui/material";

enum colors {
  error = "error.main",
  success = "success.main",
  warning = "warning.main",
  primary = "primary.main",
  secondary = "secondary.main",
}

export interface ITabsProps extends TabsProps {
  color?: keyof typeof colors;
  actionsContent?: ReactNode;
  onTabChange?: (arg: number) => void;
  data: { tabErrorsCount: number; tabLabel: string; tabPanelContent: ReactNode }[];
}

export interface ITabsRef {
  handleTabChange: (value: number, responseTime?: number) => Promise<any>;
}

export default forwardRef(function Tabs(
  { color = "primary", actionsContent = <></>, data, ...rest }: ITabsProps,
  ref: Ref<ITabsRef>
) {
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (tab > data.length - 1) {
      setTab(data.length - 1);
    }
  }, [data]);

  const handleTabChange = (value: number, responseTime?: number) => {
    setTab(value);
    rest.onTabChange && rest.onTabChange(value);
    return new Promise((resolve) => setTimeout(resolve, responseTime ?? 500, value));
  };

  const styles = {
    "& .MuiTabs-scrollButtons.Mui-disabled": {
      opacity: 0.3,
    },
    "& .Mui-selected": {
      color: colors[color],
    },
    "& .MuiTabs-indicator": {
      backgroundColor: colors[color],
    },
    "& .MuiBadge-badge": {
      right: -4,
      top: -4,
    },
  };

  const combineStyles = { ...styles, ...rest.sx };

  useImperativeHandle(ref, () => ({
    handleTabChange,
  }));

  return (
    <Box display="flex" gap="20px" flexDirection="column">
      <Box display="flex" flexDirection={{ xs: "column", md: "row" }} gap={1}>
        <MuiTabs
          value={tab}
          onChange={(e, v) => handleTabChange(v)}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={combineStyles}
        >
          {data?.map(({ tabErrorsCount, tabLabel }, index) => (
            <Tab
              key={index}
              label={
                tabErrorsCount > 0 ? (
                  <Badge badgeContent={tabErrorsCount} color="error">
                    {tabLabel}
                  </Badge>
                ) : (
                  tabLabel
                )
              }
            />
          ))}
        </MuiTabs>
        <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
          {actionsContent}
        </Box>
      </Box>

      {data.map(({ tabPanelContent }, index) => (
        <Box key={index} hidden={tab !== index}>
          {tabPanelContent}
        </Box>
      ))}
    </Box>
  );
});
