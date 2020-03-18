const Mongoose = require('mongoose');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    state: {
      type: String
    },
    taskDataName: {
      type: String
    },
    result: {
      type: Object
    },
    err: {
      type: String
    },
    time: {
      type: Number
    },
    filename: String,
    creator: {
      type: String
    },
    team: { 
      type: Mongoose.Schema.ObjectId,
      ref: 'Team' 
    }
  });

  return mongoose.model('Catcher', schema);
};
