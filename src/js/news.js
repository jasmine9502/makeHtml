import { ipcRenderer, remote } from 'electron';
const { dialog } = remote;
var pageID;
var pageCreator;
var pageCount;
var title;
var date;
var nowDate;
var comeFrom;
var writer;
const path = require('path');
const fs = require("fs");
const Datastore = require('nedb');
//添加图片集合
var images = [];
//段落集合
var paragraph = [];
var viceTitle = [];
var imgTitle = [];
//提取颜色集合
var textColor = [];
var bgColor = [];
var viceTitleColor = [];
//上传图片
var dataRequire = {};
//待去除前缀图片
var base64Data = [];
var contentRequire;
//增加div数
var newDivNum = 0;
//删除模块的node
var delNode;
//选择标题位置
var titleColor;
var locValue;
var viceLoc = [];
//选择字体
var titleFont;
var getData;
var imageUp = [];
var finalData = {};
var formatData = {};
var lastFormatData = {};
var globalSet = {};
var chooseFormat;
var isShowLogo;
var isCreate = 0;
//标题位置选择
function chooseLoc() {
    var radio = document.getElementsByName("loc");
    locValue = null;   //  selectvalue为radio中选中的值
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            locValue = radio[i].value;
            break;
        }
    }
}

function chooseViceLoc(locID) {
    var radio = document.getElementsByName(locID);
    var num = locID.substring(8, locID.length);
    viceLoc[(num - 1)] = "left";   //  selectvalue为radio中选中的值
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            viceLoc[(num - 1)] = radio[i].value;
            break;
        }
    }
}

