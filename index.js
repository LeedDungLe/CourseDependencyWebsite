const express = require('express');
const hbs = require('express-handlebars');
const bodyParser = require("body-parser");
const app = express();
const con = require('./models/taskModel');
const path = require('path')
var Handlebars = require('handlebars');

app.use(express.static('public'));
app.engine('hbs', hbs.engine({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main',
    extname: '.hbs'
}));
app.set('view engine', 'hbs');
app.use(bodyParser.urlencoded({
    extended: true
}))
app.use(bodyParser.json())
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')))
app.use('/js', express.static(path.join(__dirname, 'node_modules/jquery/dist')))
app.use('/highcharts', express.static(path.join(__dirname, 'node_modules/highcharts')))


app.get('/', (req, res) => {
    res.render('index', {});
});

Handlebars.registerHelper("inc", function(value, options) {
    return parseInt(value) + 1;
});


app.post('/', (req, res) => {
    let query = "SELECT * FROM coursedata WHERE maHocPhan = ?";
    moduleCode = req.body.task_id.trim()
    con.query(query, [moduleCode], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.render('index', {
                isExist: false,
                showDetail: true
            });
        } else {
            var insertQuery = "INSERT INTO searchcount (maHocPhan, userAgent) VALUES (?,?)";
            con.query(insertQuery, [moduleCode, req.headers['user-agent']], function(err, result) {
                if (err) throw err;
            });
            let commentQuery = "SELECT  content, uploader, substr(dateTime,1,23) as dateTime FROM comments WHERE maHocPhan = ?";
            con.query(commentQuery, [moduleCode], (err, cmtLst) => {
                if (err) throw err;
                let countQuery = "SELECT COUNT(*) as count FROM coursedata where hocPhanDieuKien like ?";
                con.query(countQuery, '%' + [moduleCode] + '%', (err, countDep) => {
                    if (err) throw err;
                    urlImg = "http://sinno.soict.ai:37080/course?id=" + moduleCode
                        // urlImg = "http://localhost:80/course?id=" + moduleCode
                        // Nếu không có yêu cầu học phần điều kiện
                    if (result[0].hocPhanDieuKien.trim() == '') {
                        res.render('index', {
                            isExist: true,
                            showDetail: true,
                            moduleCode: result[0].maHocPhan,
                            moduleName: result[0].tenHocPhan,
                            Duration: result[0].thoiLuong,
                            NumberOfCredits: result[0].soTinChi,
                            TCTuitionFees: result[0].tinChiHocPhi,
                            Weighting: result[0].trongSo,
                            FactorManagementInstitute: result[0].vienQuanLy,
                            goal: result[0].mucTieu,
                            content: result[0].noiDung,
                            conditonModule: result[0].hocPhanDieuKien,
                            srcText: urlImg,
                            needPreCondition: false,
                            countDep: countDep[0].count,
                            cmtLst: cmtLst
                        });
                    }
                    // Với trường hợp có yêu cầu các học phần điều kiện
                    else {
                        var spawn = require('child_process').spawn;
                        var process2 = spawn('python', [
                            './calc.py', moduleCode
                        ]);
                        process2.stdout.on('data', function(data1) {
                            data1 = data1.toString().replace(/(\r\n|\n|\r)/gm, "");
                            hasSubImage = true
                            if (data1 == "stop") {
                                hasSubImage = false
                            }
                            var process = spawn('python', [
                                './script.py', result[0].hocPhanDieuKien
                            ]);
                            process.stdout.on('data', function(data) {
                                // giá trị từ phía python trả về dưới dạng buffer, chuyển đổi sang dạng dữ liệu có thể dùng được
                                data = data.toString().replace(/(\r\n|\n|\r)/gm, "");
                                data = eval(`(${data})`);
                                // Nếu không có học phần bắt buộc
                                if (data.preCourseLst.length == 0 &&
                                    data.prerequite.length == 0 &&
                                    data.corequisite.length == 0) {
                                    res.render('index', {
                                        isExist: true,
                                        showDetail: true,
                                        moduleCode: result[0].maHocPhan,
                                        moduleName: result[0].tenHocPhan,
                                        Duration: result[0].thoiLuong,
                                        NumberOfCredits: result[0].soTinChi,
                                        TCTuitionFees: result[0].tinChiHocPhi,
                                        Weighting: result[0].trongSo,
                                        FactorManagementInstitute: result[0].vienQuanLy,
                                        goal: result[0].mucTieu,
                                        content: result[0].noiDung,
                                        conditonModule: result[0].hocPhanDieuKien,
                                        srcText: urlImg,
                                        isRequire: false,
                                        needPreCondition: true,
                                        hasSubImage: hasSubImage,
                                        filePath: data1,
                                        countDep: countDep[0].count,
                                        cmtLst: cmtLst
                                    });
                                } else {
                                    res.render('index', {
                                        isExist: true,
                                        showDetail: true,
                                        moduleCode: result[0].maHocPhan,
                                        moduleName: result[0].tenHocPhan,
                                        Duration: result[0].thoiLuong,
                                        NumberOfCredits: result[0].soTinChi,
                                        TCTuitionFees: result[0].tinChiHocPhi,
                                        Weighting: result[0].trongSo,
                                        FactorManagementInstitute: result[0].vienQuanLy,
                                        goal: result[0].mucTieu,
                                        content: result[0].noiDung,
                                        conditonModule: result[0].hocPhanDieuKien,
                                        srcText: urlImg,
                                        isRequire: true,
                                        requirement: data,
                                        needPreCondition: true,
                                        hasSubImage: hasSubImage,
                                        filePath: data1,
                                        countDep: countDep[0].count,
                                        cmtLst: cmtLst
                                    });
                                }
                            });
                            process.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                            });
                        });
                        process2.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });
                    }


                })
            })
        }
    })
})


