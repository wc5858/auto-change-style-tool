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
    colorDataName: {
      type: String
    },
    componentDataNames: {
      type: [String]
    },
    settings : {
      type: Object
    },
    taskList: {
      type: []
    },
    state: {
      type: String
    },
    err: {
      type: String
    },
    result: {
      type: Object
    }
  });

  return mongoose.model('Task', schema);
};
