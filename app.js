require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const morgan = require('morgan');
const cors = require('cors');

const places = require('./routes/places.js');
const auth = require("./routes/auth.js");

const app = express();

app.use(cors());
app.options('*', cors());

app.disable('x-powered-by');

const port = process.env.PORT || 8545;

// don't show the log when it is test
if (process.env.NODE_ENV !== 'test') {
    // use morgan to log at command line
    app.use(morgan('combined')); // 'combined' outputs the Apache style LOGs
}

app.use(bodyParser.json({limit: '50mb'})); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.join(__dirname, "public")));

app.use("/places", places);
app.use("/auth", auth);

app.get("/", (req, res) => {
    return res.json({
        data: "All the smultronställen in the world."
    });
});

app.use(function (req, res) {
    return res.status(404).json({
        errors: {
            status: 404,
            source: req.path,
            title: "Not found",
            detail: "Could not find path: " + req.path,
        }
    });
});

const server = app.listen(port, () => console.log('Order api listening on port ' + port));

module.exports = server;
