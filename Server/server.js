require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');
const fetch = require('node-fetch');
const cheerio = require('cheerio');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// For all to get all collections - categories and types
app.get('/api/lists/:collectionName', async (req, res) => {
  try {
      const { collectionName } = req.params;
      if (!collectionName) {
          return res.status(400).json({ message: 'Collection name is required.' });
      }

      const snapshot = await db.collection(collectionName).get();
      const data = snapshot.docs.map(doc => doc.data().name);
      res.status(200).json(data);
  } catch (error) {
      console.error(`Error fetching list from ${req.params.collectionName}:`, error);
      res.status(500).json({ message: 'Failed to fetch list.', error: error.message });
  }
});


// For admin to add/update data
app.post('/admin/data/:collectionName', async (req, res) => {
  try {
    const { collectionName } = req.params;
    const { id, data } = req.body;

    if (!id || !data || !collectionName) {
      return res.status(400).json({ message: 'Collection name, ID, and data are required.' });
    }

    await db.collection(collectionName).doc(id).set(data);
    res.status(200).json({ message: `Data successfully added/updated in ${collectionName}.` });
  } catch (error) {
    console.error('Error adding/updating data:', error);
    res.status(500).json({ message: 'Failed to add/update data.', error: error.message });
  }
});

// For user frontend to get all tools
app.get('/user/data', async (req, res) => {
  try {
    const snapshot = await db.collection('tools').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data.', error: error.message });
  }
});

// For user frontend to get single data
app.get('/user/data/:id', async (req, res) => {
  try {
    const docRef = db.collection('settings').doc(req.params.id);
    const doc = await docRef.get();
    if (!doc.exists) {
      return res.status(404).json({ message: 'Document not found.' });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    console.error('Error fetching single data:', error);
    res.status(500).json({ message: 'Failed to fetch single data.', error: error.message });
  }
});

// Endpoint for frontend to request page metadata (description scraping)
app.post('/api/get-page-info', async (req, res) => {
  const { url } = req.body;

  if (!url) {
      return res.status(400).json({ message: 'URL is required.' });
  }

  try {
      const response = await fetch(url);

      if (!response.ok) {
          console.warn(`Failed to fetch target URL for scraping (${url}): Status ${response.status} - ${response.statusText}`);
          return res.status(502).json({
              message: `Could not reach or fetch content from the provided URL: ${response.status} ${response.statusText}`,
              description: 'No description found (URL inaccessible).'
          });
      }

      const html = await response.text();

      const $ = cheerio.load(html);

      let description = $('meta[name="description"]').attr('content') ||
                        $('meta[property="og:description"]').attr('content') ||
                        $('meta[itemprop="description"]').attr('content');

      if (description) {
          description = description.replace(/\s+/g, ' ').trim();
          if (description.length > 250) {
              description = description.substring(0, 250) + '...';
          }
      } else {
          description = $('p').first().text().replace(/\s+/g, ' ').trim();
          if (description.length > 250) {
              description = description.substring(0, 250) + '...';
          } else if (description.length < 50) { 
              description = $('title').text().replace(/\s+/g, ' ').trim();
          }
      }
      res.status(200).json({ description: description || 'No description found.' });

  } catch (error) {
      console.error(`Error scraping URL ${url}:`, error);
      res.status(500).json({ message: 'Failed to scrape URL for description.', error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});