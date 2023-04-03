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

router.post("/", async (req, res) => {
    const result = await placesModel.create(req.body);

    if (result.hasOwnProperty("errors")) {
        const status = result.errors.status;

        return res.status(status).json(result);
    }

    return res.status(201).json({
        data: result
    });
});


module.exports = router;
