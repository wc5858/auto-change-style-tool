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
    }
  });

  return mongoose.model('Task', schema);
};
