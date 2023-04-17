const validator = require("email-validator");
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const database = require("../db/database.js");

const jwtSecret = process.env.JWT_SECRET;

const auth = {
    login: async function(res, body) {
        const email = body.email;
        const password = body.password;
        const apiKey = body.api_key;

        if (!email || !password) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/login",
                    title: "Email or password missing",
                    detail: "Email or password missing in request"
                }
            });
        }

        const db = await database.openDb();

        try {
            const rows = await db.get(
                "SELECT ROWID, email, username, password FROM users WHERE email = ?",
                email,
            );

            if (rows === undefined) {
                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "User not found",
                        detail: "User with provided email not found."
                    }
                });
            }

            const user = rows;

            bcrypt.compare(password, user.password, (err, result) => {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: "/login",
                            title: "bcrypt error",
                            detail: "bcrypt error"
                        }
                    });
                }

                if (result) {
                    let payload = { email: user.email, user_id: user.rowid };
                    let jwtToken = jwt.sign(payload, jwtSecret, { expiresIn: '24h' });

                    return res.status(201).json({
                        data: {
                            type: "success",
                            message: "User logged in",
                            user: payload,
                            token: jwtToken
                        }
                    });
                }

                return res.status(401).json({
                    errors: {
                        status: 401,
                        source: "/login",
                        title: "Wrong password",
                        detail: "Password is incorrect."
                    }
                });
            });
        } catch (e) {
            return res.status(500).json({
                errors: {
                    status: 500,
                    source: "/login",
                    title: "Database error",
                    detail: e.message
                }
            });
        } finally {
            await db.close();
        }
    },

    register: async function(res, body) {
        const email = body.email;
        const password = body.password;
        const username = body.username;
        const apiKey = body.api_key;

        if (!email || !password || !username) {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: "/register",
                    title: "Email, username or password missing",
                    detail: "Email, username or password missing in request"
                }
            });
        }

        bcrypt.hash(password, 10, async function(err, hash) {
            if (err) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "bcrypt error",
                        detail: "bcrypt error"
                    }
                });
            }

            const db = await database.openDb();

            try {
                await db.run(
                    "INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
                    username,
                    email,
                    hash,
                );

                return res.status(201).json({
                    data: {
                        message: "User successfully registered."
                    }
                });
            } catch (e) {
                return res.status(500).json({
                    errors: {
                        status: 500,
                        source: "/register",
                        title: "Database error",
                        detail: e.message
                    }
                });
            } finally {
                await db.close();
            }
        });
    },

    checkToken: function(req, res, next) {
        const token = req.headers['x-access-token'];

        if (token) {
            jwt.verify(token, jwtSecret, function(err, decoded) {
                if (err) {
                    return res.status(500).json({
                        errors: {
                            status: 500,
                            source: req.path,
                            title: "Failed authentication",
                            detail: err.message
                        }
                    });
                }

                req.user = {};
                req.user.user_id = decoded.user_id;
                req.user.email = decoded.email;

                return next();
            });
        } else {
            return res.status(401).json({
                errors: {
                    status: 401,
                    source: req.path,
                    title: "No token",
                    detail: "No token provided in request headers"
                }
            });
        }
    }
};

module.exports = auth;
