import e, { Router} from "express";
import passport from "passport";
import { register, login, logout, authStatus, setup2FA, verify2FA, reset2FA } from "../controlllers/authController.js";

const router = Router();

//Registration Route

router.post("/register", register);

//Login Route
router.post("/login", (req, resp, next) =>{ passport.authenticate("local", (err, user, info) =>{
  console.log("Inside authenticate callback");
  if(err) return next(err);
  if(!user){
    return resp.status(401).json(info);
  }
  req.login(user, (err) =>{
    if(err) return next(err);
    console.log("We are inside serializUser SHOULD RUN NOW");
    return resp.json({ message: "Login successfully", user});
    
  });
  
}) (req, resp, next);
});
//Auth Status Route
router.get("/status", authStatus);
//Logout Route
router.post("/logout", logout);

//2FA Route
router.post("/2fa/setup", (req, resp, next) =>{
  if(req.isAuthenticated()) return next();
  resp.status(401).json({message: "Unauthorized "});
}, setup2FA);

//Verify Route
router.post("/2fa/verify", (req, resp, next) =>{
  if(req.isAuthenticated()) return next();
  resp.status(401).json({message: "Unauthorized "});
}, verify2FA);

//Reset Route
router.post("/2fa/reset", (req, resp, next) =>{
  if(req.isAuthenticated()) return next();
  resp.status(401).json({message: "Unauthorized "});
}, reset2FA);


export default router;