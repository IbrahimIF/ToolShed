require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { db } = require('./firebase');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


app.post('/admin/data', async (req, res) => {
  try {
    const { id, data } = req.body;
    if (!id || !data) {
      return res.status(400).json({ message: 'ID and data are required.' });
    }

    await db.collection('hashmapInfo').doc(id).set(data);
    res.status(200).json({ message: 'Data successfully added/updated.' });
  } catch (error) {
    console.error('Error adding/updating data:', error);
    res.status(500).json({ message: 'Failed to add/update data.', error: error.message });
  }
});

app.get('/user/data', async (req, res) => {
  try {
    const snapshot = await db.collection('hashmapInfo').get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ message: 'Failed to fetch data.', error: error.message });
  }
});


app.get('/user/data/:id', async (req, res) => {
  try {
    const docRef = db.collection('hashmapInfo').doc(req.params.id);
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


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});