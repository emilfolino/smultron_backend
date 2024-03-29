const database = require('../db/database.js');

const places = {
    getAll: async function getAll() {
        let db = await database.openDb();

        try {
            const allPlaces = await db.all(`SELECT u.username, u.email, p.name, p.url, p.latitude, p.longitude FROM places p INNER JOIN users u ON u.ROWID=p.user_id`);

            return allPlaces;
        } catch(error) {
            return {
                errors: {
                    status: error.status,
                    message: error.message,
                }
            };
        } finally {
            await db.close();
        }
    },

    create: async function create(newPlace, userId) {
        let db = await database.openDb();

        try {
            const result = await db.run(
                'INSERT INTO places (name, url, latitude, longitude, user_id) VALUES (?, ?, ?, ?, ?)',
                newPlace.name,
                newPlace.url,
                newPlace.latitude,
                newPlace.longitude,
                userId,
            );

            return { ...newPlace, id: result.lastID };
        } catch(error) {
            return {
                errors: {
                    status: error.status,
                    message: error.message,
                }
            };
        } finally {
            await db.close();
        }
    },
};

module.exports = places;
