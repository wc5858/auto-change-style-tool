const Mongoose = require('mongoose');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    site: {
      type: String
    },
    baseUrl: {
      type: String
    },
    subPages: {
      type: [String]
    },
    pac: {
      type: Number
    },
    state: {
      type: String
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

  return mongoose.model('Component', schema);
};
