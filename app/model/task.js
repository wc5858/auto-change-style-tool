const Mongoose = require('mongoose');

module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    site: {
      type: String
    },
    url: {
      type: String
    },
    bgMappingType: {
      type: String,
      enum: ['area', 'times']
    },
    colorDataName: {
      type: {
        colorDataId: { type: Mongoose.Schema.ObjectId, ref: 'Color' },
        name: {
          type: String
        }
      }
    },
    componentDataNames: {
      type: [{
        componentDataId: { type: Mongoose.Schema.ObjectId, ref: 'Component' },
        name: {
          type: String
        }
      }]
    },
    subTasks: {
      type: [{
        pac: { type: Number, min: 1, max: 10 },
        threshold1: { type: Number, min: 0, max: 1 },
        threshold2: { type: Number, min: 0, max: 1 },
        taskList: { type: [{
          name: {type: String },
          success: { type: Boolean },
          error: {type: String },
          wait: Boolean,
          result: Schema.Types.Mixed,
          screenshot: String,
          time: Number
        }] },
        success: { type: Boolean },
        dataFile: Object,
        data: Object
      }]
    },
    state: {
      type: String
    },
    err: {
      type: String
    },
    result: {
      type: Object
    },
    creator: {
      type: String
    },
    team: { 
      type: Mongoose.Schema.ObjectId,
      ref: 'Team' 
    }
  });

  return mongoose.model('Task', schema);
};
