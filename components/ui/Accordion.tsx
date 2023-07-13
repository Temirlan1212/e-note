import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import Typography from "@mui/material/Typography";
import MuiAccordionSummary, { AccordionSummaryProps } from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { styled } from "@mui/material/styles";
import { OverridableComponent } from "@mui/material/OverridableComponent";
import { SvgIconTypeMap } from "@mui/material";
import { useTranslations } from "next-intl";

const AccordionMui = styled((props: AccordionProps) => <MuiAccordion disableGutters elevation={0} square {...props} />)(
  ({ theme }) => ({
    "&:not(:last-child)": {
      borderBottom: 0,
    },
    "&:before": {
      display: "none",
    },
    "&": {
      boxShadow: "0px 5px 20px 0px #E9E9E9",
    },
  })
);

const AccordionSummary = styled((props: AccordionSummaryProps) => <MuiAccordionSummary {...props} />)(({ theme }) => ({
  padding: "20px",
  backgroundColor: theme.palette.text.secondary,
  color: theme.palette.text.primary,
  "&.Mui-expanded": {
    backgroundColor: "#3F5984",
    color: theme.palette.text.secondary,
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: theme.palette.text.primary,
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    color: theme.palette.text.secondary,
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    color: theme.palette.text.secondary,
  },
  "& .MuiAccordionSummary-content .MuiTypography-root": {
    fontWeight: 600,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "30px 20px",
}));

interface IDefaultAccordionProps extends AccordionProps {
  title: string;
  type: string;
  handleChange: (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => void;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
}

export default function Accordion({
  title,
  expanded,
  type,
  children,
  handleChange,
  icon: Icon,
  ...props
}: IDefaultAccordionProps) {
  const t = useTranslations();
  return (
    <AccordionMui expanded={expanded} onChange={handleChange(type)} {...props}>
      <AccordionSummary expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}>
        {Icon && <Icon color={expanded ? "inherit" : "success"} />}
        <Typography variant="h6" ml={2}>
          {t(title)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </AccordionMui>
  );
}