//标题字体选择
function chooseFont() {
    var radio = document.getElementsByName("font");
    titleFont = null;   //  selectvalue为radio中选中的值
    for (var i = 0; i < radio.length; i++) {
        if (radio[i].checked == true) {
            titleFont = radio[i].value;
            break;
        }
    }
}
//提交信息实现预览效果
function submitInfo() {
    images = [];
    title = document.getElementById("title").value;
    writer = document.getElementById("writer").value;
    comeFrom = document.getElementById("comeFrom").value;
    if (!title) {
        alert("请填写标题");
    } else {
        for (var i = 0; i <= newDivNum; i++) {
            var temp = "paragraph0" + (i + 1);
            var viceTemp = "viceTitle0" + (i + 1);
            var contentShow = "showContent0" + (i + 1);
            var img = "showImg0" + (i + 1);
            var imgDivTemp = "showImgDiv0" + (i + 1);
            var imgTemp = "showImage0" + (i + 1);
            var viceShow = "showViceTitle0" + (i + 1);
            var textColorTemp = "textColor0" + (i + 1);
            var bgTemp = "bgColor0" + (i + 1);
            var viceColorTemp = "viceTitleColor0" + (i + 1);
            var imgTitleTemp = "imgTitle0" + (i + 1);
            var imgTitleShow = "showImgTitle0" + (i + 1);
            var viceLocTemp = "viceLoc0" + (i + 1);
            //动态设置ShowView
            if (i >= 1) {
                var showID = "show0" + i;
                var showRID = "show0" + (i + 1);
                var showImgDivID = "showImgDiv0" + (i + 1);
                var showImgID = "showImage0" + (i + 1);
                var showContentID = "showContent0" + (i + 1);
                var showViceTitleID = "showViceTitle0" + (i + 1);
                var showImgTitleID = "showImgTitle0" + (i + 1);
                var container = document.getElementById(showID);
                var node = container.nextSibling;
                var oDiv = document.createElement('div');
                oDiv.id = showRID;
                var divattr = document.createAttribute("class");
                divattr.value = "show";
                oDiv.setAttributeNode(divattr);
                oDiv.innerHTML = "<p class=\"showViceTitle\" id=" + showViceTitleID + "></p><p class=\"showContent\" id=" + showContentID + "></p><div class='showImageDiv' id=" + showImgDivID + "><img class='showImage' id=" + showImgID + " /></div><p class=\"showImgTitle\" id= " + showImgTitleID + ">";
                container.parentNode.insertBefore(oDiv, node)
                node = oDiv.nextSibling;
            } else {
                var checkNode = document.getElementById("showReal");
                checkNode.innerHTML = "<h1 id=\"showTitle\"></h1><p class=\"showDate\" id=\"showDate\"><span><a href=\"http://mp.weixin.qq.com/s?__biz=MzA5NjA2NDU3Nw==&amp;mid=201256384&amp;idx=1&amp;sn=0857211a423506c6c7ade66c8fde0f51#rd\" style=\"color: #607fa6;font-size: 1em;\" target=\"_blank\">    徕卡测量系统</a></span></p><div class=\"show\" id=\"show01\"><p class=\"showViceTitle\" id=\"showViceTitle01\"></p><p class=\"showContent\" id=\"showContent01\"></p><div class=\"showImageDiv\" id=\"showImgDiv01\"><img class=\"showImage\" id=\"showImage01\" /></div><p class=\"showImgTitle\" id= \"showImgTitle01\"></p></div>";
            }
            document.getElementById("showTitle").innerHTML = title;
            chooseLoc();
            chooseFont();
            chooseViceLoc(viceLocTemp);
            document.getElementById("showTitle").style.textAlign = locValue;
            titleColor = document.getElementById("titleColor").value;
            document.getElementById("showTitle").style.color = titleColor;
            document.getElementById("showTitle").style.fontFamily = titleFont;
            if (writer) {
                document.getElementsByClassName("writer")[0].innerHTML = "撰稿人: " + writer;
            }
            viceTitle[i] = document.getElementById(viceTemp).value;
            paragraph[i] = document.getElementById(temp).value;
            imgTitle[i] = document.getElementById(imgTitleTemp).value;
            textColor[i] = document.getElementById(textColorTemp).value;
            bgColor[i] = document.getElementById(bgTemp).value;
            viceTitleColor[i] = document.getElementById(viceColorTemp).value;
            images[i] = document.getElementById(img).src;
            document.getElementById(contentShow).innerHTML = marked(paragraph[i]);
            document.getElementById(contentShow).innerHTML = document.getElementById(contentShow).innerHTML.replace(/\[\[(.*?)\]\]/g, '<font color="CD0000">$1</font>');
            document.getElementById(imgTitleShow).innerHTML = imgTitle[i];
            if (document.getElementById(contentShow).getElementsByTagName("p")[0]) {
                console.log(document.getElementById(contentShow).getElementsByTagName("p"));
                document.getElementById(contentShow).getElementsByTagName("p")[0].style.color = textColor[i];
            } else {
            }
            if (!(paragraph[i] == "")) {
                document.getElementById(contentShow).style.backgroundColor = bgColor[i];
                if (!(bgColor[i] == "#ffffff")) {
                    document.getElementById(contentShow).style.padding = "5px";
                }
            }
            document.getElementById(viceShow).style.color = viceTitleColor[i];
            document.getElementById(viceShow).innerHTML = viceTitle[i];
            if (viceLoc[i] == "center") {
                document.getElementById(viceShow).style.fontSize = "19px";
            }
            document.getElementById(viceShow).style.textAlign = viceLoc[i];
            if (images[i] == 'https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png' || images[i] == undefined) {
                document.getElementById(imgDivTemp).style.display = "none";
            } else {
                document.getElementById(imgDivTemp).style.display = "block";
                document.getElementById(imgTemp).src = images[i];
            }
        }
        //判断是否现实底部logo
        if (document.getElementById("checkbox").checked) {
            isShowLogo = "true";
            document.getElementById("bottom").style.display = "block";
        } else {
            isShowLogo = "false";
            document.getElementById("bottom").style.display = "none";
        }
        if (comeFrom == "") {
            if (document.getElementById("date").value == "") {
                date = getNowFormatDate("-");
                if (document.getElementById("dateCheckbox").checked) {
                    document.getElementById("showDate").innerHTML = date + "<span><a href=\"http://mp.weixin.qq.com/s?__biz=MzA5NjA2NDU3Nw==&amp;mid=201256384&amp;idx=1&amp;sn=0857211a423506c6c7ade66c8fde0f51#rd\" style=\"color: #607fa6;font-size: 1em;\" target=\"_blank\">    徕卡测量系统</a></span>";
                } else {
                    document.getElementById("showDate").innerHTML = "<span><a href=\"http://mp.weixin.qq.com/s?__biz=MzA5NjA2NDU3Nw==&amp;mid=201256384&amp;idx=1&amp;sn=0857211a423506c6c7ade66c8fde0f51#rd\" style=\"color: #607fa6;font-size: 1em;\" target=\"_blank\">徕卡测量系统</a></span>";
                }
            } else {
                date = document.getElementById("date").value;
                document.getElementById("showDate").innerHTML = date + "<span><a href=\"http://mp.weixin.qq.com/s?__biz=MzA5NjA2NDU3Nw==&amp;mid=201256384&amp;idx=1&amp;sn=0857211a423506c6c7ade66c8fde0f51#rd\" style=\"color: #607fa6;font-size: 1em;\" target=\"_blank\">    徕卡测量系统</a></span>";
            }
        } else {
            if (document.getElementById("date").value == "") {
                date = getNowFormatDate("-");
                if (document.getElementById("dateCheckbox").checked) {
                    document.getElementById("showDate").innerHTML = date + "<span style=\"color: #607fa6;font-size: 1em;\">    " + comeFrom + "</span>";
                } else {
                    document.getElementById("showDate").innerHTML = "<span style=\"color: #607fa6;font-size: 1em;\">" + comeFrom + "</span>";
                }
            } else {
                date = document.getElementById("date").value;
                document.getElementById("showDate").innerHTML = date + "<span style=\"color: #607fa6;font-size: 1em;\">    " + comeFrom + "</span>";
            }
        }
    }
    console.log(paragraph);
    var imgHave = 0;
    dataRequire = {};
    var require = [];
    for (var i = 0; i <= newDivNum; i++) {
        if (images[i].indexOf("https") != -1) {
        } else {
            imgHave++;
            var address = images[i];
            base64Data[i] = splitStr(address);
            require.push(base64Data[i]);
        }
    }
    dataRequire["Num"] = imgHave;
    for (var j = 0; j < require.length; j++) {
        dataRequire["Image" + (j + 1)] = require[j];
    }
    formatData["id"] = 1;
    formatData["newDivNum"] = newDivNum;
    formatData["viceTitleColor"] = viceTitleColor;
    formatData["textColor"] = textColor;
    formatData["bgColor"] = bgColor;
    formatData["viceLoc"] = viceLoc;
    //console.log(formatData);
}