app.get('/code', (req, res) => {
    let query = "SELECT * FROM coursedata WHERE maHocPhan = ?";
    moduleCode = req.query.task_id.trim()
    con.query(query, [moduleCode], (err, result) => {
        if (err) throw err;
        if (result.length === 0) {
            res.render('index', {
                isExist: false,
                showDetail: true
            });
        } else {
            var insertQuery = "INSERT INTO searchcount (maHocPhan, userAgent) VALUES (?,?)";
            con.query(insertQuery, [moduleCode, req.headers['user-agent']], function(err, result) {
                if (err) throw err;
            });
            let commentQuery = "SELECT  content, uploader, substr(dateTime,1,23) as dateTime FROM comments WHERE maHocPhan = ?";
            con.query(commentQuery, [moduleCode], (err, cmtLst) => {
                if (err) throw err;
                let countQuery = "SELECT COUNT(*) as count FROM coursedata where hocPhanDieuKien like ?";
                con.query(countQuery, '%' + [moduleCode] + '%', (err, countDep) => {
                    if (err) throw err;
                    urlImg = "http://sinno.soict.ai:37080/course?id=" + moduleCode
                        // urlImg = "http://localhost:80/course?id=" + moduleCode
                        // Nếu không có yêu cầu học phần điều kiện
                    if (result[0].hocPhanDieuKien.trim() == '') {
                        res.render('index', {
                            isExist: true,
                            showDetail: true,
                            moduleCode: result[0].maHocPhan,
                            moduleName: result[0].tenHocPhan,
                            Duration: result[0].thoiLuong,
                            NumberOfCredits: result[0].soTinChi,
                            TCTuitionFees: result[0].tinChiHocPhi,
                            Weighting: result[0].trongSo,
                            FactorManagementInstitute: result[0].vienQuanLy,
                            goal: result[0].mucTieu,
                            content: result[0].noiDung,
                            conditonModule: result[0].hocPhanDieuKien,
                            srcText: urlImg,
                            needPreCondition: false,
                            countDep: countDep[0].count,
                            cmtLst: cmtLst
                        });
                    }
                    // Với trường hợp có yêu cầu các học phần điều kiện
                    else {
                        var spawn = require('child_process').spawn;
                        var process2 = spawn('python', [
                            './calc.py', moduleCode
                        ]);
                        process2.stdout.on('data', function(data1) {
                            data1 = data1.toString().replace(/(\r\n|\n|\r)/gm, "");
                            hasSubImage = true
                            if (data1 == "stop") {
                                hasSubImage = false
                            }
                            var process = spawn('python', [
                                './script.py', result[0].hocPhanDieuKien
                            ]);
                            process.stdout.on('data', function(data) {
                                // giá trị từ phía python trả về dưới dạng buffer, chuyển đổi sang dạng dữ liệu có thể dùng được
                                data = data.toString().replace(/(\r\n|\n|\r)/gm, "");
                                data = eval(`(${data})`);
                                // Nếu không có học phần bắt buộc
                                if (data.preCourseLst.length == 0 &&
                                    data.prerequite.length == 0 &&
                                    data.corequisite.length == 0) {
                                    res.render('index', {
                                        isExist: true,
                                        showDetail: true,
                                        moduleCode: result[0].maHocPhan,
                                        moduleName: result[0].tenHocPhan,
                                        Duration: result[0].thoiLuong,
                                        NumberOfCredits: result[0].soTinChi,
                                        TCTuitionFees: result[0].tinChiHocPhi,
                                        Weighting: result[0].trongSo,
                                        FactorManagementInstitute: result[0].vienQuanLy,
                                        goal: result[0].mucTieu,
                                        content: result[0].noiDung,
                                        conditonModule: result[0].hocPhanDieuKien,
                                        srcText: urlImg,
                                        isRequire: false,
                                        needPreCondition: true,
                                        hasSubImage: hasSubImage,
                                        filePath: data1,
                                        countDep: countDep[0].count,
                                        cmtLst: cmtLst
                                    });
                                } else {
                                    res.render('index', {
                                        isExist: true,
                                        showDetail: true,
                                        moduleCode: result[0].maHocPhan,
                                        moduleName: result[0].tenHocPhan,
                                        Duration: result[0].thoiLuong,
                                        NumberOfCredits: result[0].soTinChi,
                                        TCTuitionFees: result[0].tinChiHocPhi,
                                        Weighting: result[0].trongSo,
                                        FactorManagementInstitute: result[0].vienQuanLy,
                                        goal: result[0].mucTieu,
                                        content: result[0].noiDung,
                                        conditonModule: result[0].hocPhanDieuKien,
                                        srcText: urlImg,
                                        isRequire: true,
                                        requirement: data,
                                        needPreCondition: true,
                                        hasSubImage: hasSubImage,
                                        filePath: data1,
                                        countDep: countDep[0].count,
                                        cmtLst: cmtLst
                                    });
                                }
                            });
                            process.stderr.on('data', (data) => {
                                console.error(`stderr: ${data}`);
                            });
                        });
                        process2.stderr.on('data', (data) => {
                            console.error(`stderr: ${data}`);
                        });
                    }


                })
            })
        }
    })
})


