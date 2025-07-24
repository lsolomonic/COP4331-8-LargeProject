require('dotenv').config(); 
const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URI;
const client = new MongoClient(url);
const { ObjectId } = require('mongodb');

client.connect().then(() => {
  console.log("Connected to MongoDB Atlas");
});
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const saltRounds = 10;
let cardList = [
  'Babe Ruth', 'Hank Aaron', 'Willie Mays', 'Ted Williams',
  'Lou Gehrig', 'Stan Musial', 'Barry Bonds', 'Ken Griffey, Jr.',
  'Derek Jeter', 'Rickey Henderson', 'Cal Ripken, Jr.', 'Jackie Robinson',
  'Cy Young', 'Sandy Koufax', 'Nolan Ryan'
];
const app = express();

const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.listen(5000, '0.0.0.0', () => {
  console.log("Listening on port 5000...");
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  let id = -1, fn = '', ln = '', error = '';

  try {
    const db = client.db('COP4331Cards');
    const user = await db.collection('Users').findOne({ Login: login });

    if (!user) {
      return res.status(403).json({error: "Account doesn't exist!"});
    }

    if (user && await bcrypt.compare(password, user.Password)) {
      if (!user.Verified) {
        return res.status(403).json({ error: 'Please verify your email first.' });
      }

      id = user._id.toString();
      fn = user.FirstName;
      ln = user.LastName;
    } else {
      error = 'Invalid user name/password';
    }
  } catch (err) {
    console.error('Login error:', err);
    error = 'Server error during login.';
  }

  res.status(200).json({ id, firstName: fn, lastName: ln, error });
});


app.post('/api/addcard', async (req, res) => {
  const { userId, card } = req.body;
  const newCard = { Card: card, UserId: userId };
  let error = '';

  try {
    const db = client.db('COP4331Cards');
    await db.collection('Cards').insertOne(newCard);
  } catch (e) {
    error = e.toString();
  }

  const ret = { error };
  res.status(200).json(ret);
});
app.post('/api/searchcards', async (req, res) => {
  const { userId, search } = req.body;
  const _search = search.trim();
  let error = '';
  let _ret = [];

  try {
    const db = client.db('COP4331Cards');
    const results = await db.collection('Cards').find({
      Card: { $regex: _search + '.*', $options: 'i' },
      UserId: userId
    }).toArray();

    _ret = results.map(r => r.Card);
  } catch (e) {
    error = e.toString();
  }

  const ret = { results: _ret, error };
  res.status(200).json(ret);
});

