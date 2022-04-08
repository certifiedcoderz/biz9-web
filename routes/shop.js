var express = require('express');
var router = express.Router();
router.get('/ping',function(req, res, next) {
    res.send({'biz9-web':'ping'});
    res.end();
});
//9_shop_all
router.get('/',function(req, res) {
    res.redirect('/shop/all/1');
});
//9_shop_all
router.get('/all',function(req, res) {
    res.redirect('/shop/all/1');
});

//9_shop 9_product_list
router.get('/all/:page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='product_list';
    helper.page_title = G_APP_TITLE +': Shop';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    helper.render_list='/shop/all';
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
            title_url='shop';
            biz9.get_page(db,title_url,{},function(page){
                helper.shop=page;
                call();
            });
        },
        function(call){
            sql={visible:'true'};
            sort={date_create:1};
            page_current=0;
            page_size=9;
            biz9.get_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                helper.product_list=result_list;
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
//9_shop 9_product_category_list
router.get('/category/:category_title/:page_current',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='product_list';
    helper.page_title = G_APP_TITLE +': Shop: '+helper.category_title;
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    helper.render_list='/category/category_title';
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
            title_url='shop';
            biz9.get_page(db,title_url,{},function(page){
                helper.shop=page;
                call();
            });
        },
        function(call){
            sql={visible:'true',category:helper.category_title};
            sort={date_create:1};
            page_current=1;
            page_size=9;
            biz9.get_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                helper.product_list=result_list;
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
//9_checkout //9_product_checkout
router.get('/checkout/success/',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='product_checkout_success';
    helper.page_title = G_APP_TITLE +': Shopping Checkout Success';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    helper.product_order_list=[];
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
            title_url='product';
            biz9.get_page(db,title_url,{},function(page){
                helper.product=page;
                call();
            });
        },
        function(call){
            helper.product_list=[];
            if(helper.user.tbl_id!=0){
                sql={customer_tbl_id:helper.user.tbl_id};
                sort={};
                page_current=1;
                page_size=10;
                biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                    helper.product_list=result_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.order_id=G_SHOP_ORDER_ID+biz9.get_id();
            for(a=0;a<helper.product_list.length;a++){
                helper.product_list[a].tbl_id=0;
                helper.product_list[a].data_type=G_DT_PRODUCT_ORDER;
                helper.product_list[a].order_id=helper.order_id;
            }
            call();
        },
        function(call){
            biz9.update_list(db,helper.product_list,function(result_list) {
                call();
            });
        },
        function(call){
            if(helper.user.tbl_id!=0){
                sql={customer_tbl_id:helper.user.tbl_id};
                sort={};
                biz9.delete_sql(db,G_DT_PRODUCT_CART,sql,function(result_list) {
                    helper.del_product_list=result_list;
                    call();
                });
            }else{
                call();
            }
        }],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_product_checkout 9_checkout
router.get('/checkout/',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='product_checkout';
    helper.page_title = G_APP_TITLE +': Shopping Checkout';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            if(G_ENV=='test'){
                helper.user.first_name='first_name_'+biz9.get_id();
                helper.user.last_name='first_name_'+biz9.get_id();
                helper.user.company='company_'+biz9.get_id();
                helper.user.email='email@'+biz9.get_id()+"gmail.com";
                helper.user.address_1='address_1_'+biz9.get_id();
                helper.user.address_2='address_2_'+biz9.get_id();
                helper.user.city='city_'+biz9.get_id();
                helper.user.county='county_'+biz9.get_id();
                helper.user.note='note_'+biz9.get_id();
                helper.user.zip='zip_'+biz9.get_id();
                helper.user.phone='phone_'+biz9.get_id();
            }
            call();
        },
        function(call){
            title_url='primary';
            biz9.get_page(db,title_url,{},function(page){
                helper.primary=page;
                call();
            });
        },
        function(call){
            title_url='product';
            biz9.get_page(db,title_url,{},function(page){
                helper.product=page;
                call();
            });
        },
        function(call){
            helper.product_list=[];
            if(helper.user.tbl_id!=0){
                sql={customer_tbl_id:helper.user.tbl_id};
                sort={};
                page_current=1;
                page_size=10;
                biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                    helper.product_list=result_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.cart_price_total=0;
            for(a=0;a<helper.product_list.length;a++){
                helper.product_list[a].item_group_price=biz9.get_money((parseFloat(helper.product_list[a].item_price)*parseFloat(helper.product_list[a].item_quantity)));
                helper.cart_price_total= parseFloat(helper.cart_price_total)+ (parseFloat(helper.product_list[a].item_price)*parseFloat(helper.product_list[a].item_quantity));
            }
            //helper.cart_price_total=biz9.get_money(helper.cart_price_total+parseFloat(helper.primary.shipping_cost));//if shipping
            helper.cart_price_total=biz9.get_money(helper.cart_price_total);
            biz9.o('aaa',helper);

            call();
        }
    ],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_checkout_success 9_success
router.get('/checkout/success/product',function(req, res, next) {
    var helper =biz9.get_helper(req);
    helper.render='product_checkout_success';
    helper.page_title=G_APP_TITLE+ ': Success ';
    helper.cms_url=G_CMS_APP_URL;
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
            biz9.get_item(db,G_DT_PRODUCT,helper.tbl_id,function(result) {
                helper.item=result;
                call();
            });
        },
        function(call){
            product_order = biz9.get_new_item(G_DT_PRODUCT_ORDER,0);
            product_order.customer_tbl_id=helper.user.tbl_id;
            product_order.item_tbl_id=helper.item.tbl_id;
            product_order.item_data_type=helper.item.data_type;
            product_order.item_price=helper.item.price;
            product_order.item_title=helper.item.title;
            product_order.item_title_url=helper.item.title_url;
            product_order.item_type=helper.item.type;
            product_order.item_sub_type=helper.item.sub_type;
            product_order.item_download_link=helper.item.download_link;
            product_order.photofilename=helper.item.photofilename;
            product_order.retail_id=helper.item.retail_id;
            product_order.retail_name=helper.item.retail_name;
            product_order.retail_price_id=helper.item.retail_price_id;
            product_order.retail_price=helper.item.retail_price;
            product_order.order_id=biz9.get_id(9999);

            if(product_order.item_download_link){
                product_order.note="<a href='"+product_order.item_download_link +"'>Download Now </a>";
            }

            biz9.update_item(db,G_DT_PRODUCT_ORDER,product_order,function(result) {
                helper.item=result;
                call();
            });
        },
    ],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});

