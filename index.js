const express = require('express');
require('dotenv').config();
const app = express();
const db = process.env.DB;
const port = process.env.PORT || 3006;
const auth = require('./routes/auth');
const morgan = require('morgan');
const cors = require('cors');
const dash = require('./routes/dashboard');
const mongoose = require('mongoose');

mongoose.connect(db)
  .then(()=>console.log('connected'))
  .catch(err => console.log('error happened '+ err));

app.use(express.json());
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use('/auth', auth);
app.use('/dashboard', dash);

app.listen(port, ()=>console.log(`running on ${port}`));