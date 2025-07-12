const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Restaurant = require('./models/Restaurant'); // make sure this path matches your folder

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(async () => {
  console.log("Connected to MongoDB");

  // Clear existing restaurants
  await Restaurant.deleteMany({});

  // Sample data
  const sampleRestaurants = [
    {
      name: "Sakura Sushi",
      description: "Fresh sushi and sashimi with modern decor.",
      location: "Tokyo, Japan"
    },
    {
      name: "La Trattoria",
      description: "Authentic Italian cuisine in a cozy setting.",
      location: "Rome, Italy"
    },
    {
      name: "El Rancho Grill",
      description: "Steaks, ribs, and BBQ specialties.",
      location: "Dallas, USA"
    }
  ];

  await Restaurant.insertMany(sampleRestaurants);

  console.log("Seeded sample restaurants!");
  mongoose.connection.close();
}).catch(err => {
  console.error("MongoDB connection error:", err);
});
