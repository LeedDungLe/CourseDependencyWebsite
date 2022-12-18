function imageZoom(imgID, resultID) {
    var img, lens, result, cx, cy;
    img = document.getElementById(imgID);
    result = document.getElementById(resultID);
    /*create lens:*/
    lens = document.createElement("DIV");
    lens.setAttribute("class", "img-zoom-lens");
    /*insert lens:*/
    img.parentElement.insertBefore(lens, img);
    /*calculate the ratio between result DIV and lens:*/
    cx = result.offsetWidth / lens.offsetWidth;
    cy = result.offsetHeight / lens.offsetHeight;
    /*set background properties for the result DIV:*/
    result.style.backgroundImage = "url('" + img.src + "')";
    result.style.backgroundSize = (img.width * cx) + "px " + (img.height * cy) + "px";
    /*execute a function when someone moves the cursor over the image, or the lens:*/
    lens.addEventListener("mousemove", moveLens);
    img.addEventListener("mousemove", moveLens);
    /*and also for touch screens:*/
    lens.addEventListener("touchmove", moveLens);
    img.addEventListener("touchmove", moveLens);

    function moveLens(e) {
        var pos, x, y;
        /*prevent any other actions that may occur when moving over the image:*/
        e.preventDefault();
        /*get the cursor's x and y positions:*/
        pos = getCursorPos(e);
        /*calculate the position of the lens:*/
        x = pos.x - (lens.offsetWidth / 2);
        y = pos.y - (lens.offsetHeight / 2);
        /*prevent the lens from being positioned outside the image:*/
        if (x > img.width - lens.offsetWidth) { x = img.width - lens.offsetWidth; }
        if (x < 0) { x = 0; }
        if (y > img.height - lens.offsetHeight) { y = img.height - lens.offsetHeight; }
        if (y < 0) { y = 0; }
        /*set the position of the lens:*/
        lens.style.left = x + "px";
        lens.style.top = y + "px";
        /*display what the lens "sees":*/
        result.style.backgroundPosition = "-" + (x * cx) + "px -" + (y * cy) + "px";
    }

    function getCursorPos(e) {
        var a, x = 0,
            y = 0;
        e = e || window.event;
        /*get the x and y positions of the image:*/
        a = img.getBoundingClientRect();
        /*calculate the cursor's x and y coordinates, relative to the image:*/
        x = e.pageX - a.left;
        y = e.pageY - a.top;
        /*consider any page scrolling:*/
        x = x - window.pageXOffset;
        y = y - window.pageYOffset;
        return { x: x, y: y };
    }
}


