/* --- APP REQUIRE START -- */
express = require('express');
path = require('path');
async=require('async');
session=require('express-session');
busboy = require('connect-busboy');
/* --- APP REQUIRE END -- */

/*-- APP DEFAULT START -- */
G_ENV=process.env.NODE_ENV;
G_APP_PORT='1901';
G_MONGO_URL="mongodb://localhost";
G_MONGO_PORT="27019";
/*-- APP DEFAULT END --*/

/* --- APP CONFIG START  -- */
G_APP_ID='12';
G_APP_TITLE_ID='app_id';
G_APP_TITLE='App Title';
G_APP_VERSION='0.0.9'
/* --- APP CONFIG END  -- */

if(G_ENV == "test"){
    G_EMAIL_TO='support@bossappz.com';
    G_EMAIL_FROM='support@bossappz.com';
    G_AWS_KEY='AKIATDUGBG2465XKLHHI';
    G_AWS_SECRET='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';
    G_FILE_SAVE_PATH='public/uploads/';
    G_S3_BUCKET=G_APP_TITLE_ID;
    G_S3_SAVE=false;
    G_URL='http://localhost:1900';
    G_APP_PUBLIC_PORT='1901'
    G_FILE_URL='/uploads/';
    //G_FILE_URL="https://"+G_S3_BUCKET+".s3.amazonaws.com/"
}else if(G_ENV == "prod"){
    G_EMAIL_TO='support@bossappz.com';
    G_EMAIL_FROM='support@bossappz.com';
    G_AWS_KEY='AKIA4TOXGYOIH6RCZBHL';
    G_AWS_SECRET='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';
    G_FILE_SAVE_PATH='../web/public/uploads/';
    G_S3_BUCKET=G_APP_TITLE_ID;
    G_S3_SAVE=false;
    G_FILE_URL='/uploads/';
}
/* -- APP CONFIG END -- */

///*--- BiZ9_DATA_TYPE-START ---*/
G_DT_ITEM_MAP='item_map_biz';
G_DT_USER='user_biz';
G_DT_BLANK='blank_biz';
G_DT_PHOTO='photo_biz';
G_DT_BLOG_POST='blog_post_biz';
G_DT_PRODUCT='product_biz';
G_DT_PRODUCT_CART='product_cart_biz';
G_DT_PRODUCT_CHECKOUT='product_checkout_biz';
G_DT_SERVICE='service_biz';
///*--- BiZ9_DATA_TYPE-END ---*/

///*--- BiZ9_CONFIG-START ---*/
data_config={
    mongo_url:G_MONGO_URL,
    mongo_port:G_MONGO_PORT,
    mongo_name:G_APP_TITLE_ID,
    redis_url:"127.0.0.1",
    redis_port:6379};
app_config={
    app_title_id:G_APP_TITLE_ID,
    app_version:G_APP_VERSION,
    app_title:G_APP_TITLE,
    app_id:G_APP_ID,
    file_path:G_FILE_SAVE_PATH,
    s3_save:G_S3_SAVE,
    app_stage_logic:__dirname+"/db/biz_logic/page_key_logic.js",
    g_file_url:G_FILE_URL,
};
aws_config={
    aws_key:G_AWS_KEY,
    aws_secret:G_AWS_SECRET,
    aws_region:'us-east-1',
    aws_s3_bucket:G_S3_BUCKET
};
biz9=require('biz9-core')(app_config,aws_config,data_config);

///*--- BiZ9_CONFIG-START ---*/
/* --- APP CONFIG END  -- */
/* --- APP URL START  -- */
test=require('./routes/cloud/test');
crud=require('./routes/cloud/crud');
mail=require('./routes/cloud/mail');
file=require('./routes/cloud/file');
shop=require('./routes/shop');
blog_post=require('./routes/blog_post');
service=require('./routes/service');
index=require('./routes/index');
/* --- APP URL END  -- */
/* --- APP EXPRESS START -- */
var app = express();
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: "Your_secret_key",
    saveUninitialized: true,
    cookieName: 'session',
    secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
    httpOnly: true,
    secure: true,
    ephemeral: true,
    resave: true,
    saveUninitialized: true
}));
app.use(busboy({
    highWaterMark: 2 * 1024 * 1024, // Set 2MiB buffer
}));
/* --- APP ROUTES START -- */
app.use('/', index);
app.use('/shop', shop);
app.use('/blog', blog_post);
app.use('/service', service);
app.use('/cloud/crud',crud);
app.use('/cloud/mail',mail);
app.use('/cloud/file',file);
app.use('/cloud/test',test);
/* --- APP ROUTES END -- */

/* --- APP ERROR START -- */
app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error =  err;
    res.status(err.status || 500);
    res.render('error');
});
/* --- APP ERROR END -- */

module.exports = app;
