
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const chatRoutes = require("./routes/chat.routes");

const app = express();

// middleware
app.use(cors());
app.use(express.json());

// routes
app.use('/api/auth', authRoutes);
app.use("/api/chat", chatRoutes);

// test route
app.get('/', (req, res) => {
  res.send('Apna Doctor Backend Running 🚀');
});

// DB + Server start
mongoose.connect('mongodb://127.0.0.1:27017/apna_doctor')
  .then(() => {
    console.log('MongoDB Connected ✅');
    app.listen(process.env.PORT || 5000, () =>
      console.log(`Server running on port ${process.env.PORT || 5000}`)
    );
  })
  .catch(err => console.log(err));






//   const express = require("express");
// const cors = require("cors");
// require("dotenv").config();

// const connectDB = require("./config/db");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // DB connect
// connectDB();

// // middleware
// app.use(cors());
// app.use(express.json());

// // routes
// app.use("/api/auth", require("./routes/authRoutes"));

// app.get("/", (req, res) => {
//   res.send("Apna Doctor Backend is running 🚀");
// });

// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });



// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // middleware
// app.use(cors());
// app.use(express.json());

// // MongoDB connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB Atlas Connected ✅"))
//   .catch(err => console.error("MongoDB Error ❌", err));

// // test route
// app.get("/", (req, res) => {
//   res.send("Apna Doctor Backend is running 🚀");
// });

// // server start
// app.listen(PORT, () => {
//   console.log(`Server running on http://localhost:${PORT}`);
// });

const symptomRoutes = require("./routes/symptom.routes");

app.use(express.json());

app.use("/api/symptom", symptomRoutes);

// app.use("/api/records", require("./routes/record.routes"));
app.use("/api/records", require("./routes/record.routes"));

const recordRoutes = require("./routes/record.routes");
app.use("/api/records", recordRoutes);

