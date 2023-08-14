const express = require('express')
const router = express.Router();
const {auhtMiddlewares} =require('../middlewares/authMiddleware');

router.get('/all-bookings',auhtMiddlewares,isAdmin)