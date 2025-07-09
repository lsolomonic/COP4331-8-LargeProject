require('dotenv').config(); 
const { MongoClient } = require('mongodb');
const url = process.env.MONGO_URI;
const client = new MongoClient(url);

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
  // ... you can add all 100+ from your full list if you want
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

    if (user && await bcrypt.compare(password, user.Password)) {
      if (!user.Verified) {
        return res.status(403).json({ error: 'Please verify your email first.' });
      }

      id = user.UserID;
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

    const max = await users.find().sort({ UserID: -1 }).limit(1).toArray();
    const nextId = max.length ? max[0].UserID + 1 : 1;

    const hash = await bcrypt.hash(password, saltRounds);

    const token = crypto.randomBytes(32).toString('hex');

    const newUser = {
      UserID: nextId,
      Login: login,
      Password: hash,
      FirstName: firstName,
      LastName:  lastName,
      Email: email,
      Verified: false,
      VerificationToken: token
    };
    await users.insertOne(newUser);

    const verificationUrl = `${process.env.CLIENT_URL}/verify/${token}`;
    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM,
      subject: 'Verify your email address',
      html: `
        <h2>Welcome to our app, ${firstName}!</h2>
        <p>Please verify your email by clicking the link below:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>If you did not sign up, you can ignore this email.</p>
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
})

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
});
