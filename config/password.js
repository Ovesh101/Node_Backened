/* eslint-disable no-undef */
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { createJWT } from '../utils/tokenUtils.js';
import User from "../models/UserModel.js"
import dotenv from 'dotenv';

dotenv.config();

passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    // eslint-disable-next-line no-undef
    clientSecret: process.env.CLIENT_SECRET_KEY,
    callbackURL: 'callback',
    scope: ["profile", "email"]
},
async (accessToken, refreshToken, profile, done) => {
    try {
        let user = await User.findOne({ googleId: profile.id });
        console.log("User in google" , user);

        if (!user) {
            user = new User({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
            });

            console.log("User in google" , user);
            await user.save();
        }

        const token = createJWT({ userId: user._id, googleId: user.googleId });


        // Include name and id in the user object returned to done
        return done(null, { token, userId: user._id, name: user.name });
    } catch (error) {
        return done(error, false);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user);
       // The USER object is the "authenticated user" from the done() in authUser function.
     // serializeUser() will attach this user to "req.session.passport.user.{user}", so that it is tied to the session object for each session.
});

passport.deserializeUser((user, done) => {

    // here the suer is stored in req.user = user
    done(null, user);
      // This is the {user} that was saved in req.session.passport.user.{user} in the serializationUser()
        // deserializeUser will attach this {user} to the "req.user.{user}", so that it can be used anywhere in the App.    
});

export default passport;