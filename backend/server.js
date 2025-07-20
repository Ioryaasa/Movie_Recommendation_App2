const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movies");
const favoriteRoutes = require("./routes/favorite");
const customWatchlistRoutes = require("./routes/watchlist");
const reviewsRoutes = require("./routes/reviews");
const genreRoutes = require("./routes/genreRoutes");
const discoverRoutes = require("./routes/discoverRoutes");
const userRoutes = require('./routes/userRoutes');


const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/auth', (req, res) => {
  // authentication logic here
  res.send('Login attempt received');
});

// All routes
app.use("/api/auth", authRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/watchlists", customWatchlistRoutes);
app.use("/api/reviews", reviewsRoutes);
app.use("/api/genres", genreRoutes);
app.use("/api/discover", discoverRoutes);
app.use('/api/users', userRoutes);



// Mongoose connection with localhost
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log("Server running on port", process.env.PORT);
    });
  })
  .catch((err) => console.error(err));
