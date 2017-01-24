// .json 可以直接require讀取，寫入則需要使用fs.
const path = require('path');
const fs = require('fs');
const filePath = path.join(__dirname, 'students.json');
const studentDatas = require(filePath);

// handle datas
// fs.writeFile(filePath, JSON.stringify(studentDatas, null, 4));

const PORT = process.env.PORT || 3000;
const serverApp = require('express')();
const bodyParser = require('body-parser');
serverApp.set('port', PORT);

/*
  middlewares
*/
const testLogger = (req, res, next) => {
  console.log(`Logged: ${new Date(Date.now())}`);
  next();
}

const findStudentWithId = (req, res, next) => {
  res.body = {};
  res.body.student = studentDatas.find((element) => {
    return element._id === Number(req.params.id);
  });
  if (!res.body.student)
    return next(new Error(`can't find student with _id ${req.params.id}`))
  next();
}
const excludeStudentWithId = (req, res, next) => {
  res.restOfStudents = studentDatas.filter((element) => {
    return element._id !== Number(req.params.id);
  });
  next();
}
const updateScores = (req, res, next) => {
  let updatedStudent = JSON.parse(JSON.stringify(res.body.student));
  updatedStudent.scores.forEach((element) => {
    if (element.type == req.body.type)
      element.score = req.body.score;
  })
  res.body.updatedStudent = updatedStudent;
  next();
}
const assembleStudentDatas = (req, res, next) => {
  res.body.studentDatas = [...res.restOfStudents, res.body.updatedStudent];
  res.body.studentDatas.sort((a, b) => {
    return a._id - b._id;
  });
  next();
}
const writeStudentDatasToFile = (req, res, next) => {
  let text = res.body.studentDatas || studentDatas;
  fs.writeFile(filePath, JSON.stringify(text, null, 4), (err) =>{
    if (!err)
      next();
    else
      next(err);
  });
}
const addStudent = (req, res, next) => {
  res.body = {};
  let newId = studentDatas.length;
  req.body["_id"] = newId;
  studentDatas.push(req.body);
  next();
}
const updateDeletedStudentDatas = (req, res, next) => {
  res.body.studentDatas = res.restOfStudents;
  next();
}

serverApp.use(testLogger);
serverApp.use(bodyParser.json());
/*
  CRUD
*/
serverApp.get('/student/:id',
  findStudentWithId,
  (req, res) => {
    res.send(JSON.stringify(res.body.student)
    + " ================================ "
    + JSON.stringify(studentDatas));
  }
);
serverApp.put('/student/:id',
  findStudentWithId,
  excludeStudentWithId,
  updateScores,
  assembleStudentDatas,
  writeStudentDatasToFile,
  (req, res) => {
    res.send(`
      ori:
      ${JSON.stringify(res.body.student, null, 4)}
       ================================
      updated:
      ${JSON.stringify(res.body.updatedStudent, null, 4)}
    `);
  }
)
serverApp.post('/student/',
  addStudent,
  writeStudentDatasToFile,
  (req, res) => {
    res.send(`student ${JSON.stringify(req.body)} uploaded!`);
  }
);
serverApp.delete('/student/:id',
  findStudentWithId,
  excludeStudentWithId,
  updateDeletedStudentDatas,
  writeStudentDatasToFile,
  (req, res) => {
    res.send(res.body.studentDatas);
  }
);
/*
  error handle
*/
serverApp.use((err, req, res, next) => {
  res.status(500).send(err.message);
});

serverApp.listen(serverApp.get('port'), () => {
    console.log('serverApp listening on port ' + serverApp.get('port'));
});




// get '/' > studentDatas
// get '/:name' > studentDate of name
// put '/:name' > if name !found, not found
//              > if name found, update it with req body
// post '/' > if name exist, err
//          > if name !exist, push into array
// delete '/:nme' > if name found, delete data
//                > if !found, err

// helpers
function arrToObjWith_id(arr) {
  return arr.reduce((prev, curr) => {
    prev[curr._id] = curr;
    return prev;
  }, {});
}
