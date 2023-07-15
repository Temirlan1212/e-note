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
  backgroundColor: "white",
  color: theme.palette.text.primary,
  "&.Mui-expanded": {
    backgroundColor: "#3F5984",
    color: "white",
  },
  "& .MuiAccordionSummary-expandIconWrapper": {
    color: theme.palette.text.primary,
  },
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    color: "white",
  },
  "& .MuiAccordionSummary-content": {
    margin: 0,
  },
  "& .MuiAccordionSummary-content.Mui-expanded": {
    color: "white",
  },
  "& .MuiAccordionSummary-content .MuiTypography-root": {
    fontWeight: 600,
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: "30px 20px",
}));

interface IAccordionProps extends AccordionProps {
  title: string;
  type: string;
  handleChange: (event: React.SyntheticEvent, isExpanded: boolean) => void;
  icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & {
    muiName: string;
  };
  summarySx?: any;
  detailsSx?: any;
  baseSx?: any;
}

export default function Accordion({
  title,
  expanded,
  children,
  handleChange,
  icon: Icon,
  summarySx,
  detailsSx,
  baseSx,
  ...props
}: IAccordionProps) {
  const t = useTranslations();
  return (
    <AccordionMui expanded={expanded} onChange={handleChange} sx={...baseSx} {...props}>
      <AccordionSummary sx={...summarySx} expandIcon={expanded ? <RemoveIcon /> : <AddIcon />}>
        {Icon && <Icon color={expanded ? "inherit" : "success"} />}
        <Typography variant="h6" ml={2}>
          {t(title)}
        </Typography>
      </AccordionSummary>
      <AccordionDetails sx={...detailsSx}>{children}</AccordionDetails>
    </AccordionMui>
  );
}
