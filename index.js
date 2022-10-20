const mongoose = require('mongoose');
const express = require('express');
const db = require('./config/connnection');
const routes = require('./routes');
const { User, Thought } = require('./models');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(routes);

db.once('open', async () => {
  console.log('Database open')

  await User.deleteMany({})
  await Thought.deleteMany({})
  
  await User.create({ username: 'jon', email: 'jon@jon.com' });
  await User.create({ username: 'vince', email: 'vince@vince.com' });
  await User.create({ username: 'ryan', email: 'ryan@ryan.com' });
  await User.create({ username: 'steven', email: 'steven@steven.com' });

  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}!`);
  });
});
