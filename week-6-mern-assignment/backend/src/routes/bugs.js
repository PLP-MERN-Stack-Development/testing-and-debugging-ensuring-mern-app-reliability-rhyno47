const express = require('express');
const router = express.Router();
const {
  createBug,
  listBugs,
  updateBug,
  deleteBug
} = require('../controllers/bugsController');

router.post('/', createBug);
router.get('/', listBugs);
router.patch('/:id', updateBug);
router.delete('/:id', deleteBug);

module.exports = router;