//9_retail_cart //9_cart 9_product_cart
router.get('/cart',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='product_cart_list';
    helper.page_title = G_APP_TITLE +': Shopping Cart';
    helper.item = biz9.get_new_item(G_DT_BLANK,0);
    helper.render_list='/shop/all';
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
            helper.product_list=[];
            if(helper.user.tbl_id!=0){
                sql={customer_tbl_id:helper.user.tbl_id};
                sort={};
                page_current=1;
                page_size=10;
                biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                    helper.product_list=result_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.cart_price_total=0;
            for(a=0;a<helper.product_list.length;a++){
                helper.product_list[a].item_group_price=biz9.get_money((parseFloat(helper.product_list[a].item_price)*parseFloat(helper.product_list[a].item_quantity)));
                helper.cart_price_total= parseFloat(helper.cart_price_total)+ (parseFloat(helper.product_list[a].item_price)*parseFloat(helper.product_list[a].item_quantity));
            }
            //helper.cart_price_total=biz9.get_money(helper.cart_price_total+parseFloat(helper.primary.shipping_cost));//if shipping
            helper.cart_price_total=biz9.get_money(helper.cart_price_total);
            call();
        }
    ],
        function(err, results){
            res.render(helper.render,{helper:helper});
            res.end();
        });
});
//9_cart 9_product_cart
router.get('/get_cart_view',function(req, res) {
    var helper = biz9.get_helper(req);
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
            helper.product_list=[];
            if(helper.user.tbl_id!=0){
                sql={customer_tbl_id:helper.user.tbl_id};
                sort={};
                page_current=1;
                page_size=10;
                biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                    helper.product_list=result_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.cart_price_total=0;
            for(a=0;a<helper.product_list.length;a++){
                helper.product_list[a].item_group_price=biz9.get_money((parseFloat(helper.product_list[a].item_price)*parseFloat(helper.product_list[a].item_quantity)));
                helper.cart_price_total= parseFloat(helper.cart_price_total)+ (parseFloat(helper.product_list[a].item_price)*parseFloat(helper.product_list[a].item_quantity));
            }
            //helper.cart_price_total=biz9.get_money(helper.cart_price_total+parseFloat(helper.primary.shipping_cost));
            call();
        }
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
//9_remove_cart 9_cart remove
router.post("/remove_cart/:tbl_id",function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(G_DT_PRODUCT_CART,0,req.body);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            biz9.delete_item(db,G_DT_PRODUCT_CART,helper.tbl_id,function(result) {
                helper.item.result;
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
//9_update_cart 9_cart_update
router.post("/update_cart/:data_type/:tbl_id",function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(G_DT_PRODUCT_CART,0,req.body);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            if(helper.user.tbl_id==0){
                helper.user.is_guest='true';
                helper.user.tbl_id=biz9.get_id();
                biz9.save_user(req,helper.user);
                call();
            }else{
                call();
            }
        },
        function(call){
            if(helper.product_cart_tbl_id){
                helper.item.tbl_id = helper.product_cart_tbl_id;
                helper.item.quantity = helper.quantity;
            }else{
                helper.item.tbl_id = 0;
                helper.item.quantity=1;
            }
            call();
        },
        function(call){
            helper.item.customer_tbl_id=helper.user.tbl_id;
            helper.item.customer_is_guest=helper.user.is_guest;
            biz9.get_item(db,helper.data_type,helper.tbl_id,function(result) {
                helper.item.item_tbl_id=result.tbl_id;
                helper.item.item_data_type=result.data_type;
                helper.item.item_price=result.price;
                helper.item.item_money_price=biz9.get_money(result.price);
                helper.item.item_title=result.title;
                helper.item.item_quanity=result.quantity;
                helper.item.item_category=result.category;
                helper.item.item_title_url=result.title_url;
                helper.item.photofilename=result.photofilename;

                helper.item.retail_id=result.retail_id;
                helper.item.retail_name=result.retail_name;
                helper.item.retail_price_id=result.retail_price_id;
                helper.item.retail_price=result.retail_price;
                call();
            });
        },
        function(call){
            biz9.update_item(db,G_DT_PRODUCT_CART,helper.item,function(result) {
                helper.item=result;
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
//9_update_cart_list 9_cart_list
router.post("/update_cart_list",function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.set_item_data(G_DT_PRODUCT_CART,0,req.body);
    helper.product_list=[];
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            if(helper.user.tbl_id==0){
                helper.user.is_guest='true';
                helper.user.tbl_id=biz9.get_id();
                biz9.save_user(req,helper.user);
                call();
            }else{
                call();
            }
        },
        function(call){
            if(helper.id_list){
                _id_list = helper.id_list.split(',');
            }

            if(helper.quantity_list){
                _quantity_list = helper.quantity_list.split(',');
            }

            for(a=0;a<_id_list.length;a++){
                if(_id_list[a]){
                    helper.product_list.push({tbl_id:_id_list[a],quantity:_quantity_list[a],data_type:G_DT_PRODUCT_CART});
                }
            }
            call();
        },
        function(call){
            biz9.update_list(db,helper.product_list,function(result) {
                call();
            });
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
//9_checkout 9_product_checkout 9_session
router.post("/create-checkout-session",async (req, res) => {
    var helper = biz9.get_helper(req);
    helper.retail_line_items=[];
    helper.cart_price_total=0;
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
            helper.item_list=[];
            if(helper.user.tbl_id!=0){
                sql={customer_tbl_id:helper.user.tbl_id};
                sort={};
                page_current=1;
                page_size=10;
                biz9.get_cart_productz(db,sql,sort,page_current,page_size,function(result_list,total_count,page_page_count) {
                    helper.item_list=result_list;
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            for(a=0;a<helper.item_list.length;a++){
                helper.cart_price_total=biz9.get_money((parseFloat(helper.cart_price_total)+parseFloat(helper.item_list[a].item_price)));
                    helper.retail_line_items.push({
                        name:helper.item_list[a].item_title,
                        quantity:helper.item_list[a].item_quanity,
                        amount:biz9.get_currency(helper.item_list[a].item_price),
                    });
                }
            call();
        },
        function(call){
            helper.form_url='?first_name='+helper.first_name+
                '&last_name='+helper.last_name+
                '&company='+helper.company+
                '&country='+helper.street_address+
                '&state='+helper.state+
                '&email='+helper.email+
                '&note='+helper.note;
            call();
        },
        function(call){
            if(!helper.validation_message){
                const run = async function(a, b) {
                    const stripe = require('stripe')(helper.primary.stripe_key);
                    const items = helper.retail_line_items.map((item, a) => {
                        return {
                            name:helper.retail_line_items[a].name,
                            quantity:helper.retail_line_items[a].quantity,
                            amount:helper.retail_line_items[a].amount,
                            currency:'usd',

                        };
                    });
                    const session = await stripe.checkout.sessions.create({
                        line_items: items,
                        payment_method_types: [
                            'card',
                        ],
                        mode: 'payment',
                        success_url: G_URL+"/shop/checkout/success"+helper.form_url,
                        cancel_url: G_URL+"/shop/checkout"+helper.form_url,
                    });
                    helper.checkout_redirect_url = session.url;
                    call();
                }
                run();
            }else{
                call();
            }
        },
    ],
        function(err, results){
            if(helper.validation_message){
                res.redirect('/shop/checkout/'+helper.form_url+"&validation_message="+helper.validation_message);
            }else{
                res.redirect(303,helper.checkout_redirect_url);
            }
            res.end();
        });
});
//9_product_detail 9_detail
router.get('/:title_url',function(req, res) {
    var helper = biz9.get_helper(req);
    helper.render='product_detail';
    helper.page_title = G_APP_TITLE +': Shop ';
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
            title_url='shop';
            biz9.get_page(db,title_url,{},function(page){
                helper.shop=page;
                call();
            });
        },
        function(call){
            biz9.get_product(db,helper.title_url,function(result) {
                helper.item=result;
                helper.page_title = G_APP_TITLE +': Shop '+ helper.item.title;
                call();
            });
        },
        function(call){
            sql={visible:'true'};
            sort={date_create:1};
            page_current=1;
            page_size=9;
            biz9.get_productz(db,sql,sort,page_current,page_size,function(result_list) {
                helper.product_list=result_list;
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
