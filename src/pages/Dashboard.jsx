import { useEffect, useState } from "react";
import api from "../servics/api.js";
import {
  Container,
  Typography,
  List,
  ListItem,
  Divider,
  Avatar,
  ListItemAvatar,
  ListItemText,
  Paper,
  Chip,
  Grid,
  Box,
  Badge,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../context/AuthContext.jsx";
import { ShoppingCart, Event, LocalShipping, CalendarToday, LocationOn } from "@mui/icons-material";

export default function Dashboard() {
  const [cart, setCart] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingData, setLoadingData] = useState(true); // new loading state
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) return;

    (async () => {
      setLoadingData(true);
      try {
        const cartRes = await api.get("/me/cart");
        setCart(cartRes.data);
        const eventsRes = await api.get("/me/events");
        setEvents(eventsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingData(false);
      }
    })();
  }, [user, loading]);

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  // show loading spinner if auth or data is loading
  if (loading || loadingData) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        My Dashboard
      </Typography>

      {/* CART / ORDERS SECTION */}
      {cart.length > 0 && (
        <Paper elevation={2} sx={{ mb: 4, p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <ShoppingCart sx={{ mr: 1, color: "primary.main" }} />
            <Typography variant="h5" sx={{ flexGrow: 1 }}>
              My Orders
            </Typography>
            <Chip
              label={`Total: $${calculateTotal()}`}
              color="primary"
              variant="outlined"
              size="medium"
              sx={{ fontWeight: 600 }}
            />
          </Box>
          <Divider sx={{ mb: 3 }} />
          <List>
            {cart.map((p) => (
              <ListItem
                key={p._id}
                sx={{
                  py: 2,
                  "&:hover": { backgroundColor: "action.hover" },
                  transition: "background-color 0.2s",
                }}
              >
                <ListItemAvatar>
                  <Badge badgeContent={p.quantity || 1} color="primary">
                    <Avatar variant="rounded" src={p.image} alt={p.name} sx={{ width: 56, height: 56, mr: 2 }} />
                  </Badge>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {p.name}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.primary" sx={{ display: "flex", alignItems: "center" }}>
                        <LocalShipping fontSize="small" sx={{ mr: 0.5 }} />
                        Shipping: Standard (3-5 days)
                      </Typography>
                      <Chip label={`$${p.price}`} size="small" color="primary" sx={{ mt: 0.5, fontWeight: 600 }} />
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      )}

      {/* EVENTS SECTION */}
      {events.length > 0 && (
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Event sx={{ mr: 1, color: "secondary.main" }} />
            <Typography variant="h5">My Events</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
            {events.map((e) => (
              <Grid item xs={12} sm={6} key={e._id}>
                <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    {e.title}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <CalendarToday color="action" sx={{ mr: 1, fontSize: "small" }} />
                    <Typography variant="body2">
                      {new Date(e.date).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <LocationOn color="action" sx={{ mr: 1, fontSize: "small" }} />
                    <Typography variant="body2">{e.location}</Typography>
                  </Box>
                  {e.price && (
                    <Chip
                      label={`$${e.price}`}
                      size="small"
                      color="secondary"
                      variant="outlined"
                      sx={{ mt: 1, fontWeight: 600 }}
                    />
                  )}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Paper>
      )}
    </Container>
  );
}
