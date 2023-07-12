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
      secondary: "#fff",
    },
  },

  typography: {
    fontFamily: montserrat.style.fontFamily,
    h1: {
      fontSize: "36px",
      fontWeight: "900",
    },
    h2: {
      fontSize: "32px",
      fontWeight: "800",
    },
    h3: {
      fontSize: "28px",
      fontWeight: "700",
    },
    h4: {
      fontSize: "24px",
      fontWeight: "600",
    },
    h5: {
      fontSize: "20px",
      fontWeight: "500",
    },
    h6: {
      fontSize: "16px",
      fontWeight: "400",
    },
  },
});

export default theme;
