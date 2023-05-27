const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  const data = {
    name: 'Teste'
  };
  res.render('index', data);
});

module.exports = router;
