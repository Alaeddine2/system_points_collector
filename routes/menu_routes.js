const MenuController = require("../controllers/menu_controller");
const MenuControllerInst = new MenuController();
const express = require('express');
const router = express.Router();
const jwtContainer = require("../middleware/json_web_token");

router.get('/', (req,res)=> {
    res.send('hello world');
});

router.get('/all',jwtContainer.authenticateToken, (req,res)=> {
    MenuControllerInst.getAll(req,res);
});
router.get('/all/:id',jwtContainer.authenticateToken, (req,res)=> {
    MenuControllerInst.getOne(req,res);
});
router.post('/add',jwtContainer.authenticateToken, (req,res)=> {
    MenuControllerInst.addNewMenu(req,res);
});
router.put("/update/:id",jwtContainer.authenticateToken ,(req, res) => MenuControllerInst.updateMenu(req,res));
router.delete("/:id",jwtContainer.authenticateToken ,(req, res) => MenuControllerInst.deleteMenu(req,res));
// add and update categories
router.post('/category/add',jwtContainer.authenticateToken, (req,res)=> {
    MenuControllerInst.addNewCategory(req,res);
});
router.put("/category/update/:id",jwtContainer.authenticateToken ,(req, res) => MenuControllerInst.updateCategory(req,res));
// get all categories
router.get('/category/all',jwtContainer.authenticateToken, (req,res)=> {
    MenuControllerInst.getAllCategories(req,res);
});
module.exports = router;