const express = require('express');
const axios = require('axios');
const router = express.Router();

// /api/google/search
router.get('/search', async (req, res) => {
  const query = req.query.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query,
          key: apiKey,
          type: 'restaurant',
        },
      }
    );

    const results = response.data.results.map((place) => {
      const photoReference = place.photos?.[0]?.photo_reference;
      const photoUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
        : null;

      return {
        name: place.name,
        address: place.formatted_address,
        rating: place.rating,
        photo_url: photoUrl,
        place_id: place.place_id,
      };
    });

    res.json(results);
  } catch (err) {
    console.error('Google Places Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch restaurant data' });
  }
});

// /api/google/nearby
router.get('/nearby', async (req, res) => {
  const { lat, lng } = req.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  if (!lat || !lng) return res.status(400).json({ error: 'Missing lat/lng' });

  try {
    const response = await axios.get(
      'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
      {
        params: {
          location: `${lat},${lng}`,
          radius: 1500,
          type: 'restaurant',
          key: apiKey,
        },
      }
    );

    const results = response.data.results.map((place) => {
      const photoReference = place.photos?.[0]?.photo_reference;
      const photoUrl = photoReference
        ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photoReference}&key=${apiKey}`
        : null;

      return {
        name: place.name,
        address: place.vicinity,
        rating: place.rating,
        photo_url: photoUrl,
        place_id: place.place_id,
      };
    });

    res.json(results);
  } catch (err) {
    console.error('Nearby error:', err.message);
    res.status(500).json({ error: 'Failed to fetch nearby restaurants' });
  }
});
module.exports = router;
