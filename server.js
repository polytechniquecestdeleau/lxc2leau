require('dotenv').config();
const express = require('express');
const path    = require('path');

const mollieRoutes  = require('./routes/mollie');
const webhookRoutes = require('./webhooks/mollie');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/mollie', mollieRoutes);
app.use('/webhooks',   webhookRoutes);

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ LXC2LO → http://localhost:${PORT}`);
});
