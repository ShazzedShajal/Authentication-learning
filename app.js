const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const multer = require("multer");
const upload = multer();
const User = require("./models/user.model");

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


app.post("/register", async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: "User is created", data: user });
    } catch (error) {
        res.status(500).json({ message: "User is not created", error: error });
    }

});

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        else if (user.password !== password) {
            return res.status(400).json({ message: "Invalid password" });
        }
        res.status(200).json({ message: "User logged in successfully" });

    } catch (error) {
        res.status(500).json({ message: "User is not logged in", error: error });
    }
});

app.use((req, res) => {
    res.status(404).json({ message: "Page not found" });
});


