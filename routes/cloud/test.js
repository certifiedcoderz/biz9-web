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
router.post('/update_user', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.user = biz9.get_test_user();
            helper.user.email=helper.email;
            helper.user.password=helper.password;
            biz9.update_item(db,G_DT_USER,helper.user,function(result) {
                helper.user=result;
                call();
            });
        },
        function(call){
            biz9.update_bucket(G_APP_ID,function(result) {
                helper.bucket=result;
                call();
            });
        },
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
router.post('/update_stage', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.populate_stage_app_data(db,function(_item_map_list,_item_sub_list) {
                helper.item_map_list=_item_map_list;
                helper.item_sub_list=_item_sub_list;
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/server_send_mail', function(req, res, next) {
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
router.get('/server_go', function(req, res, next) {
    var helper = biz9.get_helper(req);
    test_img = '/images/puppy_up.png';
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.test_mongo_connection(db,function(result) {
                helper.mongo_test=result;
                if(helper.mongo_test=='test_connect_success'){
                    call();
                }else{
                    console.log('server_fail_mongo_db_connect');
                }
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

router.get('/run', function(req, res, next) {
    var helper = biz9.get_helper(req);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.page_key='home_page';
            //options
            //options.filter_key='val';
            //options.filter_match='val';
            //options.page_count='val';
            //

            var options={};
            biz9.get_page_key(db,helper.page_key,options,function(result) {
                item_map = result;
                utilityz.o('PAGE_KEY',item_map);
                utilityz.o('PAGE_KEa_NOTE',item_map.sub_list); //utilityz.o('PAGE_KEY_1',item_map.team_list);
                utilityz.o('PAGE_KEa_NOTE',item_map.sub_list.length); //utilityz.o('PAGE_KEY_1',item_map.team_list);
                //utilityz.o('PAGE_KEa_COOL',item_map.sub_list[0].sub_list[0].photo_list.length); //utilityz.o('PAGE_KEY_1',item_map.team_list);
                //utilityz.o('PAGE_KEY_2',item_map.team_list.user1);
            });
        },
        function(call){
            item_map_title_url='service_page';
            page_sub_key='service_1';
            biz9.get_page_sub_key(db,item_map_title_url,page_sub_key,function(result) {
                utilityz.o('BBB',result.photo_list.length);
                //utilityz.o('USER1',result);
                //utilityz.o('USER_NOTE',result.user1.note);
                //call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;

