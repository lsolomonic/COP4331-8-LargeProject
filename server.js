const { MongoClient } = require('mongodb');

const url =
  'mongodb+srv://RickLeinecker:COP4331Rocks@cluster0.moiaqeh.mongodb.net/COP4331Cards?retryWrites=true&w=majority&appName=Cluster0';

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

app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
  next();
});

app.listen(5000, () => {
  console.log("Listening on port 5000...");
});

app.post('/api/login', async (req, res) => {
  const { login, password } = req.body;
  let id = -1, fn = '', ln = '', error = '';

  try {
    const db = client.db('COP4331Cards');
    const user = await db.collection('Users').findOne({ Login: login });

    if (user && await bcrypt.compare(password, user.Password)) {
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
  const { firstName, lastName, login, password } = req.body;


  if (!firstName || !lastName || !login || !password)
    return res.status(400).json({ error: 'All fields are required.' });

  try {
    const db     = client.db('COP4331Cards');
    const users  = db.collection('Users');


    const existing = await users.findOne({ Login: login });
    if (existing)
      return res.status(409).json({ error: 'Username already exists.' });

   
    const max = await users.find().sort({ UserID: -1 }).limit(1).toArray();
    const nextId = max.length ? max[0].UserID + 1 : 1;


    const hash = await bcrypt.hash(password, saltRounds);

    const newUser = {
      UserID: nextId,
      Login: login,
      Password: hash,
      FirstName: firstName,
      LastName:  lastName
    };
    await users.insertOne(newUser);

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