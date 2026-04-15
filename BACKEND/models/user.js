import mongoose from "mongoose";
import passportLocalMongoose from "passport-local-mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
});

const plugin = passportLocalMongoose.default || passportLocalMongoose;

userSchema.plugin(plugin, {
  usernameField: "email",
});

const User = mongoose.model("User", userSchema);

export default User;