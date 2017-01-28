class ClassController {
    constructor(){
    }

    init(req, res, next){
        if (!this.ObjectId)
          this.ObjectId = require('mongodb').ObjectID;
        this.collection = req.db.collection('classes');
        this.db = req.db;
        this.res = res;
        next();
    }

    handleDbError(error) {
      this.db.close();
      return this.res.send(error);
    }
    get(req, res) {
      this.collection.aggregate([
        {
          $match: {
            className: 'Sample Class'
          }
        }, {
          $lookup: {
            from: 'students',
            localField: 'student_ids',
            foreignField: '_id',
            as: 'students'
          }
        }
      ], (error, result) => {
        if (error) return this.handleDbError(error);
        if (result.length === 0) {
          /*
             this.insertSample(req, res, this.get(req, res));
             this gives error, why??
          */
          this.insertSample(req, res, () => this.get(req, res));
        }
        else {
          req.db.close();
          res.send(result);
        }
      });
    }
    insertSample(req, res, next) {
      this.collection.insertMany(
        [{className: 'Sample Class', student_ids: [ 1 ]}],
        null, (error, result) => {
          if (error) return this.handleDbError(error);
          else if (next) next();
          else {
            console.log("===========");
            this.db.close();
            res.send(result);
          }
        }
      );
    }
}

module.exports = new ClassController();
