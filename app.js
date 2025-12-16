const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const upload = multer();

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log(err));


const app = express();

// these are the middleware
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(upload.none());


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/./views/index.html");
    //res.send("Hello World!");
});



// handling server errors
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something broke!" });
});


app.post("/register", (req, res) => {
    const { name, email, password } = req.body;
    res.status(201).json({ message: "User is created", data: { name, email, password } });
});

app.post("/login", (req, res) => {
    //const { email, password } = req.body;
    res.status(200).json({ message: "User logged in successfully" });
});

app.use((req, res) => {
    res.status(404).json({ message: "Page not found" });
});


