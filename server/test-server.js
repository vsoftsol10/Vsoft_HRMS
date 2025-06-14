const express = require('express');
const app = express();

app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working' });
});

app.listen(8000, () => {
  console.log('Test server running on port 8000');
});