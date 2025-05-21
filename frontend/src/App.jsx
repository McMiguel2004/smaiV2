import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar/Navbar"
import Home from "./pages/Home"
import { Servers } from "./pages/Servers"
import Skins from "./pages/Skins"
import Wireguard from "./pages/Wireguard"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Logout from "./pages/Logout"
import ProtectedRoute from "./protected/ProtectedRoute"
import { ServerAdmin } from "./pages/Server_admin"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"
import theme from "./theme"

import "./App.css"

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/servers"
            element={
              <ProtectedRoute>
                <Servers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/server/:name"
            element={
              <ProtectedRoute>
                <ServerAdmin />
              </ProtectedRoute>
            }
          />
          <Route path="/skins" element={<Skins />} />
          <Route path="/wireguard" element={<Wireguard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/logout" element={<Logout />} />
        </Routes>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
