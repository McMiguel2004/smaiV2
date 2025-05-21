import { createTheme } from "@mui/material/styles"

// Crear un tema personalizado para la aplicación
const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4CAF50",
      light: "#81C784",
      dark: "#388E3C",
      contrastText: "#fff",
    },
    secondary: {
      main: "#2196F3",
      light: "#64B5F6",
      dark: "#1976D2",
      contrastText: "#fff",
    },
    error: {
      main: "#f44336",
    },
    warning: {
      main: "#ff9800",
    },
    info: {
      main: "#2196f3",
    },
    success: {
      main: "#4caf50",
    },
    background: {
      default: "#121212",
      paper: "#1e1e1e",
    },
    text: {
      primary: "#ffffff",
      secondary: "#b0b0b0",
    },
  },
  typography: {
    fontFamily: '"Minecraft-Seven", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontFamily: '"Minecraft-Ten", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h2: {
      fontFamily: '"Minecraft-Ten", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    h3: {
      fontFamily: '"Minecraft-Ten", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    button: {
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 0, // Bordes cuadrados para un estilo Minecraft
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          boxShadow: "3px 3px 0px rgba(0, 0, 0, 0.2)",
          "&:hover": {
            boxShadow: "2px 2px 0px rgba(0, 0, 0, 0.2)",
            transform: "translate(1px, 1px)",
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          overflow: "visible",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 0,
          },
        },
      },
    },
  },
})

export default theme
