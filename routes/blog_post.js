var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res) {
    res.send({'biz9-web':'ping'});
    res.end();
});
//9_blog_all
router.get('/',function(req, res) {
    res.redirect('/blog/all/1');
});
//9_blog_all
router.get('/all',function(req, res) {
    res.redirect('/blog/all/1');
});
//9_blog_category_all
router.get('/category/:category',function(req, res) {
    res.redirect('/blog/category/'+helper.category+'/1');
});
router.get('/all/:page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='blog_post_list';
    helper.page_title = G_APP_TITLE +': Blog Posts';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            title_url='primary';
            biz9.get_page(db,title_url,{},function(page){
                helper.primary=page;
                call();
            });
        },
        function(call){
            title_url='blog_post';
            sub_title_url='category_list';
            biz9.get_sub_page(db,title_url,sub_title_url,{},function(page){
                helper.category_list=page.items;
                call();
            });
        },
        function(call){
            title_url='blog_post';
            biz9.get_page(db,title_url,{},function(page){
                helper.blog_post=page;
                call();
            });
        },
        function(call){
            sql = {visible:'true'};
            sort={date_create:1};
            page_current=1;
            page_size=12;
            biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                helper.blog_post_list=result_list;
                helper.total_item_count=total_count;
                helper.page_page_count=page_page_count;
                call();
            });
        },
    ],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
router.get('/category/:category_title/:page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='blog_post_list';
    helper.page_title = G_APP_TITLE +': Blog Posts';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            title_url='primary';
            biz9.get_page(db,title_url,{},function(page){
                helper.primary=page;
                call();
            });
        },
        function(call){
            title_url='blog_post';
            sub_title_url='category_list';
            biz9.get_sub_page(db,title_url,sub_title_url,{},function(page){
                helper.category_list=page.items;
                call();
            });
        },
        function(call){
            title_url='blog_post';
            biz9.get_page(db,title_url,{},function(page){
                helper.blog_post=page;
                call();
            });
        },
        function(call){
            sql = {visible:'true',category:helper.category_title};
            sort={date_create:1};
            page_current=helper.page_current;
            page_size=12;
            biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                helper.blog_post_list=result_list;
                helper.total_item_count=total_count;
                helper.page_page_count=page_page_count;
                call();
            });
        },
    ],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_blog_post_detail//9_detail
router.get('/:title_url',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='blog_post_detail';
    helper.page_title = G_APP_TITLE +': Blog Post ';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            title_url='primary';
            biz9.get_page(db,title_url,{},function(page){
                helper.primary=page;
                call();
            });
        },
        function(call){
            title_url='blog_post';
            biz9.get_page(db,title_url,{},function(page){
                helper.blog_post=page;
                call();
            });
        },
        function(call){
            title_url='blog_post';
            sub_title_url='category_list';
            biz9.get_sub_page(db,title_url,sub_title_url,{},function(page){
                helper.category_list=page.items;
                call();
            });
        },
        function(call){
            biz9.get_blog_post(db,helper.title_url,function(result) {
                helper.item=result;
                helper.page_title = G_APP_TITLE +': Blog Post '+ helper.item.title;
                call();
            });
        },
        function(call){
            sql={visible:'true'};
            sort={date_create:1};
            page_current=helper.page_current;
            page_size=12;
            biz9.get_blog_postz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                helper.blog_post_list=result_list;
                helper.total_item_count=total_count;
                helper.page_page_count=page_page_count;
                call();
            });
           },
    ],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
module.exports = router;
