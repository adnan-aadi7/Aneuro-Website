import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import connectDB from '../config/db.js';

// ------------------- Facebook Strategy Setup -------------------
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: process.env.FACEBOOK_CALLBACK_URL,
      profileFields: ['id', 'displayName', 'photos', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, photos, emails } = profile;
        const email = emails?.[0]?.value;
        const profileImage = photos?.[0]?.value;

        if (!email) return done(new Error('Email not found in Facebook profile'), null);

        let user = await User.findOne({ email });

        if (user) {
          // Update profile image if missing
          if (!user.profileImage && profileImage) {
            user.profileImage = profileImage;
            await user.save();
          }
        } else {
          // Create a new user
          user = await User.create({
            name: displayName,
            email,
            password: `facebook_${id}`, // Placeholder password
            profileImage: profileImage || '',
            userType: 'user',
            accountStatus: 'active',
          });
        }

        done(null, user);
      } catch (error) {
        done(error, null);
      }
    }
  )
);

// ------------------- Session Handling -------------------
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    await connectDB();
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

// ------------------- JWT Generation -------------------
export const generateFacebookToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      userType: user.userType,
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

// ------------------- Facebook Middleware -------------------
export const authenticateFacebook = passport.authenticate('facebook', {
  scope: ['email'],
});

export const authenticateFacebookCallback = passport.authenticate('facebook', {
  failureRedirect: '/login',
  session: false,
  failWithError: true,
});

export default passport;
