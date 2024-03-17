const mongoose = require("mongoose");
const configs = require('./config');
require('dotenv').config()

try {
    console.log(process.env.NODE_ENV == "development" ? process.env.Local_DB_URI : process.env.MONGO_URI);
    mongoose.connect(
        process.env.NODE_ENV == "development" ? `${process.env.Local_DB_URI}/${process.env.DB_NAME}` : process.env.MONGO_URI,
        { useNewUrlParser: true, useUnifiedTopology: true }
    );

    const db = mongoose.connection;
    db.on("error", (err) => {
        console.error("MongoDB connection error:", err);
    });
    return db.once("open", () => {
        console.log("Connected to MongoDB");
    });
} catch (error) {
    console.error(error);
}