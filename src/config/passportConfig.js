import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcryptjs";
import User from "../models/user.js";


passport.use(new LocalStrategy(
  async(username, password, done) => {
    try{
const user = await User.findOne({username});
if(!user) return done(null, false, {message: "user not found"});

const isMatch = await bcrypt.compare(password, user.password);
if(isMatch) return done(null, user);
else return done(null, false, {message: "Incorrect password"});
    }catch(error){
return done(error);
    }
  })
);


passport.serializeUser((user, done) =>{
  console.log("Serialize User Id: ", user._id);
  done(null, user._id);
});


passport.deserializeUser( async(_id, done) =>{
  try{
  console.log("We are inside deserilizeUser");
  const user = await User.findById(_id);
  if(!user){
    console.log("User not found in DB");
    return done(null, false)
    
  }
  done(null, user);
  }catch(error){
done(error, null);
  }
});