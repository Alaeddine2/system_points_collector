const user_schema = require("../schemas/user_schema");
const crypto = require('crypto');
const jwtContainer = require("../middleware/json_web_token");
const logger = require('../middleware/logging_middleware');
require('dotenv').config()
var mailer = require('../utils/mailer');

class UserController {

  constructor() {}

  async activateUser(req, res) {
    try {
        // Find the corresponding user
        const user = await user_schema.findOne({
            activeToken: req.params.activeToken,
        }).exec();

        // Invalid activation code
        if (!user) {
            return res.render('message', {
                title: 'fail to activate',
                content: 'Your activation link is invalid, please register again'
            });
        }

        // Activate and save
        user.active = true; 
        await user.save();

        // Activation success
        res.render('message', {
            title: 'activation success!',
            content: `${user.name}, you can login now!`
        });
    } catch (error) {
        console.error("Error activating user:", error);
        // Handle the error
        res.status(500).json({ error: "Internal server error" });
    }
}


    async addNewUser(req, res){
        //check if user already exist
        user_schema
        .find({
            login: req.body.login
        })
        .exec()
        .then(user => {
            if(user.length > 0){
                logger.error(`New user creation error [Path: v1/user/add] : user already exist`)
                return res.status(400).json({
                    code: "API.USER.CREATION.FAIL",
                    message: "User already exist",
                    success: false,
                    error: "User already exist"
                });
            }

            let newUser = new user_schema({
                name : req.body.name,
                login : req.body.login,
                passwordHash : crypto.createHash('sha256').update(req.body.password).digest('hex'),
                tel: req.body.tel,
                role: "client",
                role_number: 0,
                token: ""
            });
                
                // Ensure the activation code is unique.
                const activationToken = crypto.randomBytes(20).toString('hex');


                // Set expiration time is 24 hours.
                user.activeExpires = Date.now() + 24 * 3600 * 1000;
                
                var link = 'http://localhost:'+process.env.PORT+'/v1/user/active/' + activationToken;
                // Send email to user.
                // Sending activation email
                mailer({
                    to: req.body.login,
                    subject: 'Welcome',
                    html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
                }, link);
                newUser.activeToken = activationToken;
                newUser.activeExpires = Date.now() + 24 * 3600 * 1000;
            return newUser.save().then( result =>{
                logger.info(`New user saved [Path: v1/user/add] ${result}`)
                res.status(200).json({
                    code: "API.USER.CREATION.SUCESS",
                    message: "new customer added successfully, The activation email has been sent click the activation link within 24 hours",
                    success: false,
                    data: result
                })
            }).catch(err => {
                logger.error(`New user creation error [Path: v1/user/add] ${err}`)
                res.status(400).json({
                    code: "API.USER.CREATION.FAIL",
                    message: "adding User failed",
                    success: false,
                    error: err
                })
            })
        }).catch(err => {
            logger.error(`New user creation error [Path: v1/user/add] ${err}`)
            return res.status(404).json({
                code: "API.CUSTOMER.NOTFOUND",
                message: "customer id not found",
                success: false,
                error: err
            });
        });
    }

  async addNewProf(req, res){
    //check if user already exist
    user_schema
    .find({
        login: req.body.login
    })
    .exec()
    .then(user => {
        if(user.length > 0){
            logger.error(`New PRO creation error [Path: v1/user/pro/add] : PRO already exist`)
            return res.status(400).json({
                code: "API.PRO.CREATION.FAIL",
                message: "PRO already exist",
                success: false,
                error: "PRO already exist"
            });
        }

        let newUser = new user_schema({
            name : req.body.name,
            login : req.body.login,
            passwordHash : crypto.createHash('sha256').update(req.body.password).digest('hex'),
            tel: req.body.tel,
            role: "professional",
            role_number: 1,
            token: "",
            active: true,
        });
        return newUser.save().then( result =>{
            logger.info(`New pro saved [Path: v1/user/add] ${result}`)
            res.status(200).json({
                code: "API.PRO.CREATION.SUCESS",
                message: "new professional added successfully",
                success: true,
                data: result
            })
        }).catch(err => {
            logger.error(`New PRO creation error [Path: v1/user/pro/add] ${err}`)
            res.status(400).json({
                code: "API.PRO.CREATION.FAIL",
                message: "adding PRO failed",
                success: false,
                error: err
            })
        })
    }).catch(err => {
        logger.error(`New user creation error [Path: v1/user/add] ${err}`)
        return res.status(404).json({
            code: "API.CUSTOMER.NOTFOUND",
            message: "customer id not found",
            success: false,
            error: err
        });
    });
  }

