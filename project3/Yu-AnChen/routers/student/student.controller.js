class StudentController {
    constructor() {
    }
    init(req, res, next) {
        if (!this.ObjectId)
          this.ObjectId = require('mongodb').ObjectID;
        this.collection = req.db.collection('students');
        this.db = req.db;
        this.res = res;
        next();
    }
    handleDbError(error) {
      this.db.close();
      return this.res.send(error);
    }
    get(req, res) {
      this.collection.find({}).toArray((error, result) => {
        if (error) return this.handleDbError(error);
        if (result.length === 0) {
          this.insertSample(req, res);
        }
        else {
          req.db.close();
          res.send(result);
        }
      });
    }
    insertSample(req, res) {
      this.collection.insertMany(
        [{firstName: 'Sam', lastName: 'Paul', _id: 1}],
        null, (error, result) => {
          if (error) return this.handleDbError(error);
          else {
            this.db.close();
            res.send(result);
          }
        }
      );
    }
    getTime(req, res) {
      res.send(new Date(Date.now()));
    }
}

module.exports = new StudentController();
