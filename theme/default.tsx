import { createTheme } from "@mui/material/styles";
import { Montserrat } from "next/font/google";

export const montserrat = Montserrat({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  fallback: ["Helvetica", "Arial", "sans-serif"],
});

const theme = createTheme({
  palette: {
    success: {
      main: "#1BAA75",
    },
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
  },
});

export default theme;
