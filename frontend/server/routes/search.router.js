const router = require('express').Router();
const { wrap } = require('../auth');
const { listings } = require('./platform.router');
const { filterListings } = require('../services/discovery');
router.get('/', wrap(async (req,res) => res.json(filterListings(await listings(),req.query))));
router.get('/category', wrap(async (req,res) => res.json(filterListings(await listings(),req.query))));
module.exports=router;
