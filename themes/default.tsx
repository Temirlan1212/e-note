import { createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";

export const montserrat = Montserrat({
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const theme = createTheme({
  palette: {
    success: {
      main: "#1BAA75",
    },
    text: {
      primary: "#24334B",
    },
    info: {
      main: "#24334B",
      light: "#3F5984",
    },
    grey: {
      300: "#CDCDCD",
    },
  },

  typography: {
    fontFamily: montserrat.style.fontFamily,
    h1: {
      fontSize: "clamp(24px, 3vw, 36px)",
      fontWeight: "900",
    },
    h2: {
      fontSize: "clamp(22px, 3vw, 32px)",
      fontWeight: "800",
    },
    h3: {
      fontSize: "clamp(20px, 3vw, 28px)",
      fontWeight: "700",
    },
    h4: {
      fontSize: "clamp(18px, 3vw, 24px)",
      fontWeight: "600",
    },
    h5: {
      fontSize: "clamp(16px, 3vw, 20px)",
      fontWeight: "500",
    },
    h6: {
      fontSize: "clamp(14px, 3vw, 16px)",
      fontWeight: "400",
    },
    button: {
      textTransform: "none",
    },
  },
});

export default theme;
