const express = require('express');
const router = express.Router();

const placesModel = require("../models/places.js");
const authModel = require("../models/auth.js");

router.get("/", async (req, res) => {
    const allPlaces = await placesModel.getAll();

    if (allPlaces.hasOwnProperty("errors")) {
        const status = allPlaces.errors.status;

        return res.status(status || 500).json(allPlaces);
    }

    return res.json({
        data: allPlaces
    });
});

router.post("/",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        console.log(req.body, req.user)
        const result = await placesModel.create(req.body, req.user.user_id);

        if (result.hasOwnProperty("errors")) {
            const status = result.errors.status;

            return res.status(status || 500).json(result);
        }

        return res.status(201).json({
            data: result
        });
    }
);


module.exports = router;
