import { useEffect, useState } from "react";
import api from "../servics/api.js";
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CardMedia,
  Chip,
  Divider,
  Stack,
  Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, EventAvailable } from "@mui/icons-material";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [events, setEvents] = useState([]);
  const [addedProducts, setAddedProducts] = useState([]);
  const [bookedEvents, setBookedEvents] = useState([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  const [openProductModal, setOpenProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productForm, setProductForm] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
    quantity: 1,
  });

  const [openEventModal, setOpenEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventForm, setEventForm] = useState({
    name: "",
    email: "",
    phone: "",
    people: 1,
  });

  useEffect(() => {
    if (!user) return;

    (async () => {
      const productsRes = await api.get("/products");
      setProducts(productsRes.data);

      const eventsRes = await api.get("/events");
      setEvents(eventsRes.data);

      const cartRes = await api.get("/me/cart");
      setAddedProducts(cartRes.data.map((p) => p._id));

      const bookedRes = await api.get("/me/events");
      setBookedEvents(bookedRes.data.map((e) => e._id));
    })();
  }, [user]);

  const handlePlaceOrderClick = (product) => {
    if (!user) return alert("Login first!");
    setSelectedProduct(product);
    setProductForm({
      ...productForm,
      name: user.name || "",
      email: user.email || "",
    });
    setOpenProductModal(true);
  };

  const handleConfirmProductOrder = async () => {
    if (!selectedProduct) return;

    try {
      await api.post(`/products/${selectedProduct._id}/add-to-cart`, productForm);
      alert(`${selectedProduct.name} added to cart!`);
      setAddedProducts((prev) => [...prev, selectedProduct._id]);
      setOpenProductModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    }
  };

  const handleBookTicket = (event) => {
    if (!user) return alert("Login first!");
    setSelectedEvent(event);
    setEventForm({
      ...eventForm,
      name: user.name || "",
      email: user.email || "",
    });
    setOpenEventModal(true);
  };

  const handleConfirmEventBooking = async () => {
    if (!selectedEvent) return;

    try {
      await api.post(`/events/${selectedEvent._id}/book`, eventForm);
      alert(`Ticket booked for ${eventForm.people} people!`);
      setBookedEvents((prev) => [...prev, selectedEvent._id]);
      setOpenEventModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to book ticket");
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* PRODUCTS SECTION */}
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <ShoppingCart fontSize="large" /> Featured Products
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {products.map((p) => (
            <Grid item xs={12} sm={6} md={4} key={p._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                {p.image && (
                  <CardMedia component="img" height="200" image={p.image} alt={p.name} sx={{ objectFit: "cover" }} />
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {p.name}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip label={`$${p.price}`} color="primary" size="small" />
                    {p.category && <Chip label={p.category} size="small" variant="outlined" />}
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {p.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {addedProducts.includes(p._id) ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<ShoppingCart />}
                      onClick={() => navigate("/dashboard")}
                    >
                      View in Cart
                    </Button>
                  ) : (
                    <Button fullWidth variant="contained" onClick={() => handlePlaceOrderClick(p)}>
                      Add to Cart
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* EVENTS SECTION */}
      <Paper elevation={0} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
          <EventAvailable fontSize="large" /> Upcoming Events
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Grid container spacing={3}>
          {events.map((e) => (
            <Grid item xs={12} sm={6} md={4} key={e._id}>
              <Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {e.title}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                    <Chip label={new Date(e.date).toLocaleDateString()} size="small" />
                    <Chip label={e.location} size="small" variant="outlined" />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {e.description}
                  </Typography>
                </CardContent>
                <CardActions>
                  {bookedEvents.includes(e._id) ? (
                    <Button
                      fullWidth
                      variant="contained"
                      color="success"
                      startIcon={<EventAvailable />}
                      onClick={() => navigate("/dashboard")}
                    >
                      View Tickets
                    </Button>
                  ) : (
                    <Button fullWidth variant="contained" onClick={() => handleBookTicket(e)}>
                      Book Now
                    </Button>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>

      {/* PRODUCT ORDER MODAL */}
      <Dialog open={openProductModal} onClose={() => setOpenProductModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Order {selectedProduct?.name}</Typography>
          {selectedProduct && (
            <Typography variant="subtitle1" color="text.secondary">
              ${selectedProduct.price} each
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                required
                value={productForm.name}
                onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                required
                value={productForm.email}
                onChange={(e) => setProductForm({ ...productForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Shipping Address"
                fullWidth
                margin="normal"
                required
                multiline
                rows={2}
                value={productForm.address}
                onChange={(e) => setProductForm({ ...productForm, address: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                required
                value={productForm.phone}
                onChange={(e) => setProductForm({ ...productForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 1 }}
                value={productForm.quantity}
                onChange={(e) => setProductForm({ ...productForm, quantity: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenProductModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmProductOrder}>
            Place Order
          </Button>
        </DialogActions>
      </Dialog>

      {/* EVENT BOOKING MODAL */}
      <Dialog open={openEventModal} onClose={() => setOpenEventModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6">Book {selectedEvent?.title}</Typography>
          {selectedEvent && (
            <Typography variant="subtitle1" color="text.secondary">
              {new Date(selectedEvent.date).toLocaleDateString()} • {selectedEvent.location}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                fullWidth
                margin="normal"
                required
                value={eventForm.name}
                onChange={(e) => setEventForm({ ...eventForm, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email"
                type="email"
                fullWidth
                margin="normal"
                required
                value={eventForm.email}
                onChange={(e) => setEventForm({ ...eventForm, email: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Phone Number"
                fullWidth
                margin="normal"
                required
                value={eventForm.phone}
                onChange={(e) => setEventForm({ ...eventForm, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Number of People"
                type="number"
                fullWidth
                margin="normal"
                required
                inputProps={{ min: 1 }}
                value={eventForm.people}
                onChange={(e) => setEventForm({ ...eventForm, people: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEventModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleConfirmEventBooking}>
            Confirm Booking
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
