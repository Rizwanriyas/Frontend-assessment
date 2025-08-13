import { AppBar, Toolbar, Typography, Button, Box, Container } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="static" elevation={0} sx={{ bgcolor: "primary.dark" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              mr: 2,
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              "&:hover": {
                opacity: 0.8,
              },
            }}
          >
            My Store
          </Typography>

          <Box sx={{ flexGrow: 1 }} />

          <Box sx={{ display: "flex", gap: 1 }}>
            {user ? (
              <>
                <Button
                  variant="outlined"
                  color="inherit"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Dashboard
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={handleLogout}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      bgcolor: "secondary.dark",
                    },
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "rgba(255,255,255,0.1)",
                    },
                  }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  color="secondary"
                  component={Link}
                  to="/register"
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    boxShadow: "none",
                    "&:hover": {
                      boxShadow: "none",
                      bgcolor: "secondary.dark",
                    },
                  }}
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
