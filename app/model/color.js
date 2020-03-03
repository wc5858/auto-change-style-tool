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
    state: {
      type: String
    },
    err: {
      type: String
    },
    time: {
      type: Number
    },
    bgColor: {
      type: Map,
      of: {
        area: {
          type: Number
        },
        times: {
          type: Number
        },
        areaRatio: {
          type: Number
        },
        timesRatio: {
          type: Number
        }
      }
    },
    fontColor: {
      type: Map,
      of: {
        length: {
          type: Number
        },
        lengthRatio: {
          type: Number
        }
      }
    },
    creator: {
      type: String
    },
    team: { 
      type: Mongoose.Schema.ObjectId,
      ref: 'Team' 
    }
  });

  return mongoose.model('Colors', schema);
};
