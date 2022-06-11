var express = require('express');
var router = express.Router();
var async=require('async');
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud test ping';
    res.send({helper:helper});
    res.end();
});
router.post('/bucket_update', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.update_bucket(helper.title,function(result) {
                helper.result=result;
                biz9.o('UPDATE_BUCKET_STATUS',result);
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/mongo_connect', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.test_mongo_connection(function(result) {
                helper.result=result;
                call();
            });
        }
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/get_user', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            sql={email:helper.email};
            biz9.get_sql(db,G_DT_USER,sql,{},function(result_list) {
                helper.result_list=result_list;
                biz9.o('GET_USER',result_list);
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/send_mail', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            mail={};
            mail.subject ='Test Server Send Email';
            mail.from = G_EMAIL_FROM;
            mail.to = helper.email;
            str = "<b>Test Email</b>: "+helper.email+"<br/>";
            mail.body = str;
            call();
        },
        function(call){
            biz9.send_mail(mail,function(_result) {
                biz9.o('server_send_mail_response',_result);
                helper.validation_message='Thanks! We will respond within 24hrs. Have a wonderful day!';
                call();
            });
        }
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/read_file', function(req, res, next) {
    var helper = biz9.get_helper(req);
    test_img = '/images/no_image.png';
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
    ],
        function(err, results){
            var options = {
                root: path.join(__dirname,'../../public/')
            };
            res.sendFile(test_img, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    next();
                }
            });
        });
});
router.get('/report', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    biz9.o('HELPER',helper);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.item.field_1=biz9.get_id();
            helper.item.field_2=biz9.get_id();
            helper.item.field_3=biz9.get_id();
            biz9.update_item(db,G_DT_BLANK,helper.item,function(result) {
                helper.item=result;
                biz9.o('DB_FIELD_BLANK_SET',helper.item);
                call();
            });
        },
        function(call){
            biz9.get_item(db,G_DT_BLANK,helper.item.tbl_id,function(result) {
                helper.item=result;
                biz9.o('DB_FIELD_BLANK_GET',helper.item);
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.get('/uptime', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});

module.exports = router;

