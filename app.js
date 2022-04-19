/* --- APP REQUIRE START -- */
express = require('express');
path = require('path');
async=require('async');
session=require('express-session');
var busboy = require('connect-busboy');
/* --- APP REQUIRE END --- */
/* --- APP DEFAULT START --- */
G_ENV=process.env.NODE_ENV;
/*--- APP DEFAULT END ---*/
/* --- APP CONFIG START  --- */
G_APP_ID='19';
G_APP_TITLE_ID='bossappzweb';
G_APP_TITLE='Blank Web';
G_APP_VERSION='0.1.1'
/* --- APP CONFIG END  --- */
/* --- ENV CONFIG START --- */
if(G_ENV == "test"){
	/* --- ENV CONFIG START --- */
	G_APP_PORT='1901';
	/* --- ENV CONFIG END --- */
	/* --- ENV AWS START --- */
	G_S3_SAVE=false;
	G_S3_BUCKET='bossappzweb';
	G_AWS_KEY='-';
	G_AWS_SECRET='-';
	/* --- ENV AWS END --- */
	/* --- ENV EMAILZ START --- */
	G_EMAIL_TO='alert@certifiedcoderz.com';
	G_EMAIL_FROM='alert@certifiedcoderz.com';
	/* --- ENV EMAILZ START --- */
	/* --- ENV FILE START --- */
	G_FILE_SAVE_PATH='/public/uploads/';
	G_FILE_URL='/uploads/'; //box_url
	//G_FILE_URL="https://"+G_S3_BUCKET+".s3.amazonaws.com/" //aws_s3_url
	/* --- ENV FILE END --- */
}
//else if(G_ENV == "prod"){
//}
//
/* --- ENV CONFIG END -- */
/* --- DATA_TYPE-START --- */
G_DT_ITEM_MAP='item_map_biz';
G_DT_USER='user_biz';
G_DT_COMMENT='comment_biz';
G_DT_BLANK='blank_biz';
G_DT_PHOTO='photo_biz';
G_DT_BLOG_POST='blog_post_biz';
G_DT_PRODUCT='product_biz';
G_DT_PRODUCT_CART='product_cart_biz';
G_DT_PRODUCT_CHECKOUT='product_checkout_biz';
G_DT_SERVICE='service_biz';
G_DT_TEAM='team_biz';
/* --- DATA_TYPE-END --- */
/* --- BiZ9_CORE_CONFIG-START --- */
data_config={
	mongo_url:"mongodb://localhost",
	mongo_port:"27019",
	mongo_name:G_APP_TITLE_ID,
    redis_url:"127.0.0.1",
	redis_port:6379};
app_config={
	app_title_id:G_APP_TITLE_ID,
	app_version:G_APP_VERSION,
	app_title:G_APP_TITLE,
	app_id:G_APP_ID,
	file_path:G_FILE_SAVE_PATH,
	g_file_url:G_FILE_URL
};
aws_config={
	aws_key:G_AWS_KEY,
	aws_secret:G_AWS_SECRET,
	aws_region:'us-east-1',
	aws_s3_bucket:G_S3_BUCKET
};
biz9=require('biz9-core')(app_config,aws_config,data_config);
/* --- BiZ9_CORE_CONFIG-END --- */
/* --- APP URL START  -- */
test=require('./routes/cloud/test');
crud=require('./routes/cloud/crud');
mail=require('./routes/cloud/mail');
file=require('./routes/cloud/file');
index=require('./routes/index');
/* --- APP URL END  -- */
/* --- APP EXPRESS START --- */
var app = express();
app.use(session({
	secret: "secret_key_cms",
	cookieName: 'session_cms',
	secret: 'eg[isfd-8yF9-7w2315df{}+Ijsli;;to8',
	duration: 30 * 60 * 1000,
	activeDuration: 5 * 60 * 1000,
	saveUninitialized: false,
	resave:false
}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb',extended:false}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(busboy({
	immediate: true,
	highWaterMark: 2 * 1024 * 1024,
}));
/* --- APP EXPRESS END --- */
/* --- APP ROUTES START --- */
app.use('/', index);
app.use('/shop', shop);
app.use('/blog', blog_post);
app.use('/service', service);
app.use('/cloud/crud',crud);
app.use('/cloud/mail',mail);
app.use('/cloud/file',file);
app.use('/cloud/test',test);
/* --- APP ROUTES END --- */
/* --- APP ERROR START --- */
app.use(function(err, req, res, next) {
	res.locals.message = err.message;
	res.locals.error =  err;
	res.status(err.status || 500);
	res.render('error');
});
/* --- APP ERROR END --- */
module.exports = app;
