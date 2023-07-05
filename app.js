const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');


// Database connection
mongoose.connect('mongodb://localhost/ReflextionAI', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000,
});


// Define member schema and model
const memberSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  dob: Date,
  age: Number,
  gender: String,
  address: String,
  country: String,
  state: String,
  city: String,
  pincode: String,
  registrationDate: Date,
});
const Member = mongoose.model('Member', memberSchema);

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', async (req, res) => {
  const members = await Member.find();
  res.render('index', { members });
});

app.post('/register', (req, res) => {
  const { name, mobile, email, dob, gender, address, country, state, city, pincode } = req.body;

  // Calculate age
  const age = calculateAge(dob);

  // Create member object
  const member = new Member({
    name,
    mobile,
    email,
    dob,
    age,
    gender,
    address,
    country,
    state,
    city,
    pincode,
    registrationDate: new Date(),
  });

  // Save member to the database
  member.save();
  res.send("Memmber Registered Successfully")
});

// Function to calculate age based on Date of Birth
function calculateAge(dateOfBirth) {
  const dob = new Date(dateOfBirth);
  const now = new Date();
  let age = 2023 - dob.getFullYear();
  const monthDiff = 7 - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < dob.getDate())) {
    age--;
  }
  return age;
}

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
