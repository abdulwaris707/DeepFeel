const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'DeepFeel Haute Parfumerie API',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

module.exports = router;