app.post('/api/register', async (req, res) => {
  const { firstName, lastName, login, password, email } = req.body;

  if (!firstName || !lastName || !login || !password || !email)
    return res.status(400).json({ error: 'All fields are required.' });

  try {
    const db     = client.db('COP4331Cards');
    const users  = db.collection('Users');

    const existing = await users.findOne({ Login: login });
    if (existing)
      return res.status(409).json({ error: 'Username already exists, Please Login' });

    const max    = await users.find().sort({ UserID: -1 }).limit(1).toArray();
    const nextId = max.length ? max[0].UserID + 1 : 1;

    const hash  = await bcrypt.hash(password, saltRounds);
    const token = crypto.randomBytes(32).toString('hex');

    const newUser = {
      UserID: nextId,
      Login: login,
      Password: hash,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      myPlaces: [],
      Verified: false,
      VerificationToken: token
    };
    await users.insertOne(newUser);

    // build web link vs dev vs prod
    const origin       = req.get('origin');
const isDev        = origin && origin.includes('localhost');
const verifyPage   = isDev
  ? 'http://localhost:5000'
  : process.env.SERVER_URL;            // e.g. https://group12cop4331.xyz

const verificationLink = `${verifyPage}/api/verify/${token}/page`

const msg = {
  to: email,
  from: process.env.SENDGRID_FROM,
  subject: 'Welcome! Please verify your email',
  html: `
    <h2>Welcome, ${firstName}!</h2>
    <p>Click the link below to verify your email and then log in:</p>
    <p><a href="${verificationLink}">Verify &amp; Log In</a></p>
    <p>If you did not sign up, simply ignore this email.</p>
  `
};

    await sgMail.send(msg);

    res.status(201).json({
      id: nextId,
      firstName,
      lastName,
      error: ''
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Server error creating account.' });
  }
});

app.post('/api/reviews', async (req, res) => {
  const { user, building, vibes, comment } = req.body;

  if (!user || !building || !vibes) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  try {
    const db = client.db('COP4331Cards');
    const reviews = db.collection('Reviews');

    const newReview = {
      user,
      building,
      vibes,
      comment: comment || '',
      createdAt: new Date()
    };

    const result = await reviews.insertOne(newReview);

    res.status(201).json({ id: result.insertedId, ...newReview });
  } catch (err) {
    console.error('Error creating review:', err);
    res.status(500).json({ error: 'Failed to create review.' });
  }
});

app.get('/api/reviews/building/:buildingId', async (req, res) => {
  try {
    const db = client.db('COP4331Cards');
    const reviews = db.collection('Reviews');

    const buildingId = req.params.buildingId;
    const buildingReviews = await reviews.find({ building: buildingId }).toArray();

    res.json(buildingReviews);
  } catch (err) {
    console.error('Error fetching reviews:', err);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});

app.get('/api/verify/:token', async (req, res) => {
  const token = req.params.token;
  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');

    const user = await users.findOne({ VerificationToken: token });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired verification token.' });
    }

    await users.updateOne(
      { VerificationToken: token },
      { $set: { Verified: true }, $unset: { VerificationToken: "" } }
    );

    res.status(200).json({ message: 'Email successfully verified.' });
  } catch (err) {
    console.error('Verification error:', err);
    res.status(500).json({ error: 'Server error verifying email.' });
  }
})
app.get('/api/verify/:token/page', async (req, res) => {
  const { token } = req.params;
  try {
    const db    = client.db('COP4331Cards');
    const users = db.collection('Users');

    const user = await users.findOne({ VerificationToken: token });
    if (!user) {
      return res
        .status(400)
        .send(`<h1>Verification failed</h1><p>Invalid or expired token.</p>`);
    }

    // mark verified
    await users.updateOne(
      { VerificationToken: token },
      { $set: { Verified: true }, $unset: { VerificationToken: "" } }
    );

const webAppHome = process.env.CLIENT_URL || 'http://group12cop4331.xyz';  
res.send(`
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8">
      <title>Email Verified</title>
      <!-- redirect to home instead of /login -->
      <meta http-equiv="refresh" content="5;url=${webAppHome}" />
      <style>
        body { font-family: sans-serif; text-align: center; padding: 2rem; }
        a { color: #007BFF; text-decoration: none; }
      </style>
    </head>
    <body>
      <h1>✅ Your email is verified!</h1>
      <p>You will be redirected to the home page in 5 seconds.</p>
      <p><a href="${webAppHome}">Or click here to go to the home page now</a></p>
    </body>
  </html>
`);

  } catch (err) {
    console.error('Error serving verify page:', err);
    res.status(500).send('<h1>Server error</h1><p>Please try again later.</p>');
  }
});
app.get('/api/places/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');
    const buildings = db.collection('Buildings');

    const user = await users.findOne({ _id: new ObjectId(userId) });

    if (!user || !Array.isArray(user.myPlaces)) {
      return res.status(404).json({ error: 'User not found or no saved places.' });
    }

    // Convert numbers to strings to match Buildings._id type
    const placeIds = user.myPlaces.map(id => id.toString());

    const favorites = await buildings.find({
      _id: { $in: placeIds }
    }).toArray();

    res.json(favorites);
  } catch (err) {
    console.error('Error fetching favorite places:', err);
    res.status(500).json({ error: 'Server error fetching favorite places.' });
  }
});


app.post('/api/places/add', async (req, res) => {
  const { userId, building, vibe, location } = req.body;
  const userObjectId = new ObjectId(userId);
  
  if (!userObjectId || !building || !vibe) {
    return res.status(400).json({ error: 'UserId, building, and vibe are required.' });
  }

  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');
    const buildings = db.collection('Buildings');

    const buildingId = (Math.floor(Math.random() * 9000) + 1000).toString();

    await buildings.insertOne({
      _id: buildingId,
      building,
      vibe,
      location
    });

    const updateResult = await users.updateOne(
      { _id: userObjectId },
      { $addToSet: { myPlaces: buildingId } }  // store as string
    );

    if (updateResult.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.status(200).json({ message: 'Building added to favorites successfully.' });

  } catch (err) {
    console.error('Error adding to favorites:', err);
    res.status(500).json({ error: 'Server error adding favorite place.' });
  }
})
  
