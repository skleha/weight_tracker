const express = require("express");
const router = express.Router();
const Weight = require('../../models/Weight');

// Test route
router.get('/test', (req, res) => res.json({msg: "this is the users route"}))

// Add weight


