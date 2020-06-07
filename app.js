const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("mongoose");


const app = express();

//set public folder
app.use(express.static(path.join(__dirname, "public")));

// bodyparser middelware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// enable cors
app.use(cors());

//routes
const poll = require("./routes/poll")
app.use("/poll", poll);

// connect to DB
const config = require("./config/db");
db.connect(config.database,
    { useNewUrlParser: true }, () => {
        console.log("DB Connected...")
    })


//Port
const port = 3000;
app.listen(port, () => {
    console.log(`Server is working on port ${port}`)
});