// students/route.js
const express = require('express');
const router = express.Router();
const StudentController = require('./student.controller');

router.use(StudentController.getMonogoDB.bind(StudentController));
module.exports = router;