  async getAll(req, res){
    user_schema
        .find({})
        .sort({ creating_date: -1 })
        .skip(req.body.skip)
        .limit(req.body.limit)
        .exec()
        .then(result => {
            logger.info(`get users [Path: v1/user/all]`)
            res.status(200).json({
                code: "API.User.GET.SUCESS",
                message: "All Users fetched successfully",
                success: true,
                result: result
            });
        }
        ).catch(err => {
            logger.error(`get users error [Path: v1/user/all] ${err}`)
            res.status(400).json({
                code: "API.User.GET.FAIL",
                message: "All Users fetching failed",
                success: false,
                error: err
            });
        }
        );
  }

  async getByCustomer(req,res){
    customer_schema.findById(req.body.customer)
    .exec().
    then( data =>{
        if(data.length < 1)
            return res.status(404).json({
                code: "API.CUSTOMER.NOTFOUND",
                message: "customer id not found",
                success: false,
                error: null
            });
        user_schema
        .find({customer_id: req.body.customer})
        .populate("customer")
        .sort({ creating_date: -1 })
        .skip(req.body.skip)
        .limit(req.body.limit)
        .exec()
        .then(result => {
            logger.info(`get users by costumer [Path: v1/user/customer]`)
            res.status(200).json({
                code: "API.User.CUSTOMER.GET.SUCESS",
                message: "All Users fetched successfully",
                success: true,
                result: result
            });
        }
        ).catch(err => {
            logger.error(`error get users by costumer [Path: v1/user/customer] ${err}`)
            res.status(400).json({
                code: "API.User.CUSTOMER.GET.FAIL",
                message: "All Users fetching failed",
                success: false,
                error: err
            });
        }
        ).catch(err => {
            logger.error(`error get users by costumer [Path: v1/user/customer] ${err}`)
            return res.status(404).json({
                code: "API.CUSTOMER.NOTFOUND",
                message: "customer id not found",
                success: false,
                error: null
            });
        });
    })
  }

  loginUser(req,res){
    try {
        user_schema.find({login: req.body.login}).exec().then(user =>{
        if(user.length < 1)
            return res.status(404).json({
                code: "API.LOGIN.USER.NOTFOUND",
                message: "User account not found",
                success: false,
                error: null
            });
            // check if the user is active or not
        if(!user[0].active)
            return res.status(404).json({
                code: "API.LOGIN.USER.NOTACTIVE",
                message: "User account not active",
                success: false,
                error: null
            });
        if(crypto.createHash('sha256').update(req.body.password).digest('hex') == user[0].passwordHash){
            logger.info(`login [Path: v1/user/auth] ${user[0]}`)
            return res.status(200).json({
                code: "API.LOGIN.USER.SUCESS",
                message: "success login",
                success: true,
                result: {
                    currentUser: user[0],
                    accessToken : jwtContainer.signJWT({user: user[0]})
                }
            });
        }else{
            logger.error(`error login [Path: v1/user/auth] :wrong password`)
            return res.status(401).json({
                code: "API.LOGIN.USER.WRONGPASSWORD",
                message: "invalid User password",
                success: false,
                error: null
            });
        }
        })
    } catch (error) {
        logger.error(`error login [Path: v1/user/auth] ${error}`)
        return res.status(400).json({
            code: "API.LOGIN.USER.FAILD",
            message: "login failed",
            success: false,
            error: error
        });
    }
  }
    async updateUser(req, res){
        //console.log(req.params.id);
        user_schema.findById(req.params.id).exec().then(users =>{
            if(users == null)
                res.status(404).json({
                    code: "API.USER.UPDATE.FAIL",
                    message: "User not found",
                    success: false,
                    error: null
                });
                user_schema
                .findOneAndUpdate({ _id: req.params.id }, { $set: { name: req.body.name, login: req.body.login, tel: req.body.tel } }, { new: true })
                .exec()
                .then(result => {
                    logger.info(`User [Path: v1/user/update] ${req.params.id}`)
                    res.status(200).json({
                        code: "API.USER.UPDATE.SUCESS",
                        message: "User updated successfully",
                        success: true,
                        result: result
                    });
                }
                ).catch(err => {
                    logger.error(`User [Path: v1/user/update] ${err}`)
                    res.status(400).json({
                        code: "API.CUSTOMER.UPDATE.FAIL",
                        message: "Customer updating failed",
                        success: false,
                        error: err
                    });
                });
        }).catch(err =>{
            logger.error(`User [Path: v1/user/update] ${err}`)
            res.status(404).json({
                code: "API.USER.UPDATE.FAIL",
                message: "check fields",
                success: false,
                error: err
            });
        })
    }

