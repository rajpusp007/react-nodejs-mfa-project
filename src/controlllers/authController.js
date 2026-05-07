import User from "../models/user.js";
import bcrypt from "bcryptjs";
import speakeasy from "speakeasy";
import qrCode from "qrcode";
import jwt from "jsonwebtoken";
export const register = async (req, resp)=> {
  try{
const {username, password} = req.body;
const hashedPassword = await bcrypt.hash(password, 10);
const newUser = new User({
  username,
  password: hashedPassword,
  isMfaActive: false,
});
console.log("New User : ", newUser);
await newUser.save();
resp.status(201).json({ message: "User registered successfully"});
  }catch(error) {
resp.status(500).json({ error: "Error registering user", message: error});
  }
};
export const login = async (req, resp)=> {
  console.log("The authenticated user is : ", req.user);
  resp.status(200).json({message: "User logged in successfully",
    username: req.user.username,
    isMfaActive: req.user.isMfaActive,
  });

};
export const authStatus = async (req, resp)=> {
  if(req.user){
    resp.status(200).json({
      message: "User logged in successfully",
      username: req.user.username,
      isMfaActive: req.user.isMfaActive,
    });
  } else{
    resp.status(401).json({ message: "Unauthorized user" });
  }
};
export const logout = async (req, resp)=> {
  if(!req.user) resp.status(401).json({ message: "Unauthorized user" });
  req.logout((err) =>{
    if(err) return resp.status(400).json({ message: "User Not logged in"});
    resp.status(200).json({ message: "Logged out successfully"});
  });
};
export const setup2FA = async (req, resp)=> {
  try{
console.log("The req.user is : ", req.user);
const user = req.user;
var secret = speakeasy.generateSecret();
console.log("The secret object is : ", secret);
user.twoFactorSecret = secret.base32;
user.isMfaActive = true;
await user.save();
const url = speakeasy.otpauthURL({
  secret: secret.base32,
  label: `${req.user.username}`,
  issuer: "www.pusprajmishra.com",
  encoding: "base32",

});
const qrImageUrl = await qrCode.toDataURL(url);
resp.status(200).json({
  secret: secret.base32,
qrCode: qrImageUrl,
});
  }catch(error) {
resp.status(500).json({ error: "Error setting up 2FA", message: "error" });
  }
 
};
export const verify2FA = async (req, resp)=> {
  const {token} = req.body;
  const user = req.user;
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: "base32",
    token,
  });
  if(verified){
    const jwtToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: "1hr" } 

    );
    resp.status(200).json({ message: "2FA successful", token: jwtToken});
  }else{
    resp.status(400).json({message: "Invalid 2FA token"})
  }
};
export const reset2FA = async (req, resp)=> {
  try{
const user = req.user;
user.twoFactorSecret = "",
user.isMfaActive = false;
await user.save();
resp.status(200).json({message: "2FA reset succssful"});
resp.status(200).json({message: "2FA reset successful"});
  }catch{
    resp.status(500).json({ error: "Error reseting 2FA", message: error});
  }
};


