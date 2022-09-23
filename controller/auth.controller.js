const { mongo } = require('mongoose');
const AppController = require('./app.controller');
const moment = require('moment');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const AppUtil = require('./../helper/app-util.helper');

const jwtHelper = require('./../helper/jwt.helper');
const emailHelper = require('./../helper/email.helper');
const { param } = require('../routes/api');

class AuthController extends AppController {
    AccountModel = require('../model/account.model');

    constructor(req, res, execFuncName) {
        super(req, res);

        if (execFuncName && typeof AuthController.prototype[execFuncName] === "function") {
            AuthController.prototype[execFuncName].call(this);
        }
    }


    async login() {
        try {
            let params = this.req.body;

            if(!params.email || !params.password ) return this.responseJson({error_code: 101});

            const acc = await this.AccountModel.find({
                email: params.email,
                password: md5(params.password),
            }).findOne();

            if (!acc) return this.responseJson({error_code: 201});
            const rs = {
                id: acc._id,
                profile: {
                    _id: acc._id,
                    role: acc.role,
                }
            };

            // thong tin tra ve client
            const result = this.returnResultToClient(acc);

            const token = jwtHelper.generateAccessToken(rs);

            return this.responseJson({data: {
                token: token,
                profile: result
            }});
        } catch (error) {
            console.log(error);
            return this.responseJson({error_code: 102});
        }
    }

    // async checkToken() {
    //     try {
    //         let params = this.req.body;

    //         if(!params.token ) return this.responseJson({error_code: 101});

    //         jwt.verify(params.token, process.env.JWT_KEY);

    //         let decoded = jwt.decode(params.token);

    //         if (!decoded) return this.responseJson({error_code: 203});

    //         const acc = await this.AccountModel.findById(decoded.id);

    //         if (!acc) return this.responseJson({error_code: 201});
            
    //         const rs = this.returnResultToClient(acc)

    //         return this.responseJson({data: {
    //             token: params.token,
    //             profile: rs
    //         }});
    //     } catch (error) {
    //         console.log(error);
    //         return this.responseJson({error_code: 102});
    //     }
    // }

    returnResultToClient(acc) {
        return {
            _id: acc.id,
            email: acc.email,
            full_name: acc.full_name,
            phone: acc.phone,
            avatar: acc.avatar,
            role: acc.role,
            acl: acc.acl,
            is_super: acc.is_super
        };
    }

    async forgotPassword() {
        try {
            let params = this.req.body;

            if(!params.email ) return this.responseJson({error_code: 101});

            const acc = await this.AccountModel.findOne({email: params.email, deleted: null});

            if (!acc) return this.responseJson({error_code: 206});
            const randomString = AppUtil.genRandomString(6);

            acc.tokenResetPassword = md5(randomString);
            acc.tokenResetPasswordCreated = moment().unix();
            await acc.save();

            var content = `Mã để đổi mật khẩu: ${randomString}. Mã sẽ hết hạn trong vòng 5 phút`;

            emailHelper.sendMail(acc.email, content, 'fb tool', 'Đặt lại mật khẩu');
        
            return this.responseJson({error_code: 0});
            
        } catch (error) {
            console.log(error);
            return this.responseJson({error_code: 102});
        }
    }

    async resetPassword() {
        try {
            let params = this.req.body;

            if(!params.email || !params.code || !params.password) return this.responseJson({error_code: 101});

            const acc = await this.AccountModel.findOne({email: params.email, deleted: null});

            if (!acc) return this.responseJson({error_code: 206});

            if (!acc.tokenResetPassword) return this.responseJson({error_code: 203});

            if ((moment().unix() - acc.tokenResetPasswordCreated) > (5 * 60)) return this.responseJson({error_code: 207}); 

            if (acc.tokenResetPassword != md5(params.code)) return this.responseJson({error_code: 203});
        
            acc.password = md5(params.password);
            acc.tokenResetPassword = null;
            acc.tokenResetPasswordCreated = null;
            
            await acc.save();        
            return this.responseJson({error_code: 0});
            
        } catch (error) {
            console.log(error);
            return this.responseJson({error_code: 102});
        }
    }
}

module.exports = AuthController;
