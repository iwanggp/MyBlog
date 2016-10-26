/* GET home page. */
//引入需要的模块
var express = require('express'),
    router = express.Router(),
    crypto = require('crypto'),
    User = require('../models/user.js');
//主页路由
router.get('/', function(req, res) {
    res.render('index', { //渲染views下的index样式
        title: '主页',
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
    });
});
//我的测试路由
router.get('/wanggongpeng', function(req, res) {
    res.render('index', {
        title: '王功鹏'
    });
});
//我的测试路由
router.get('/haoxiaoqian', function(req, res) {
    res.render('index', {
        title: '郝晓倩'
    });
});
//注册页面
router.get('/reg', function(req, res) {
    res.render('reg', {
        title: '注册'
    });
});
//处理用户注册事件
// router.post("/reg", checkNotLogin);
router.post('/reg', function(req, res) {
    if (req.body['password-repeat'] != req.body['password']) {
        req.flash('error', '两次输入的口令不一致');
        return res.redirect('/reg');
    }
    console.log(req.body['password']);
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64'); //用于加密
    var newUser = new User({
        name: req.body.username,
        password: password,
    });
    //检查用户名是否已经存在
    User.get(newUser.name, function(err, user) {
        if (user)
            err = '用户名已经存在不可重复登录';
        if (err) {
            req.flash('error', err);
            return res.redirect('/reg');
        }

        newUser.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', '注册成功');
            res.redirect('/');
        });
    });
})

function checkNotLogin(req, res, next) {
    if (req.session.user) {
        req.flash('error', '已登入');
        return res.redirect('/');
    }
    next();
}
module.exports = router; //这句一定不能少，这是向外暴露接口，否则不能使用
