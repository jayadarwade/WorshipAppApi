const express = require('express');
const route = express.Router();
const mediafileController = require('../controller/mediafileCategoryController');

route.post('/add',mediafileController.add);

route.get('/view',mediafileController.view);

route.delete('/delete/:id',mediafileController.delete);

route.post('/update/:id',mediafileController.update);

module.exports=route;