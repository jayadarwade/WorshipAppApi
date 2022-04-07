const express = require('express');
const route = express.Router();
const mediafileController = require('../controller/mediafileCategoryController');

route.post('/add',mediafileController.add);


module.exports=route;