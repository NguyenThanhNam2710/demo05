let express = require('express');
let hbs = require('express-handlebars');
let app = express();
const util = require('util');
let multer = require('multer');
let multerConfig = multer.diskStorage({
    destination: function (req, file, cb) {

        //thiết lập file lưu
        cb(null, './uploads');
    }, filename(req, file, cb) {
        //chỉ cho phép tải lên các loại ảnh png & jpg
        let math = ["image/png", "image/jpeg"];
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = 'file ' + file.originalname + ' không hợp lệ. Chỉ được Upload file ảnh đuôi jpeg hoặc png.';
            return cb(errorMess, null);
        } else {
            var date = new Date();
            var milis = date.getTime();

            //thiết lập tên file
            cb(null, milis + file.originalname)
        }

    }
})

let upload = multer({
    storage: multerConfig, limits: {
        fileSize: 2 * 1024 * 1024
    }
})


let file = upload.single('avatar')


let uploadManyFiles = multer({storage: multerConfig}).array("avatar", 5);
app.post('/upload',
    (req, res) => {
        // file(req, res, function (err) {
        //     if (err) {
        //         // kiem tra loi co phai la max file ko
        //         if (err instanceof multer.MulterError) {
        //             res.send('kích thước file lớn hơn 2mb' + res)
        //         } else {
        //             res.send('' + err)
        //         }
        //
        //     } else {
        //         res.send('thanh cong roi kiem tra thu muc uploads')
        //
        //     }
        // })

        uploadManyFiles(req, res, function (err) {
            if(err){
                res.send('' + err)
            }else {
                res.send('thanh cong roi kiem tra thu muc uploads')
            }
        })
    });


app.engine('.hbs', hbs({
    extname: 'hbs',
    defaultLayout: '',
    layoutsDir: ''
}))
app.set('view engine', '.hbs')
app.listen(9091);

app.get('/', function (request, response) {
    response.render('index');
});
