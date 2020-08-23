var express = require('express');
var router = express.Router();

const checkAuth = require('../middlewares/verifyToken');
const people = require('../controllers/people.controller/people.controller');

router.post('/BG', checkAuth, people.postBG);
router.post('/Ple', checkAuth, people.postPle);
// router.post('/Ple2', checkAuth, people.postPle2);
router.get('/', checkAuth, people.getAll);
router.get('/BG', checkAuth, people.getBG);
router.get('/Ple', checkAuth, people.getPle);

module.exports = router;
