const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/search', async (req, res) => {
  const query = req.query.query;
  const apiKey = process.env.GOOGLE_API_KEY;

  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/place/textsearch/json`,
      {
        params: {
          query: query,
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

module.exports = router;
