
const mongoose = require('mongoose');
const db = require('./config/keys').mongoURI;
const express = require("express");
const app = express(); // Initialize Express server
const bodyParser = require("body-parser");  // Middlewear for parsing the request body
const port = process.env.PORT || 5000; // Which port app runs on (process.env.port for Heroku, 5000 for local development)
const passport = require('passport');
const users = require("./routes/api/users");
const weights = require("./routes/api/weights");

mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => console.log("Connected to MongoDB successfully"))
  .catch(err => console.log(err));

// Employ bodyParser to parse the request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Send message to indicate app is listening
app.listen(port, () => console.log(`Server is running on port ${port}`))

// Middleware facilitates jwt
app.use(passport.initialize());
require('./config/passport')(passport);

// Tell express to use APIs with prefix "/api/users"
// Any endpoint defined in users will need this prefix
app.use("/api/users", users);
app.use("/api/weights", weights);

const path = require('path');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'));
  })
}