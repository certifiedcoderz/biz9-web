var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud photo ping';
    res.send({helper:helper});
    res.end();
});
router.post('/update_mp3_web',function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(G_DT_BLANK, 0);

    p_buffer=null;
    async.series([
        function(call){
            biz9.set_file_upload(req,G_FILE_SAVE_PATH,function(result) {
                helper.item.filename=result;
                call();
            });
        },
        //update_s3_file
        function(call){
            if(G_S3_SAVE){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,helper.item.filename,helper.item.filename,function(result) {
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.file_url=G_FILE_URL+helper.item.filename;
            call();
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.post('/update_photo_web',function(req,res){
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(G_DT_PHOTO, 0);
    p_buffer=null;
    async.series([
        function(call){
            biz9.set_file_upload(req,G_FILE_SAVE_PATH,function(result) {
                helper.item.org_filename=result;
                call();
            });
        },
        function(call){
            _id = biz9.get_id();
            biz9.get_file_ext(G_FILE_SAVE_PATH,helper.item.org_filename,function(result) {
                helper.item.photofilename=_id+result;
                call();
            });
        },
        //save with new filename
        function(call){
            biz9.set_photo_file(G_FILE_SAVE_PATH,helper.item.org_filename,helper.item.photofilename,function(result) {
                call();
            });
        },
        //save with new filename size thumb_size
        function(call){
            biz9.set_resize_photo_file(G_PHOTO_SIZE_THUMB.size,G_FILE_SAVE_PATH,helper.item.org_filename,G_PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,function(result) {
                call();
            });
        },
        //save with new filename size mid
        function(call){
            biz9.set_resize_photo_file(G_PHOTO_SIZE_MID.size,G_FILE_SAVE_PATH,helper.item.org_filename,G_PHOTO_SIZE_MID.title_url+helper.item.photofilename,function(result) {
                call();
            });
        },
        //save with new filename size large
        function(call){
            biz9.set_resize_photo_file(G_PHOTO_SIZE_LARGE.size,G_FILE_SAVE_PATH,helper.item.org_filename,G_PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,function(result) {
                call();
            });
        },
        //get_buffer
        function(call){
            if(G_S3_SAVE){
                biz9.get_file_buffer(G_FILE_SAVE_PATH,helper.item.org_filename,function(result) {
                    p_buffer=result;
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_org
        function(call){
            if(G_S3_SAVE){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,helper.item.org_filename,helper.item.photofilename,function(result) {
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_thumb
        function(call){
            if(G_S3_SAVE){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,G_PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,G_PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,function(result) {
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_mid
        function(call){
            if(G_S3_SAVE){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,G_PHOTO_SIZE_MID.title_url+helper.item.photofilename,G_PHOTO_SIZE_MID.title_url+helper.item.photofilename,function(result) {
                    call();
                });
            }else{
                call();
            }
        },
        //update_s3_large
        function(call){
            if(G_S3_SAVE){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,G_PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,G_PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,function(result) {
                    call();
                });
            }else{
                call();
            }
        },
        function(call){
            helper.item=biz9.set_biz_item(helper.item);
            call();
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/remove_photo/:data_type/:tbl_id", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(helper.data_type, helper.tbl_id);
    async.series([
        function(call){
            biz9.get_connect_db(helper.app_title_id,function(_db){
                db=_db;
                call();
            });
        },
        function(call){
            helper.item.photofilename=null;
            biz9.update_item(db,helper.data_type,helper.item,function(result) {
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
module.exports = router;
