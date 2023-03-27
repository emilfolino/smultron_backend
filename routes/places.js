const express = require('express');
const router = express.Router();

const placesModel = require("../models/places.js");

router.get("/", async (req, res) => {
    const allPlaces = await placesModel.getAll();

    if (allPlaces.hasOwnProperty("errors")) {
        const status = allPlaces.errors.status;

        return res.status(status).json(allPlaces);
    }

    return res.json({
        data: allPlaces
    });
});

module.exports = router;