$(function() {
    $("#loginBtn").on("click", clickLoginBtn)
    $("#closeLoginFormBtn").on("click", closeLoginForm)
    $("#EnterLoginBtn").on("click", checkLoginInfo)
    $("#sendCommentBtn").on("click", sendComment)
    $("#logoutBtn").on("click", logOut)
    $("#searchAllBtn").on("click", searchAllModuleCode)
    $("#searchEachBtn").on("click", searchEachModuleCode)

    function searchAllModuleCode() {
        startDate = $("#startDateAll").val()
        endDate = $("#endDateAll").val()

        if (startDate > endDate) {
            alert("Khoảng thời gian không hợp lệ")
        } else {
            $.post("http://localhost:70/all", {
                startDate: startDate,
                endDate: endDate
            }, function(data, status) {
                if (data === "noresult") {
                    $("#noresultAll").show()
                    if ($("#pieChartContainer").is(":hidden") == false) {
                        $("#pieChartContainer").hide()
                    }
                } else {
                    if ($("#noresultAll").is(":hidden") == false) {
                        $("#noresultAll").hide()
                    }
                    if ($("#pieChartContainer").is(":hidden")) {
                        $("#pieChartContainer").show()
                    }
                    Highcharts.chart('pieChartContainer', {
                        chart: {
                            plotBackgroundColor: null,
                            plotBorderWidth: null,
                            plotShadow: false,
                            type: 'pie'
                        },
                        title: {
                            text: 'Pie chart show the percentage of module that are searched',
                            align: 'left'
                        },
                        tooltip: {
                            pointFormat: '{series.name}: <b>{point.y}</b>'
                        },
                        accessibility: {
                            point: {
                                valueSuffix: '%'
                            }
                        },
                        plotOptions: {
                            pie: {
                                allowPointSelect: true,
                                cursor: 'pointer',
                                dataLabels: {
                                    enabled: true,
                                    format: '<b>{point.name}</b>: {point.percentage:.1f} %'
                                }
                            }
                        },
                        series: [{
                            name: 'search time',
                            colorByPoint: true,
                            data: data
                        }]
                    });
                }

            });
        }

    }

    function convertStrToDate(stringVar) {
        var parts = stringVar.split('-');
        var thisDate = new Date(parts[0], parts[1] - 1, parts[2]);
        return thisDate
    }

    function dateCalc(startDate, endDate, data) {

        dataDateObj = data
        result = []
        dateArr = []
        for (var i = 0; i < dataDateObj.length; i++) {
            dataDateObj[i].date = convertStrToDate(dataDateObj[i].date)
            dateArr.push(dataDateObj[i].date)
        }

        var loop = new Date(startDate);
        while (loop <= endDate) {
            if (isInArray(dateArr, loop)) {
                for (var i = 0; i < dataDateObj.length; i++) {
                    if (dataDateObj[i].date.getTime() == loop.getTime()) {
                        temp = [];
                        dateUtc = loop.getTime()
                        temp.push(dateUtc)
                        temp.push(dataDateObj[i].count)
                        result.push(temp)
                    }
                }
            } else {
                temp = [];
                dateUtc = loop.getTime()
                temp.push(dateUtc)
                temp.push(0)
                result.push(temp)
            }
            var newDate = loop.setDate(loop.getDate() + 1);
            loop = new Date(newDate);
        }

        return result
    }

    function isInArray(array, value) {
        return !!array.find(item => { return item.getTime() == value.getTime() });
    }

    function searchEachModuleCode() {
        startDate = $("#startDateEach").val()
        endDate = $("#endDateEach").val()
        startDay = startDate.substring(8)
        startMonth = startDate.substring(5, 7)
        startYear = startDate.substring(0, 4)
        code = $("#moduleCodeSearch").val()
        if (startDate > endDate) {
            alert("Khoảng thời gian không hợp lệ")
        } else {
            $.post("http://localhost:70/each", {
                startDate: startDate,
                endDate: endDate,
                code: code
            }, function(data, status) {

                if (data === "noresult") {
                    $("#noresultEach").show()
                    if ($("#lineChartContainer").is(":hidden") == false) {
                        $("#lineChartContainer").hide()
                    }
                } else {
                    if ($("#noresultEach").is(":hidden") == false) {
                        $("#noresultEach").hide()
                    }
                    if ($("#lineChartContainer").is(":hidden")) {
                        $("#lineChartContainer").show()
                    }
                    values = dateCalc(convertStrToDate(startDate), convertStrToDate(endDate), data)
                    Highcharts.chart('lineChartContainer', {
                        title: {
                            text: 'Line chart show the amount of search for ' + code
                        },
                        yAxis: {
                            title: {
                                text: 'Number of search'
                            }
                        },

                        xAxis: {
                            title: {
                                text: 'period of time'
                            },
                            type: 'datetime',
                            dateTimeLabelFormats: { // don't display the year
                                month: '%e. %b',
                                year: '%b'
                            },
                        },

                        legend: {
                            layout: 'vertical',
                            align: 'right',
                            verticalAlign: 'middle'
                        },

                        plotOptions: {
                            series: {
                                label: {
                                    connectorAllowed: false
                                },
                                pointStart: Date.UTC(startYear, startMonth, startDay)
                            }
                        },

                        series: [{
                            name: 'search time',
                            data: values
                        }],

                    });
                }

            });
        }
    }

    function logOut() {
        alert("Thoát đăng nhập")
        window.location = "http://localhost:70";
    }

    function clickLoginBtn() {
        $("#loginForm").show()
        $("#header-container").css("filter", "brightness(60%)")
        $("#body-container").css("filter", "brightness(60%)")
    }

    function closeLoginForm() {
        $("#loginForm").hide()
        $("#header-container").css("filter", "brightness(100%)")
        $("#body-container").css("filter", "brightness(100%)")
    }

    function checkLoginInfo() {
        username = $("#username").val()
        password = $("#password").val()
        $.post("http://localhost:70/login", {
            username: username,
            password: password,
        }, function(data, status) {
            if (data == "invalid") {
                alert("thông tin đăng nhập không chính xác !")
                closeLoginForm()
                $("#username").val("")
                $("#password").val("")
            } else {
                alert("đăng nhập thành công")
                window.location = "http://localhost:70/login";
            }
        });
    }

    function sendComment() {
        moduleCode = $("#moduleCode").html()
        myName = $("#my-name").val()
        content = $("#my-recommend").val()
        $("#my-name").val("")
        $("#my-recommend").val("")
        if (content.trim() == "") {
            alert("Bạn cần nhập vào nội dung")
        } else {
            if (myName.trim() == "") {
                myName = "anonymous"
            }

            $.post("http://localhost:70/comment", {
                code: moduleCode,
                userName: myName,
                content: content
            }, function(data, status) {
                alert("Bình luận thành công")
            });

        }
    }

});