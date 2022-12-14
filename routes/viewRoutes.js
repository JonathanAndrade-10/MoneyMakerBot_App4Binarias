const express = require('express');
const viewsController = require('../controllers/viewsController');
const router = express.Router();

router.route('/')
  .get(viewsController.showForm)
  .post(viewsController.createQueueItem);

module.exports = router;
