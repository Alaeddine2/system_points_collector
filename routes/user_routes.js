const UserController = require("../controllers/user_controller");
const UserControllerInst = new UserController();
const express = require('express');
const router = express.Router();
const jwtContainer = require("../middleware/json_web_token");

router.get('/', (req,res)=> {
    res.send('hello world');
});


//get current user
router.get('/current', jwtContainer.authenticateToken, (req,res)=> {
    UserControllerInst.getCurrentUser(req,res) ;
});
router.post('/add', (req,res)=> {
    UserControllerInst.addNewUser(req,res);
})
router.post('/prof/add', (req,res)=> {
    UserControllerInst.addNewProf(req,res);
})
router.post('/all',jwtContainer.authenticateToken, (req,res)=> {
    UserControllerInst.getAll(req,res);
})
router.post('/auth', (req,res)=> {
    UserControllerInst.loginUser(req,res);
})
router.put("/update/:id",jwtContainer.authenticateToken ,(req, res) => UserControllerInst.updateUser(req,res));
router.put("/update/password/:id",jwtContainer.authenticateToken ,(req, res) => UserControllerInst.updatePassword(req,res));
router.delete("/:id",jwtContainer.authenticateToken ,(req, res) => UserControllerInst.deleteUser(req,res));
router.post('/forgot', (req,res)=> {
    UserControllerInst.forgotPassword(req,res);
})
// resend activation email
router.post('/resend', (req,res)=> {
    UserControllerInst.resendActivationEmail(req,res);
})
//update user token
router.put("/update/token/:id",jwtContainer.authenticateToken ,(req, res) => UserControllerInst.updateToken(req,res));
router.get('/active/:activeToken', (req, res) =>
    UserControllerInst.activateUser(req, res)
);

//change client total points
router.put("/points/update/:id",jwtContainer.authenticateToken ,(req, res) => UserControllerInst.updatePoints(req,res));
// get all client tracer points use 
router.get('/points/all',jwtContainer.authenticateToken, (req,res)=> {
    UserControllerInst.getAllPoints(req,res);
});
module.exports = router;