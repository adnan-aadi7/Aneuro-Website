import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import jwt from 'jsonwebtoken';
import User from '../model/User.js';
import connectDB from '../config/db.js';

// ------------------- Google Strategy Setup -------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { id, displayName, emails, photos } = profile;
        const email = emails?.[0]?.value;
        const profileImage = photos?.[0]?.value;

        if (!email) return done(new Error('Email not found in Google profile'), null);

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
            password: `google_${id}`, // Placeholder password
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
export const generateGoogleToken = (user) => {
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

// ------------------- Google Middleware -------------------
export const authenticateGoogle = passport.authenticate('google', {
  scope: ['profile', 'email'],
  accessType: 'offline',
  prompt: 'consent',
});

export const authenticateGoogleCallback = passport.authenticate('google', {
  failureRedirect: '/login',
  session: false,
  failWithError: true,
});

export default passport;
