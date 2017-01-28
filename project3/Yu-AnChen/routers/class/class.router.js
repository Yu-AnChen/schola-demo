// students/route.js
const express = require('express');
const router = express.Router();
const ClassController = require('./class.controller');

router.use(ClassController.init.bind(ClassController));
router.get('/', ClassController.get.bind(ClassController));

module.exports = router;