    async updatePassword(req, res){
        user_schema.findById(req.params.id).exec().then(users =>{
            console.log(users);
            if(users == null)
                res.status(404).json({
                    code: "API.USER.UPDATE.FAIL",
                    message: "User not found",
                    success: false,
                    error: null
                });
                user_schema
                .findOneAndUpdate({ _id: req.params.id }, { $set: { passwordHash:  crypto.createHash('sha256').update(req.body.password).digest('hex') } }, { new: true })
                .exec()
                .then(result => {
                    res.status(200).json({
                        code: "API.USER.UPDATE.SUCESS",
                        message: "Customer updated successfully",
                        success: true,
                        result: result
                    });
                }
                ).catch(err => {
                    console.log("err");
                    res.status(400).json({
                        code: "API.USER.UPDATE.FAIL",
                        message: "Customer updating failed",
                        success: false,
                        error: err
                    });
                });
        }).catch(err =>{
            res.status(404).json({
                code: "API.USER.UPDATE.FAIL",
                message: "check fields",
                success: false,
                error: err
            });
        })
    }

    // Forgot password
    async forgotPassword(req, res) {
        try {
            // Find the corresponding user
            const user = await user_schema.findOne({
                login: req.body.login,
            }).exec();

            // Invalid user
            if (!user) {
                return res.status(404).json({
                    code: "API.USER.NOTFOUND",
                    message: "User not found",
                    success: false,
                    error: null
                });
            }

        } catch (error) {
            console.error("Error forgot password:", error);
            // Handle the error
            res.status(500).json({ error: "Internal server error" });
        }
    }

    // Resend activation email
    async resendActivationEmail(req, res) {
        try {
            // Find the corresponding user
            const user = await user_schema.findOne({
                login: req.body.login,
            }).exec();

            // Invalid user
            if (!user) {
                return res.status(404).json({
                    code: "API.USER.NOTFOUND",
                    message: "User not found",
                    success: false,
                    error: null
                });
            }

            // Ensure the activation code is unique.
            const activationToken = crypto.randomBytes(20).toString('hex');

            // Set expiration time is 24 hours.
            user.activeToken = activationToken;
            user.activeExpires = Date.now() + 24 * 3600 * 1000;
            var link = 'http://localhost:'+process.env.PORT+'/v1/user/active/' + activationToken;

            // Save the user
            await user.save();

            // Sending activation email
            mailer({
                to: req.body.login,
                subject: 'Welcome',
                html: 'Please click <a href="' + link + '"> here </a> to activate your account.'
            }, link);

            // Activation success
            res.status(200).json({
                code: "API.USER.RESEND.SUCESS",
                message: "Activation email has been sent",
                success: true,
                result: null
            });
        } catch (error) {
            console.error("Error resending activation email:", error);
            // Handle the error
            res.status(500).json({ error: "Internal server error" });
        }
    }

    deleteUser(req, res){
        user_schema
            .deleteOne({ _id: req.params.id })
            .exec()
            .then(deletingResult => {
                logger.info(`User deleted [Path: v1/user/delete] ${req.params.id}`)
                res.status(200).json({
                    code: "API.USER.DELETE.SUCESS",
                    message: "USER deleted successfully",
                    success: true,
                    result: deletingResult
                });
            }
            ).catch(err => {
                logger.error(`error User delete [Path: v1/user/delete] ${err}`)
                res.status(400).json({
                    code: "API.USER.DELETE.FAIL",
                    message: "USER deletion failed",
                    success: false,
                    error: err
                });
            })
    }

