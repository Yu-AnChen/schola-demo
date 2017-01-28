// students/route.js
// const express = require('express');
// const router = express.Router();
const StudentController = require('./student.controller');
const routeName = `/students?`;

// router.use(StudentController.init.bind(StudentController));
// router.get('/', StudentController.get.bind(StudentController));
// router.get('/time', StudentController.getTime.bind(StudentController));
// router.get('/insert', StudentController.insert.bind(StudentController));
// module.exports = router;

module.exports = (app) => {
  app.use(`${routeName}`, StudentController.init.bind(StudentController));

  app.route(`${routeName}`)
    .get(StudentController.get.bind(StudentController));

  app.route(`${routeName}/time`)
    .get(StudentController.getTime.bind(StudentController));

  app.route(`${routeName}/insert`)
    .get(StudentController.insertSample.bind(StudentController));

}