app.post('/comment', (req, res) => {
    var insertQuery = "INSERT INTO comments (maHocPhan, uploader, content) VALUES (?,?,?)";
    con.query(insertQuery, [req.body["code"], req.body["userName"], req.body["content"]], function(err, result) {
        if (err) throw err;
    });
    res.status(200).send("success");
});

app.post('/login', (req, res) => {
    var logintQuery = "SELECT * FROM users where name = ? AND password = ? ";
    con.query(logintQuery, [req.body["username"], req.body["password"]], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.send("invalid")
        } else {
            res.status(200).send("loginOK");
        }
    });
})

app.get('/login', (req, res) => {
    res.render('admin', {});
})

app.post('/all', (req, res) => {
    var searchAllQuery = "SELECT maHocPhan as name, count(*) as y FROM searchcount where dateTime >= ? and dateTime <= ? group by maHocPhan";
    con.query(searchAllQuery, [req.body["startDate"], req.body["endDate"]], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.send("noresult")
        } else {
            res.send(result);
        }
    });
})

app.post('/each', (req, res) => {
    var searchEachQuery = 'SET sql_mode = \'STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION\'; SELECT substring(dateTime,1,10) as date ,  count(*) as count  FROM searchcount  where maHocPhan = ? and dateTime >= ? and dateTime <= ? group by  DAY(dateTime)'
    con.query(searchEachQuery, [req.body["code"], req.body["startDate"], req.body["endDate"]], function(err, result) {
        if (err) throw err;
        if (result.length === 0) {
            res.send("noresult")
        } else {
            res.send(result[1]);


        }
    });
})


// port where app is served
app.listen(70, () => {
    console.log('The web server has started on port 70');
});