import { Box as MuiBox, BoxProps, IconButton, Typography } from "@mui/material";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import HelpOutlinedIcon from "@mui/icons-material/HelpOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { styled } from "@mui/material/styles";
import React from "react";
import { useTranslations } from "next-intl";

interface ILink {
  title: string;
  href: string;
}

interface IHintProps extends BoxProps {
  title?: string;
  text?: string;
  type: "success" | "error" | "hint";
  links?: ILink[];
}

const Box = styled((props: BoxProps) => <MuiBox {...props} />)(({ theme }) => ({
  border: "1px solid #EFEFEF",
  padding: theme.spacing(2),
  display: "flex",
  columnGap: "5px",
  justifyContent: "space-between",
  boxShadow: "0px 10px 20px 0px #E9E9E9",
}));

export default function Hint({ title, text, links, type, children, ...props }: IHintProps) {
  const t = useTranslations();
  const [isActive, setIsActive] = React.useState(true);

  const Icon = type === "hint" ? HelpOutlinedIcon : type === "success" ? CheckCircleIcon : ErrorOutlineIcon;

  const handleClick = () => {
    type === "hint" && setIsActive((prev) => !prev);
  };

  if (!isActive) {
    return (
      <MuiBox {...props}>
        <IconButton onClick={handleClick}>
          <HelpOutlineOutlinedIcon sx={{ color: "success.main" }} />
        </IconButton>
      </MuiBox>
    );
  }

  return (
    <Box {...props}>
      <MuiBox>
        {title && (
          <Typography mb={"5px"} fontWeight={600} color={"#3F5984"} variant="h6">
            {t(title)}
          </Typography>
        )}

        <Typography fontSize={14} color={"#687C9B"} variant="h6">
          {children}
        </Typography>
      </MuiBox>
      <IconButton sx={{ height: "min-content", padding: 0 }} onClick={handleClick}>
        <Icon sx={{ color: type === "error" ? "#EB5757" : "success.main" }} />
      </IconButton>
    </Box>
  );
}
