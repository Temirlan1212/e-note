import { PaletteColorOptions, createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface PaletteOptions {
    info?: PaletteColorOptions;
  }
}

const theme = createTheme({
  palette: {
    success: {
      main: "#1BAA75",
    },

    info: {
      main: "#24334B",
    },
  },
});

export default theme;
