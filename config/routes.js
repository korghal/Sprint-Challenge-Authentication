const axios = require('axios');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const knex = require('knex');

const db_config = require('../knexfile');
const db = knex(db_config.development);

const jwtKey = process.env.JWT_SECRET;
const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function generateToken(user) {
  const payload = {
    username: user.username,
  };

  const options = {
    expiresIn: '1h',
    jwtid: '455234'
  };

  return jwt.sign(payload, jwtKey, options);
}

function register(req, res) {
  const newUser = req.body;
  // Make sure the new user information has all required fields.
  if (newUser.username && newUser.password) {
    newUser.password = bcrypt.hashSync(newUser.password, 14);
    db('users').insert(newUser) // Add the user into the users table
    .then((ids) => {
      const id = ids[0];
      db('users').where({id}).first() // Select that user from the database....
      .then((user) => {
        if (user) { 
          const token = generateToken(user);  // So we can generate a token based off it and not what was sent in the body.
          res.status(201).json({id: user.id, token: token});
        }
        else {
          res.status(403).json({errorMessage: `User not registered. Please try again.`})
        }
      })
      .catch((error) => {
        res.status(500).send(`Server sent an error of: ${error}`);
      })
    })
    .catch((error) => {
      res.status(500).json({errorMessage: `Server sent an error of ${error}`});
    })
  }
  else {
    res.status(400).json({message: 'Registering requires both a username and password.'});
  }
}

function login(req, res) {
  const loginUser = req.body;
  if (loginUser.username && loginUser.password) {
    db('users').where('username', loginUser.username)
    .then((user) => {
      console.log(user);
      if (user.length && bcrypt.compareSync(loginUser.password, user[0].password)) {
        const token = generateToken(user[0]);
        res.status(200).json({message: `User ${user[0].username} logged in...`, token: token});
      }
      else {
        res.status(403).json({message: 'Username or password not recognized.'});
      }
    })
    .catch((error) => {
      res.status(500).json({errorMessage: `Server sent an error of ${error}.`});
    })
  }
  else {
    res.status(400).json({message: 'You need both a username and password to login.'});
  }
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