    updatePrivilege(req, res){
        const authHeader = req.headers['authorization'] 
        const accessToken = authHeader && authHeader.split(' ')[1]
        const currentUser = jwtContainer.getCurrentUser(accessToken);
        try {
            user_schema.findById(currentUser.user._id).exec().then(admin =>{
                if(!admin.isAdmin)
                    res.status(404).json({
                        code: "API.USER.PRIVILAGE.PERMISSION.FAIL",
                        message: "User updating privalage failed",
                        success: false,
                        error: "You are not the admin"
                    });
                user_schema
                    .findOneAndUpdate({ _id: req.params.id }, { $set: { hasAccessToAllDevices: req.body.hasAccess, deviceArray: req.body.devices } }, { new: true })
                    .exec()
                    .then(result => {
                        logger.info(`User updated [Path: v1/user/update/privilage] ${result}`)
                        res.status(200).json({
                            code: "API.USER.PRIVILAGE.PERMISSION.SUCESS",
                            message: "User updating privalage successfully",
                            success: true,
                            result: result
                        });
                    }
                    ).catch(err => {
                        logger.error(`error User updating [Path: v1/user/update/privilage] ${err}`)
                        res.status(400).json({
                            code: "API.USER.PRIVILAGE.ERROR.FAIL",
                            message: "User updating privalage failed",
                            success: false,
                            error: err
                        });
                    });
            })
        } catch (error) {
            logger.error(`error User updating [Path: v1/user/update/privilage] ${error}`)
            res.status(400).json({
                code: "API.USER.PRIVILAGE.ERROR.FAIL",
                message: "User updating privalage failed",
                success: false,
                error: error
            });
        }
    }

    //update user token
    async updateToken(req, res){
        user_schema.findById(req.params.id).exec().then(users =>{
            if(users == null)
                res.status(404).json({
                    code: "API.USER.UPDATE.Token.FAIL",
                    message: "User not found",
                    success: false,
                    error: null
                });
                user_schema
                .findOneAndUpdate({ _id: req.params.id }, { $set: { token: req.body.token } }, { new: true })
                .exec()
                .then(result => {
                    res.status(200).json({
                        code: "API.USER.UPDATE.Token.SUCESS",
                        message: "token updated successfully",
                        success: true,
                        result: result
                    });
                }
                ).catch(err => {
                    res.status(400).json({
                        code: "API.USER.UPDATE.Token.FAIL",
                        message: "Customer updating failed",
                        success: false,
                        error: err
                    });
                });
        }).catch(err =>{
            res.status(404).json({
                code: "API.USER.UPDATE.Token.FAIL",
                message: "check fields",
                success: false,
                error: err
            });
        })
    }
    //get curernt user
    async getCurrentUser(req, res){
        const authHeader = req.headers['authorization'] 
        const accessToken = authHeader && authHeader.split(' ')[1]
        const currentUser = jwtContainer.getCurrentUser(accessToken);
        try {
            user_schema.findById(currentUser
                .user._id).exec().then(users =>{
                res.status(200).json({
                    code: "API.USER.GET.SUCESS",
                    message: "User get successfully",
                    success: true,
                    result: users
                });
            }).catch(err =>{
                res.status(404).json({
                    code: "API.USER.GET.FAIL",
                    message: "check fields",
                    success: false,
                    error: err
                });
            }
            )
        } catch (error) {
            res.status(404).json({
                code: "API.USER.GET.FAIL",
                message: "check fields",
                success: false,
                error: error
            });
        }
    }
    //get all users with isaAdmin = true
    async getAllAdmins(req, res){
        try{
            user_schema.find({isAdmin: true, isSuperAdmin: false}).populate("customer").exec().then(users =>{
                res.status(200).json({
                    code: "API.USER.ADMIN.SUCESS",
                    message: "User get successfully",
                    success: true,
                    result: users
                });
            }).catch(err =>{
                res.status(404).json({
                    code: "API.USER.GET.ADMIN.FAIL",
                    message: "check fields",
                    success: false,
                    error: err
                });
            }
            )
        }catch(error){
            res.status(500).json({
                code: "API.USER.GET.ADMIN.FAIL",
                message: "Internel server error",
                success: false,
                error: error
            });
        }
        
    }
}

module.exports = UserController;