/*图片预览实现*/
function showImage(obj, imgID) {
    var file = obj.files[0];
    if (window.FileReader) {
        var fr = new FileReader();
        fr.onloadend = function (e) {
            dealImage(e.target.result, { quality: 0.6 }, function (base) {
                document.getElementById(imgID).src = base;
                // console.log("压缩后：" + base.length / 1024 + "kb");
            })
        };
        fr.readAsDataURL(file);
    }
}
//压缩图片
function dealImage(path, obj, callback) {
    var img = new Image();
    img.src = path;
    img.onload = function () {
        var that = this;
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.6;
        //生成canvas
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        // 创建属性节点
        var anw = document.createAttribute("width");
        anw.nodeValue = w;
        var anh = document.createAttribute("height");
        anh.nodeValue = h;
        canvas.setAttributeNode(anw);
        canvas.setAttributeNode(anh);
        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        var base64 = canvas.toDataURL('image/jpeg', quality);
        callback(base64);
    }
}
//切割图片base64编码
function splitStr(str) {
    var result;
    var arr = str.split(',');
    arr.shift();
    result = arr.join();
    result = result.replace(/\/\//g, "1234567");
    return result;
}
//取消图片
function call(imgID, inputID) {
    document.getElementById(imgID).src = "https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png";
    document.getElementById(inputID).value = "";
}

/*增加填充div*/
function addContainer() {
    newDivNum++;
    var TColor = "#333333";
    var BColor = "#ffffff";
    var VColor = "#333333";
    if (chooseFormat == "global") {
        TColor = globalSet["TColor"];
        BColor = globalSet["BColor"];
        VColor = globalSet["viceColor"];
    }
    else if (chooseFormat == "last") {
        if (lastFormatData["newDivNum"] >= newDivNum) {
            TColor = lastFormatData["textColor"][newDivNum];
            BColor = lastFormatData["bgColor"][newDivNum];
            VColor = lastFormatData["viceTitleColor"][newDivNum];
        }
    }
    var textName = "paragraph0" + (newDivNum + 1);
    var imgName = "showImg0" + (newDivNum + 1);
    var viceID = "viceTitle0" + (newDivNum + 1);
    var contentID = "content0" + newDivNum;
    var contentRID = "content0" + (newDivNum + 1);
    var TColorID = "textColor0" + (newDivNum + 1);
    var BColorID = "bgColor0" + (newDivNum + 1);
    var VColorID = "viceTitleColor0" + (newDivNum + 1);
    var imgTitle = "imgTitle0" + (newDivNum + 1);
    var inputID = "readImg0" + (newDivNum + 1);
    var viceLoc = "viceLoc0" + (newDivNum + 1);
    var container = document.getElementById(contentID);
    var node = container.nextSibling;
    var oDiv = document.createElement('div');
    var divattr = document.createAttribute("class");
    divattr.value = "content";
    oDiv.setAttributeNode(divattr);
    oDiv.id = contentRID;
    var inner = "<div class='contentText'><p>副标题(按需求填写):</p><textarea class=\"viceTitle\" type=\"text\" id=" + viceID + " name=\"viceTitle\" cols='60' rows='1'></textarea><div class=\"pickVTColor\"><p>点击输入框选取颜色(副标题)</p><input type=\"text\" class=\"pickTextColor\" id=" + VColorID + " value=" + VColor + " size=\"8\"><p>请选择副标题靠左，居中(默认靠左)</p><input type=\"radio\" name=" + viceLoc + " value=\"left\">靠左   <input type=\"radio\" name=" + viceLoc + " value=\"center\">居中</div><textarea class=\"contentInput\" id=" + textName + " name=" + textName + " cols='60' rows='15'></textarea></div><div class='contentImg'><p>图片:<span style=\"font-size: 10px\">(希望只显示图片则不用填写文字)</span></p>";
    inner += "<input type=\"file\" id=" + inputID + " onchange=\"showImage(this,'" + imgName + "')\" accept=\"image/*\" value=\"选择图片\" /><input type=\"button\" value=\"取消该图片\" onclick=\"call('" + imgName + "','" + inputID + "');\" /><img id=" + imgName + " style=\"border: solid #afafaf 0.8px\"src = \"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png\"/><p>图片小标题(图片下方)</p><textarea class=\"imgTitle\" type=\"text\" id=" + imgTitle + " name=" + imgTitle + " cols=\"30\" rows=\"1\"></textarea>";
    inner += "<div class=\"pickColor\"><div class=\"pickColorL\"><p><span>文字颜色</span></p><input type=\"text\" class=\"pickTextColor\" id=" + TColorID + " value=" + TColor + " size=\"8\"></div><div class=\"pickColorR\"><p><span>背景颜色</span></p><input type=\"text\" class=\"pickTextColor\" id=" + BColorID + " value=" + BColor + " size=\"8\"></div></div></div><button class=\"delete\" id=\"delete\" onclick='deleteContainer(this)'>删除该段落</button>";
    oDiv.innerHTML = inner;
    container.parentNode.insertBefore(oDiv, node)
    node = oDiv.nextSibling;
    $(function () {
        $("#" + TColorID).minicolors();
        $("#" + BColorID).minicolors();
        $("#" + VColorID).minicolors();
    });
}
/*删除填充div*/
function deleteContainer(test) {
    var node = test.parentNode.nextSibling;
    delNode = test;
    if (node.id == undefined) {
        test.parentNode.parentNode.removeChild(test.parentNode);
        newDivNum--;
    } else {
        var containerNum = node.id.substring(8, node.id.length);
        test.parentNode.parentNode.removeChild(test.parentNode);
        for (var i = containerNum; i <= newDivNum + 1; i++) {
            var changeImg = "showImg0" + (i - 1);
            var changeTColor = "textColor0" + (i - 1);
            var changeBColor = "bgColor0" + (i - 1);
            var changeVColor = "viceTitleColor0" + (i - 1);
            var changeInputID = "readImg0" + (i - 1);
            var changeID = "content0" + i;
            var change = document.getElementById(changeID);
            var shouldChangeID = "content0" + (i - 1);
            change.id = shouldChangeID;
            var img = document.getElementById(shouldChangeID).getElementsByTagName("img");
            img[0].id = changeImg;
            var inputs = document.getElementById(shouldChangeID).getElementsByTagName("input");
            inputs[0].id = changeVColor;
            inputs[1].name = "viceLoc0" + (i - 1);
            inputs[2].name = "viceLoc0" + (i - 1);
            inputs[3].outerHTML = "<input type=\"file\" id=\"readImg\" onchange=\"showImage(this,'" + changeImg + "')\" accept=\"image/*\" value=\"选择图片\" />";
            inputs[4].outerHTML = "<input type=\"button\" value=\"取消该图片\" onclick=\"call('" + changeImg + "','" + changeInputID + "');\" />"
            inputs[5].id = changeTColor;
            inputs[6].id = changeBColor;
            var textareas = document.getElementById(shouldChangeID).getElementsByTagName("textarea");
            textareas[0].id = "viceTitle0" + (i - 1);
            textareas[1].id = "paragraph0" + (i - 1);
            textareas[2].id = "imgTitle0" + (i - 1);
            $(function () {
                $("#" + changeTColor).minicolors();
                $("#" + changeBColor).minicolors();
                $("#" + changeVColor).minicolors();
            });
        }
        newDivNum--;
    }
}

function doGet() {
    imageUp = images;
    for (var i = 0; i < imageUp.length; i++) {
        if (imageUp[i].indexOf("https") != -1) {
        } else {
            imageUp[i] = getData.shift();
        }
    }
    console.log(imageUp);
}

function upLoadData() {
    $.ajax({
        url: 'https://lsservice.leicacloud.com:1201/api/webpage/image',
        type: 'POST',
        data: JSON.stringify(dataRequire),
        dataType: "json",
        contentType: "application/json;utf-8",
        success: function (data, status) {
            if (status == 'success') {
                getData = data;
                doGet();
                createFile();
            }
        },
        error: function (data, status, e) {
            if (status == 'error') {
                alert("error");
            }
        }
    });
}

function createFile() {
    if(!nowDate){
        nowDate = getNowFormatDate("");
    }
    console.log(nowDate);
    if(pageID){
        isCreate =1;
        finalData["id"] = pageID;
    }else {
        finalData["id"] = pageCreator + nowDate + "news" + pageCount;
    }
    isCreate++;
    finalData["newDivNum"] = newDivNum;
    finalData["viceTitle"] = viceTitle;
    finalData["paragraph"] = paragraph;
    finalData["images"] = imageUp;
    finalData["imgTitle"] = imgTitle;
    finalData["titleColor"] = '\"' + titleColor + '\"';
    finalData["titleLoc"] = '\"' + locValue + '\"';
    finalData["titleFont"] = '\"' + titleFont + '\"';
    finalData["viceTitleColor"] = viceTitleColor;
    finalData["textColor"] = textColor;
    finalData["bgColor"] = bgColor;
    finalData["viceLoc"] = viceLoc;
    finalData["showLogo"] = '\"' + isShowLogo + '\"';
    finalData["title"] = '\"' + title + '\"';
    finalData["showDate"] = '\"' + date + '\"';
    finalData["writer"] = '\"' + writer + '\"';
    finalData["comeFrom"] = '\"' +comeFrom+ '\"';
    console.log(finalData);
    if (isCreate == 1) {
        let data_db;
        data_db = new Datastore({
            filename: 'data.db',
            autoload: true
        });
        var newChange = {};
        var change = parseInt(pageCount);
        change++;
        newChange["newsNum"] = change;
        console.log(newChange);
        data_db.update({ id: "user" }, { $set: newChange }, {},
            function (err, numAffected, affectedDocuments, upsert) { });
        var update = {};
        update["account"] = pageCreator;
        console.log(update);
        $.ajax({
            url: 'https://lsservice.leicacloud.com:1201/api/html/addNewsNum',
            type: 'POST',
            data: JSON.stringify(update),
            dataType: "json",
            contentType: "application/json;utf-8",
            success: function (data, status) {
                if (data["Status"] == 200) {
                    console.log("已更新新闻数量");
                }
            },
            error: function (data, status, e) {
                if (status == 'error') {
                    console.log(e);
                    alert(data);
                }
            }
        });
    }
    if (title) {
        $.ajax({
            url: 'https://lsservice.leicacloud.com:1201///api/webpage/news',
            type: 'POST',
            data: JSON.stringify(finalData),
            dataType: "json",
            contentType: "application/json;utf-8",
            success: function (data, status) {
                if (status == 'success') {
                    if (data.status == 0) {
                        alert("已生成网页");
                        console.log(data["Url"]);
                        document.getElementsByClassName("result")[0].innerHTML = "网址为：" + data["Url"];
                        if (confirm("你需要保存次样式吗")) {
                            saveFormat();
                        }
                    }
                }
            },
            error: function (data, status, e) {
                if (status == 'error') {
                    alert("error");
                }
            }
        });
        var testData = {};
        if (pageID) {
            testData["id"] = pageID;
        } else {
            testData["id"] = pageCreator + nowDate + "news" + pageCount;
        }
        testData["account"] = pageCreator;
        var viceTColorsend = "";
        for (var i = 0; i < viceTitleColor.length; i++) {
            viceTColorsend = viceTColorsend + "$" + viceTitleColor[i];
        }
        var paragraphsend = "";
        for (var i = 0; i < paragraph.length; i++) {
            paragraphsend = paragraphsend + "$" + paragraph[i];
        }
        var viceTitleSend = "";
        for (var i = 0; i < viceTitle.length; i++) {
            viceTitleSend = viceTitleSend + "$" + viceTitle[i];
        }
        var imageSend = "";
        for (var i = 0; i < imageUp.length; i++) {
            imageSend = imageSend + "$" + imageUp[i];
        }
        var imgTitleSend = "";
        for (var i = 0; i < imgTitle.length; i++) {
            imgTitleSend = imgTitleSend + "$" + imgTitle[i];
        }
        var viceLocSend = "";
        for (var i = 0; i < viceLoc.length; i++) {
            viceLocSend = viceLocSend + "$" + viceLoc[i];
        }
        var textColorSend = "";
        for (var i = 0; i < textColor.length; i++) {
            textColorSend = textColorSend + "$" + textColor[i];
        }
        var bgColorSend = "";
        for (var i = 0; i < bgColor.length; i++) {
            bgColorSend = bgColorSend + "$" + bgColor[i];
        }
        testData["title"] = title;
        testData["newDivNum"] = newDivNum;
        testData["paragraph"] = paragraphsend;
        testData["viceTitle"] = viceTitleSend;
        testData["viceTitleColor"] = viceTColorsend;
        testData["images"] = imageSend;
        testData["imgTitle"] = imgTitleSend;
        testData["titleColor"] = '' + titleColor + '';
        testData["titleLoc"] = '' + locValue + '';
        testData["titleFont"] = '' + titleFont + '';
        testData["textColor"] = textColorSend;
        testData["bgColor"] = bgColorSend;
        testData["viceLoc"] = viceLocSend;
        testData["showLogo"] = isShowLogo;
        testData["reviewStatus"] = "wait";
        testData["showDate"] = date;
        testData["writer"] = writer;
        testData["comeFrom"] = comeFrom;
        console.log(testData);
        $.ajax({
            url: 'https://lsservice.leicacloud.com:1201/api/html/newNews',
            type: 'POST',
            data: JSON.stringify(testData),
            dataType: "json",
            contentType: "application/json;utf-8",
            success: function (data, status) {
                if (data["Status"] == 200) {
                    console.log(data["Msg"]);
                } else {
                    alert(data["Msg"]);
                }
            },
            error: function (data, status, e) {
                if (status == 'error') {
                    alert("error");
                }
            }
        });
    } else {
        alert("请先填充内容");
    }

}

function saveFormat() {
    const dataBase_path = path.join(__dirname, '../data.db');
    console.log(dataBase_path);
    let data_db;
    fs.exists(dataBase_path, function (exists) {
        if (exists) {
            data_db = new Datastore({
                filename: 'data.db',
                autoload: true
            });
            if (formatData["id"]) {
                data_db.find({ id: 1 }, function (err, docs) {
                    if (docs[0]) {
                        console.log(formatData);
                        data_db.update({ id: 1 }, { $set: formatData }, {},
                            function (err, numAffected, affectedDocuments, upsert) {
                            });
                    } else {
                        data_db.insert(formatData, function (err, new_doc) {
                            "use strict";
                            console.log(err, new_doc);
                        });
                    }
                });
            }
        } else {
            let data_db = new Datastore({
                filename: 'data.db',
                autoload: true
            });
            data_db.insert(formatData, function (err, new_doc) {
                "use strict";
                console.log(err, new_doc);
            });
        }
    });
}

function backButton() {
    if (formatData["id"]) {
        if (confirm("你需要保存次样式吗")) {
            saveFormat();
            window.history.back(-1);
        } else {
            window.history.back(-1);
        }
    } else {
        window.history.back(-1);
    }
}

//获取日期
function getNowFormatDate(seperator1) {
    var date = new Date();
    //var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
}
//加载上次保存样式
function loadLastFormat() {
    if (confirm("你需要使用上次样式吗")) {
        chooseFormat = "last";
        const dataBase_path = path.join(__dirname, '../data.db');
        let data_db;
        fs.exists(dataBase_path, function (exists) {
            if (exists) {
                data_db = new Datastore({
                    filename: 'data.db',
                    autoload: true
                });
                data_db.find({ id: 1 }, function (err, docs) {
                    if (docs[docs.length - 1]) {
                        lastFormatData = docs[docs.length - 1];
                        console.log(lastFormatData);
                        if (lastFormatData["newDivNum"] >= 0) {
                            for (var i = 0; i <= newDivNum; i++) {
                                if (lastFormatData["newDivNum"] >= i) {
                                    var contentID = "content0" + (i + 1);
                                    var LocID = "viceLoc0" + (i + 1);
                                    document.getElementById(contentID).getElementsByTagName("input")[0].value = lastFormatData["viceTitleColor"][i];
                                    document.getElementById(contentID).getElementsByTagName("span")[1].style = "background-color:" + lastFormatData["viceTitleColor"][i];
                                    document.getElementById(contentID).getElementsByTagName("input")[5].value = lastFormatData["textColor"][i];
                                    document.getElementById(contentID).getElementsByTagName("span")[5].style = "background-color:" + lastFormatData["textColor"][i];
                                    document.getElementById(contentID).getElementsByTagName("input")[6].value = lastFormatData["bgColor"][i];
                                    document.getElementById(contentID).getElementsByTagName("span")[8].style = "background-color:" + lastFormatData["bgColor"][i];
                                    if (lastFormatData["viceLoc"][i] == "center") {
                                        document.getElementsByName(LocID)[1].checked = "checked";
                                    } else {
                                        document.getElementsByName(LocID)[0].checked = "checked";
                                    }
                                }
                            }
                        }
                    } else {
                        alert("样式不存在");
                    }
                });
            } else {
                alert("样式不存在");
            }
        });
    } else { }
}

/*function askSaveIfNeed() {
    if (formatData["id"]) {
        const response = dialog.showMessageBox(remote.getCurrentWindow(), {
            message: '你要保存本次样式吗?',
            type: 'question',
            buttons: ['Yes', 'No']
        });
        if (response == 0) saveFormat(); //点击Yes按钮后保存当前样式
    }
}

ipcRenderer.on('action', (event, arg) => {
    switch (arg) {
        case 'exiting':
            askSaveIfNeed();
            ipcRenderer.sendSync('reqaction', 'exit');
            break;
    }
});*/
//显示全局样式设置框
function showGlobal() {
    console.log(document.getElementsByClassName("showSet"));
    document.getElementsByClassName("showSet")[0].style.display = "block";
}
//设置全局样式
function setGlobal() {
    chooseFormat = "global";
    globalSet["TitleColor"] = document.getElementById("TitleColor").value;
    globalSet["viceColor"] = document.getElementById("viceTColor").value;
    globalSet["TColor"] = document.getElementById("TColor").value;
    globalSet["BColor"] = document.getElementById("BColor").value;
    document.getElementById("titleColor").value = globalSet["TitleColor"];
    document.getElementById("aa").getElementsByTagName("span")[2].style = "background-color:" + globalSet["TitleColor"];
    for (var i = 0; i <= newDivNum; i++) {
        var contentID = "content0" + (i + 1);
        document.getElementById(contentID).getElementsByTagName("input")[0].value = globalSet["viceColor"];
        document.getElementById(contentID).getElementsByTagName("span")[1].style = "background-color:" + globalSet["viceColor"];
        document.getElementById(contentID).getElementsByTagName("input")[5].value = globalSet["TColor"];
        document.getElementById(contentID).getElementsByTagName("span")[5].style = "background-color:" + globalSet["TColor"];
        document.getElementById(contentID).getElementsByTagName("input")[6].value = globalSet["BColor"];
        document.getElementById(contentID).getElementsByTagName("span")[8].style = "background-color:" + globalSet["BColor"];
    }
    console.log(globalSet);
    document.getElementsByClassName("showSet")[0].style.display = "none";
}

function setClose() {
    document.getElementsByClassName("showSet")[0].style.display = "none";
}

window.onload = function () {
    let data_db;
    data_db = new Datastore({
        filename: 'data.db',
        autoload: true
    });
    data_db.find({ id: "user" }, function (err, docs) {
        if (docs[0]) {
            pageCreator = docs[0]["name"];
        } else {
        }
    });
    var locurl = window.location.href; //获得页面的URL
    var startplace = locurl.indexOf("?"); //得到网址与参数分隔符的位置，一般都用“？”分隔
    if (startplace != -1) { //判断网址中有没有参数
        var params = locurl.substr(startplace + 1); //获得参数字符串，从分隔符位置+1处开始获取   结果为id=xxx;
        if (params.substr(3).length > 3) {
            pageID = params.substr(3);
            pageCreator = pageID.substring(0, 11);
            var sendinfo = {}
            sendinfo["id"] = pageID;
            $.ajax({
                url: 'https://lsservice.leicacloud.com:1201/api/html/getSingleNews',
                type: 'POST',
                data: JSON.stringify(sendinfo),
                dataType: "json",
                contentType: "application/json;utf-8",
                success: function (data) {
                    console.log(data);
                    newDivNum = data.newDivNum;
                    document.getElementById("title").value = data.title;
                    if(data.titleFont == "STHeiti"||data.titleFont =="simhei") {
                        document.getElementsByClassName("title")[0].getElementsByTagName("input")[8].checked="checked";
                    } else if (data.titleFont == "STSong"||data.titleFont =="simsun") {
                        document.getElementsByClassName("title")[0].getElementsByTagName("input")[9].checked="checked";
                    }
                    if(data.titleLoc == "center") {
                        document.getElementsByClassName("title")[0].getElementsByTagName("input")[5].checked="checked";
                    } else if (data.titleLoc == "right") {
                        document.getElementsByClassName("title")[0].getElementsByTagName("input")[6].checked="checked";
                    }
                    document.getElementById("comeFrom").value = data.comeFrom;
                    document.getElementById("date").value = data.showDate;
                    if(data.showLogo=="true"){
                        document.getElementById("checkbox").checked = data.showLogo;
                    }
                    document.getElementById("writer").value = data.writer;
                    document.getElementById("paragraph01").value = data.paragraph[0];
                    document.getElementById("viceTitle01").value = data.viceTitle[0];
                    document.getElementById("showImg01").src = data.images[0];
                    document.getElementById("textColor01").value = data.textColor[0];
                    document.getElementById("bgColor01").value = data.bgColor[0];
                    document.getElementById("viceTitleColor01").value = data.textColor[0];
                    document.getElementById("imgTitle01").value = data.imgTitle[0];
                    document.getElementById("content01").getElementsByTagName("input")[0].value = data.viceTitleColor[0];
                    document.getElementById("content01").getElementsByTagName("span")[1].style = "background-color:" + data.viceTitleColor[0];
                    document.getElementById("content01").getElementsByTagName("input")[5].value = data.textColor[0];
                    document.getElementById("content01").getElementsByTagName("span")[5].style = "background-color:" + data.textColor[0];
                    document.getElementById("content01").getElementsByTagName("input")[6].value = data.bgColor[0];
                    document.getElementById("content01").getElementsByTagName("span")[8].style = "background-color:" + data.bgColor[0];
                    if (data.viceLoc[0] == "center") {
                        document.getElementsByName("viceLoc01")[1].checked = "checked";
                    } else {
                        document.getElementsByName("viceLoc01")[0].checked = "checked";
                    }
                    for (var i = 1; i <= data.newDivNum; i++) {
                        var TColor = "#333333";
                        var BColor = "#ffffff";
                        var VColor = "#333333";
                        var textName = "paragraph0" + (i + 1);
                        var imgName = "showImg0" + (i + 1);
                        var viceID = "viceTitle0" + (i + 1);
                        var contentID = "content0" + i;
                        var contentRID = "content0" + (i + 1);
                        var TColorID = "textColor0" + (i + 1);
                        var BColorID = "bgColor0" + (i + 1);
                        var VColorID = "viceTitleColor0" + (i + 1);
                        var imgTitle = "imgTitle0" + (i + 1);
                        var inputID = "readImg0" + (i + 1);
                        var viceLoc = "viceLoc0" + (i + 1);
                        var container = document.getElementById(contentID);
                        var node = container.nextSibling;
                        var oDiv = document.createElement('div');
                        var divattr = document.createAttribute("class");
                        divattr.value = "content";
                        oDiv.setAttributeNode(divattr);
                        oDiv.id = contentRID;
                        var inner = "<div class='contentText'><p>副标题(按需求填写):</p><textarea class=\"viceTitle\" type=\"text\" id=" + viceID + " name=\"viceTitle\" cols='60' rows='1'></textarea><div class=\"pickVTColor\"><p>点击输入框选取颜色(副标题)</p><input type=\"text\" class=\"pickTextColor\" id=" + VColorID + " value=" + VColor + " size=\"8\"><p>请选择副标题靠左，居中(默认靠左)</p><input type=\"radio\" name=" + viceLoc + " value=\"left\">靠左   <input type=\"radio\" name=" + viceLoc + " value=\"center\">居中</div><textarea class=\"contentInput\" id=" + textName + " name=" + textName + " cols='60' rows='15'></textarea></div><div class='contentImg'><p>图片:<span style=\"font-size: 10px\">(希望只显示图片则不用填写文字)</span></p>";
                        inner += "<input type=\"file\" id=" + inputID + " onchange=\"showImage(this,'" + imgName + "')\" accept=\"image/*\" value=\"选择图片\" /><input type=\"button\" value=\"取消该图片\" onclick=\"call('" + imgName + "','" + inputID + "');\" /><img id=" + imgName + " style=\"border: solid #afafaf 0.8px\"src = \"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png\"/><p>图片小标题(图片下方)</p><textarea class=\"imgTitle\" type=\"text\" id=" + imgTitle + " name=" + imgTitle + " cols=\"30\" rows=\"1\"></textarea>";
                        inner += "<div class=\"pickColor\"><div class=\"pickColorL\"><p><span>文字颜色</span></p><input type=\"text\" class=\"pickTextColor\" id=" + TColorID + " value=" + TColor + " size=\"8\"></div><div class=\"pickColorR\"><p><span>背景颜色</span></p><input type=\"text\" class=\"pickTextColor\" id=" + BColorID + " value=" + BColor + " size=\"8\"></div></div></div><button class=\"delete\" id=\"delete\" onclick='deleteContainer(this)'>删除该段落</button>";
                        oDiv.innerHTML = inner;
                        container.parentNode.insertBefore(oDiv, node)
                        node = oDiv.nextSibling;
                        $(function () {
                            $("#" + TColorID).minicolors();
                            $("#" + BColorID).minicolors();
                            $("#" + VColorID).minicolors();
                        });
                        document.getElementById(textName).value = data.paragraph[i];
                        document.getElementById(viceID).value = data.viceTitle[i];
                        document.getElementById(imgName).src = data.images[i];
                        document.getElementById(imgTitle).value = data.imgTitle[i];
                        document.getElementById(TColorID).value = data.textColor[i];
                        document.getElementById(BColorID).value = data.bgColor[i];
                        document.getElementById(VColorID).value = data.viceTitleColor[i];
                        document.getElementById(contentRID).getElementsByTagName("input")[0].value = data.viceTitleColor[i];
                        document.getElementById(contentRID).getElementsByTagName("span")[1].style = "background-color:" + data.viceTitleColor[i];
                        document.getElementById(contentRID).getElementsByTagName("input")[5].value = data.textColor[i];
                        document.getElementById(contentRID).getElementsByTagName("span")[5].style = "background-color:" + data.textColor[i];
                        document.getElementById(contentRID).getElementsByTagName("input")[6].value = data.bgColor[i];
                        document.getElementById(contentRID).getElementsByTagName("span")[8].style = "background-color:" + data.bgColor[i];
                        if (data.viceLoc[i] == "center") {
                            document.getElementsByName(viceLoc)[1].checked = "checked";
                        } else {
                            document.getElementsByName(viceLoc)[0].checked = "checked";
                        }
                    }
                },
                error: function (data, status, e) {
                    if (status == 'error') {
                        alert("error");
                    }
                }
            });
        } else {
            pageCount = params.substr(3);
        }
    }
}


