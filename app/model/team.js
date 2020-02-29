module.exports = app => {
  const mongoose = app.mongoose;
  const Schema = mongoose.Schema;
  const schema = new Schema({
    teamName: {
      type: String
    },
    dsc: {
      type: String
    },
    memberInvite: {
      type: Boolean
    },
    avatar: {
      type: []
    },
    admin: {
      type: String
    },
    members: {
      type: []
    }
  });

  return mongoose.model('Team', schema);
};
