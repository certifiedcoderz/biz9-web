var express = require('express');
var router = express.Router();
router.get('/ping', function(req, res, next) {
    var helper = biz9.get_helper(req);
    helper.test = 'crud photo ping';
    res.send({helper:helper});
    res.end();
});
router.post("/update_photo", function(req, res) {
    var helper = biz9.get_helper(req);
    helper.item = biz9.get_new_item(G_DT_BLANK, 0);
    helper.validation_message=null;
    async.series([
        //get file name
        function(call){
            helper.item.photofilename = biz9.get_guid() + '.jpg';
            call();
        },
        //save file
        function(call){
            const fs = require('fs');
            const path = require('path');
            const bb = busboy({ headers: req.headers });
            bb.on('file', (name, file, info) => {
                const saveTo = path.join(G_FILE_SAVE_PATH,helper.item.photofilename);
                biz9.o('saveTo',saveTo);
                file.pipe(fs.createWriteStream(saveTo));
            });
            req.pipe(bb);
            bb.on('finish', () => {
                call();
            });
        },
        //check if valid photo
        function(call){
            var detect = require('detect-file-type');
            detect.fromFile(G_FILE_SAVE_PATH+helper.item.photofilename, function(err, result) {
                if (err) {
                    helper.validation_message='error: detect-file-type-error';
                    call();
                }else{
                    if(result.ext!='jpg'&&result.ext!='png'&&result.ext!='jpeg'&&result.ext!='svg'&&result.ext!='webp'){
                        biz9.o('error file type',result);
                        helper.validation_message='error: invalid file type';
                    }
                    call();
                }
            });
        },
        //save with new filename size thumb_size
        function(call){
            biz9.set_resize_photo_file(G_PHOTO_SIZE_THUMB.size,G_FILE_SAVE_PATH,helper.item.photofilename,G_PHOTO_SIZE_THUMB.title_url+helper.item.photofilename,function(result) {
                call();
            });
        },
        //save with new filename size mid
        function(call){
            biz9.set_resize_photo_file(G_PHOTO_SIZE_MID.size,G_FILE_SAVE_PATH,helper.item.photofilename,G_PHOTO_SIZE_MID.title_url+helper.item.photofilename,function(result) {
                call();
            });
        },
        //save with new filename size large
        function(call){
            biz9.set_resize_photo_file(G_PHOTO_SIZE_LARGE.size,G_FILE_SAVE_PATH,helper.item.photofilename,G_PHOTO_SIZE_LARGE.title_url+helper.item.photofilename,function(result) {
                call();
            });
        },
        //update_s3_org
        function(call){
            if(G_S3_SAVE){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,helper.item.photofilename,helper.item.photofilename,function(result) {
                    call();
                });
            }else{
                call();
            }
        },
        //delete file org
        function(call){
            if(helper.validation_message==null){
                const fs = require('fs')
                try {
                    fs.unlinkSync(G_FILE_SAVE_PATH+helper.item.photofilename)
                    call();
                } catch(err) {
                    helper.validation_message='error: org could not delete file';
                    call();
                }
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
        //delete file thumb
        function(call){
            if(helper.validation_message==null){
                const fs = require('fs')
                try {
                    fs.unlinkSync(G_FILE_SAVE_PATH+G_PHOTO_SIZE_THUMB.title_url+helper.item.photofilename)
                    call();
                } catch(err) {
                    helper.validation_message='error: thumb could not delete file';
                    call();
                }
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
        //delete file mid
        function(call){
            if(helper.validation_message==null){
                const fs = require('fs')
                try {
                    fs.unlinkSync(G_FILE_SAVE_PATH+G_PHOTO_SIZE_MID.title_url+helper.item.photofilename)
                    call();
                } catch(err) {
                    helper.validation_message='error: mid could not delete file';
                    call();
                }
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
        //delete file large
        function(call){
            if(helper.validation_message==null){
                const fs = require('fs')
                try {
                    fs.unlinkSync(G_FILE_SAVE_PATH+G_PHOTO_SIZE_LARGE.title_url+helper.item.photofilename)
                    call();
                } catch(err) {
                    helper.validation_message='error: large could not delete file';
                    call();
                }
            }else{
                call();
            }
        },
        function(call){
            helper.item = biz9.set_biz_item(helper.item);
            call();
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
router.post("/update_mp3", function(req, res) {
    var helper = biz9.get_helper(req);
    var mp3Duration = require('mp3-duration');
    helper.item = biz9.get_new_item(G_DT_BLANK, 0);
    helper.validation_message=null;
    async.series([
        //get file name
        function(call){
            helper.item.mp3filename = biz9.get_guid() + '.mp3';
            call();
        },
        //save file
        function(call){
            const fs = require('fs');
            const path = require('path');
            const bb = busboy({ headers: req.headers });
            bb.on('file', (name, file, info) => {
                const saveTo = path.join(G_FILE_SAVE_PATH,helper.item.mp3filename);
                biz9.o('saveTo',saveTo);
                file.pipe(fs.createWriteStream(saveTo));
            });
            req.pipe(bb);
            bb.on('close', () => {
                call();
            });
        },
        //check if valid mp3
        function(call){
            var detect = require('detect-file-type');
            detect.fromFile(G_FILE_SAVE_PATH+helper.item.mp3filename, function(err, result) {
                if (err) {
                    helper.validation_message='error: detect-file-type-error';
                    call();
                }else{
                    if(result.ext!='mp3'){
                        helper.validation_message='error: invalid file type';
                    }
                    call();
                }
            });
        },
        function(call){
            helper.item.mp3duration='0:00';
            if(helper.validation_message==null){
                mp3Duration(G_FILE_SAVE_PATH+helper.item.mp3filename,function(err,duration){
                    if (err)
                        console.log(err);
                    helper.item.mp3duration=biz9.get_duration(duration);
                    call();
                });
            }else{
                call();
            }
        },
        //upload to s3
        function(call){
            if(G_S3_SAVE && helper.validation_message==null){
                biz9.update_bucket_file(G_FILE_SAVE_PATH,helper.item.mp3filename,helper.item.mp3filename,function(result){
                    helper.item.mp3_url = G_FILE_URL+helper.item.mp3filename;
                    biz9.o('FILE_URL',helper.item.mp3_url);
                    call();
                });
            }else{
                call();
            }
        },
        //delete mp3
        function(call){
            if(helper.validation_message==null){
                const fs = require('fs')
                try {
                    fs.unlinkSync(G_FILE_SAVE_PATH+helper.item.mp3filename)
                    call();
                } catch(err) {
                    helper.validation_message='error: could not delete mp3';
                    call();
                }
            }
        },
    ],
        function(err, results){
            res.send({helper:helper});
            res.end();
        });
});
module.exports = router;