app.get('/api/buildings/filter/:vibeType', async (req, res) => {
    const { vibeType } = req.params;

    try {
      const db = client.db('COP4331Cards');
      const buildings = db.collection('Buildings');

      const matchedBuildings = await buildings.find({ vibe: new RegExp(`^${vibeType}$`, 'i') }).toArray();

      res.status(200).json(matchedBuildings);
    } catch (err) {
      console.error('Error fetching buildings by vibe:', err);
      res.status(500).json({ error: 'Server error fetching buildings by vibe.' });
    }
  })
  
  app.get('/api/buildings/search', async (req, res) => {
  const { query } = req.query;

  if (!query || query.trim() === '') {
    return res.status(400).json({ error: 'Query parameter is required.' });
  }

  try {
    const db = client.db('COP4331Cards');
    const buildings = db.collection('Buildings');

    const results = await buildings.find({
      building: { $regex: query, $options: 'i' } // case-insensitive substring match
    }).toArray();

    res.status(200).json(results);
  } catch (err) {
    console.error('Error searching buildings:', err);
    res.status(500).json({ error: 'Server error searching buildings.' });
  }
});

app.delete('/api/places/:userId/:placeId', async (req, res) => {
  const { userId, placeId } = req.params;

  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');
    const buildings = db.collection('Buildings');

    const objectId = new ObjectId(userId);
    // no need to change to number if stored as a string
    // const placeIdAsNumber = parseInt(placeId);

    const result = await users.updateOne(
      { _id: objectId },
      { $pull: { myPlaces: placeId } }
      //placeId used to be placeIdAsNumber
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (result.modifiedCount === 0) {
      return res.status(400).json({ error: 'Place not in favorites.' });
    }

    const deleteResult = await buildings.deleteOne({ _id: placeId });
    //used to be placeId as Number

    if (deleteResult.deletedCount === 0) {
      console.warn('Building not found in Buildings collection.');
    }

    return res.json({ message: 'Place removed from favorites and deleted from database.' });

  } catch (err) {
    console.error('DELETE /api/places error:', err);
    res.status(500).json({ error: 'Server error.' });
  }
});


app.put('/api/myplaces/update', async (req, res) => {
  const { userId, buildingId, building, vibe, location } = req.body;

  if (!userId || !buildingId) {
    return res.status(400).json({ error: 'Missing userId or buildingId.' });
  }

  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');
    const buildings = db.collection('Buildings');

    const objectId = new ObjectId(userId);
    const buildingIdStr = buildingId.toString();       // for Buildings collection
    const buildingIdNum = parseInt(buildingId);        // for myPlaces array

    //Update the Building document
    const updateFields = {};
    if (building) updateFields.building = building;
    if (vibe) updateFields.vibe = vibe;
    if (location) updateFields.location = location;

    await buildings.updateOne(
      { _id: buildingIdStr },
      { $set: updateFields }
    );

    //Ensure buildingId exists in user's myPlaces
    await users.updateOne(
      { _id: objectId },
      { $addToSet: { myPlaces: buildingIdStr } }  // store as number (we need string)
    );

    res.status(200).json({ message: 'Update successful.' });

  } catch (err) {
    console.error("Error in PUT /myplaces/update:", err);
    res.status(500).json({ error: 'Server error updating place.' });
  }
});

app.post('/api/forgot-password', async (req, res) => {
  const { username, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: 'Username and email required.' });
  }

  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');

    const user = await users.findOne({ Login: username, Email: email });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiration = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await users.updateOne(
      { _id: user._id },
      { $set: { ResetToken: token, ResetTokenExpiration: expiration } }
    );

    const origin = req.get('origin');
    const isDev = origin && origin.includes('localhost');
    const resetLink = `${isDev ? 'http://localhost:5173' : process.env.CLIENT_URL}/reset/${token}`;

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: 'Reset your password',
      html: `
        <h2>Reset Password</h2>
        <p>Click below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>This link expires in 1 hour.</p>
      `
    };

    await sgMail.send(msg);
    res.status(200).json({ message: 'Password reset email sent.' });
  } catch (err) {
    console.error('Forgot password error:', err);
    res.status(500).json({ error: 'Server error sending reset email.' });
  }
});

app.post('/api/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ error: 'Token and password required.' });
  }

  try {
    const db = client.db('COP4331Cards');
    const users = db.collection('Users');

    const user = await users.findOne({
      ResetToken: token,
      ResetTokenExpiration: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ error: 'Invalid or expired token.' });
    }

    const hash = await bcrypt.hash(newPassword, saltRounds);

    await users.updateOne(
      { _id: user._id },
      {
        $set: { Password: hash },
        $unset: { ResetToken: "", ResetTokenExpiration: "" }
      }
    );

    res.status(200).json({ message: 'Password successfully reset.' });
  } catch (err) {
    console.error('Reset password error:', err);
    res.status(500).json({ error: 'Server error resetting password.' });
  }
});