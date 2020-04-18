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
        //chỉ cho phép tải lên các loại ảnh jpeg & jpg
        let math = ["image/jpeg"];
        //thông báo lỗi khi upload file không hợp lệ
        if (math.indexOf(file.mimetype) === -1) {
            let errorMess = 'file ' + file.originalname + ' không hợp lệ. Chỉ được Upload file ảnh đuôi jpeg & jpg.';
            return cb(errorMess, null);
        } else {
            var date = new Date();
            var milis = date.getTime();

            //thiết lập tên file
            cb(null, milis + file.originalname)
        }

    }
})

//giới gạn kích thước 1 file
let upload = multer({
    storage: multerConfig, limits: {
        fileSize: 2 * 1024 * 1024
    }
})

// upload 1 file
let file = upload.single('avatar')

//upload nhiều file
let uploadManyFiles = multer({
    storage: multerConfig, limits: {
        fileSize: 2 * 1024 * 1024
    }
}).array("avatar", 5);

app.post('/upload',
    (req, res) => {
        //hiển thị các thông báo khi upload 1 file
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

        //hiển thị các thông báo khi upload nhiều file
        uploadManyFiles(req, res, function (err) {
            if (err) {
                if (req.files.length >= 5) {
                    res.send('Upload ảnh không thành công. Chỉ được tải lên giới hạn 5 file')
                } else if (err instanceof multer.MulterError) {
                    res.send('Upload ảnh không thành công. Chỉ được tải lên ảnh giới hạn 2MB')
                } else {
                    res.send('' + err)
                }
            } else {
                res.send('Upload ' + req.files.length + ' ảnh thành công. Kiểm tra thư mục uploads')
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
