/*
    option1: require as middleware
*/

// could be either student or students
/*
    option2: dynamic require as middleware

    const fs = require('fs');
    const path = require('path');
    const routers = path.join(__dirname, 'routers');
    fs
        .readdirSync(routers)
        .filter((file) => {
            return file.charAt(0) !== '.';
        })
        .forEach((file) => {
            const router = path.join(routers, file);
            app.use('/' + file, require(router));
        });
*/

/*
    option3: pass app to router, you can use the dynamic way, too. (my favorite one)

    //server.js
    require(router)(app);

    // router.js
    module.exports = (app)=>{
        app.route('/students?', (req, res)=>{});
    };
*/
const app = require('express')();

const mongodb = require('mongodb');
const assert = require('assert');

// const studentRouter = require('./routers/student');
const classRouter = require('./routers/class');

const dbClient = mongodb.MongoClient;
const dbUrl = "mongodb://localhost:27017/schola-demo-p3"


app.use((req, res, next) => {
  dbClient.connect(dbUrl, (err, db) => {
    assert.equal(null, err);
    req.db = db;
    console.log("connect successfully to db server");
    next();
  });
});
// app.use('/students?', studentRouter);
require('./routers/student')(app);
app.use('/class(es)?', classRouter);



app.listen(3000, () => {
    console.log('server start');
});
