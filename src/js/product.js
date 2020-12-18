var title;
var productInfo;
var pageID;
var pageCreator;
var pageCount;
var coverImg;
var nowDate;
var imgSrcArray = {};
var List = [];
//添加图片集合
var images = [];
//段落集合
var paragraph = [];
var viceTitle = [];
//上传图片
var dataRequire = {};
//待去除前缀图片
var base64Data = [];
var contentRequire;
//增加div数
var newDivNum = 0;
//删除模块的node
var delNode;
//文字是否有背景
var check = [];
var getData;
var imageUp = [];
var finalData = {};
var isCreate =0;
var getData = {};
const Datastore = require('nedb');
var isAlphaBackground = false;
/*图片预览实现*/
function showImage(obj, imgID) {
    var file = obj.files[0];
    if (window.FileReader) {
        var fr = new FileReader();
        fr.onloadend = function (e) {
             dealImage(e.target.result,{quality:0.6},function(base){
                 document.getElementById(imgID).src = base;　　　})
            //document.getElementById(imgID).src = e.target.result;
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
        // 默认按比例压缩
        var w = that.width,
            h = that.height,
            scale = w / h;
        w = obj.width || w;
        h = obj.height || (w / scale);
        var quality = 0.6;  // 默认图片质量为0.7
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
        var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        for(var i = 0; i < imageData.data.length; i += 4) {
            // 当该像素是透明的，则设置成白色
            if(imageData.data[i + 3] == 0) {
                imageData.data[i] = 255;
                imageData.data[i + 1] = 255;
                imageData.data[i + 2] = 255;
                imageData.data[i + 3] = 255; 
            }
        }
        context.putImageData(imageData, 0, 0);

        ctx.drawImage(that, 0, 0, w, h);
        // 图像质量
        if (obj.quality && obj.quality <= 1 && obj.quality > 0) {
            quality = obj.quality;
        }
        var base64 = canvas.toDataURL('image/jpeg', quality);
        // 回调函数返回base64的值
        callback(base64);
    }
}

function call(imgID,inputID) {
    document.getElementById(imgID).src = "https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png";
    document.getElementById(inputID).value = "";
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

/*增加填充div*/
function addContainer() {
    newDivNum++;
    var textName = "paragraph0" + (newDivNum + 1);
    var listName = "list0" + (newDivNum + 1);
    var imgName = "showImg0" + (newDivNum + 1);
    var contentID = "content0" + newDivNum;
    var contentRID = "content0" + (newDivNum + 1);
    var viceID = "viceTitle0" + (newDivNum + 1);
    var checkbox = "checkbox0" +(newDivNum +1);
    var inputID = "readImg0" +(newDivNum +1);
    var container = document.getElementById(contentID);
    var node = container.nextSibling;
    var oDiv = document.createElement('div');
    var divattr = document.createAttribute("class");
    divattr.value = "content";
    oDiv.setAttributeNode(divattr);
    oDiv.id = contentRID;
    var inner = "<div class='contentText'><p class=\"normal\">副标题(按需求填写)</p><textarea class=\"viceTitle\" type=\"text\" id=" + viceID + " cols='60' rows='1'></textarea><p class=\"normal\">若想显示列表请选择</p><input type=\"radio\" name="+listName+" value=\".\">●   <input type=\"radio\" name="+listName+" value=\"。\">○   <input type=\"radio\" name="+listName+" value=\"1\">1.  <input type=\"radio\" name="+listName+" value=\"none\">不按列表显示<br><textarea class=\"contentInput\" id=" + textName + " cols='60' rows='15'></textarea><br><input style=\"vertical-align:middle;margin-left:25px\"  id="+checkbox+" type=\"checkbox\" name=\"checkbox\" />文字添加黄色背景</div><div class='contentImg'><p>图片:<span style=\"font-size: 10px\">(希望只显示图片则不用填写文字)</span></p>";
    inner += "<input type=\"file\" id="+inputID+" onchange=\"showImage(this,'" + imgName + "')\" accept=\"image/*\" value=\"选择图片\" /><input type=\"button\" value=\"取消该图片\" onclick=\"call('" + imgName + "','" + inputID + "');\" /><img id=" + imgName + " style=\"border: solid #afafaf 0.8px\"src = \"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png\"/></div><button class=\"delete\" id=\"delete\" onclick='deleteContainer(this)'>删除该段落</button>";
    oDiv.innerHTML = inner;
    container.parentNode.insertBefore(oDiv, node)
    node = oDiv.nextSibling;
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
            var changeID = "content0" + i;
            var change = document.getElementById(changeID);
            var shouldChangeID = "content0" + (i - 1);
            change.id = shouldChangeID;
            var img = document.getElementById(shouldChangeID).getElementsByTagName("img");
            var idname = "showImg0" + (i - 1);
            img[0].id = idname;
            var inputs = document.getElementById(shouldChangeID).getElementsByTagName("input");
            var inputID = "readImg0" +(i -1);
            inputs[0].name = "list0"+(i-1);
            inputs[1].name = "list0"+(i-1);
            inputs[2].name = "list0"+(i-1);
            inputs[3].name = "list0"+(i-1);
            inputs[4].id = "checkbox0" +(i-1);
            inputs[5].outerHTML = "<input type=\"file\" id=\"readImg\" onchange=\"showImage(this,'" + idname + "')\" accept=\"image/*\" value=\"选择图片\" />";
            inputs[6].outerHTML = "<input type=\"button\" value=\"取消该图片\" onclick=\"call('" + idname + "','" + inputID + "');\" />"
            var textareas = document.getElementById(shouldChangeID).getElementsByTagName("textarea");
            textareas[0].id = "viceTitle0" + (i - 1);
            textareas[1].id = "paragraph0" + (i - 1);
        }
        newDivNum--;
    }
}

//提交信息实现预览效果
function submitInfo() {
    images = [];
    title = document.getElementById("title").value;
    productInfo = document.getElementById("productInfo").value;
    productInfo = productInfo.replace(/[\r\n]/g,"");  
    //console.log(productInfo.match(/red(\S*)red/g));
    coverImg = document.getElementById("coverImg").src;
    chooseList();
    if (!title) {
        alert("请填写标题");
    } else {
        for (var i = 0; i <= newDivNum; i++) {
            var temp = "paragraph0" + (i + 1);
            var contentShow = "showContent0" + (i + 1);
            var img = "showImg0" + (i + 1);
            var imgDivTemp = "showImgDiv0" + (i + 1);
            var imgTemp = "showImage0" + (i + 1);
            var viceTemp = "viceTitle0" + (i + 1);
            var viceShow = "showViceTitle0" + (i + 1);
            var showViceB = "showViceBorder0"+ (i + 1);
            var checkbox = "checkbox0" + (i+1);
            //动态设置ShowView
            if (i >= 1) {
                var showID = "show0" + i;
                var showRID = "show0" + (i + 1);
                var showImgDivID = "showImgDiv0" + (i + 1);
                var showImgID = "showImage0" + (i + 1);
                var showContentID = "showContent0" + (i + 1);
                var showViceTitleID = "showViceTitle0" + (i + 1);
                var container = document.getElementById(showID);
                var node = container.nextSibling;
                var oDiv = document.createElement('div');
                var divattr = document.createAttribute("class");
                divattr.value = "show";
                oDiv.setAttributeNode(divattr);
                oDiv.id = showRID;
                oDiv.innerHTML = "<div class=\"showViceBorder\"id= "+showViceB+"><p class=\"showViceTitle\" id="+showViceTitleID+"></p></div><p class=\"showContent\" id=" + showContentID + "></p><div class='showImageDiv' id=" + showImgDivID + "><img class='showImage' id=" + showImgID + " /></div>";
                container.parentNode.insertBefore(oDiv, node);
                node = oDiv.nextSibling;
            } else {
                var checkNode = document.getElementById("showModule");
                checkNode.innerHTML = "<div class=\"show\" id=\"show01\"><div class=\"showViceBorder\" id= \"showViceBorder01\"><p class=\"showViceTitle\" id=\"showViceTitle01\"></p></div><p class=\"showContent\" id=\"showContent01\"></p><div class=\"showImageDiv\" id=\"showImgDiv01\"><img class=\"showImage\" id=\"showImage01\" /></div>";
            }
            document.getElementById("showTitle").innerHTML = title;
            document.getElementById("showProductInfo").innerHTML =marked(productInfo); 
            document.getElementById("showProductInfo").innerHTML = document.getElementById("showProductInfo").innerHTML.replace(/\[\[(.*?)\]\]/g, '<font color="CD0000">$1</font>');
            if (productInfo) {
                document.getElementById("infoBorder1").style.display = "block";
                document.getElementById("infoBorder2").style.display = "block";
            } else {
                document.getElementById("infoBorder1").style.display = "none";
                document.getElementById("infoBorder2").style.display = "none";
            }
            if (coverImg == "https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png" ||coverImg ==undefined) {
                document.getElementById("showCoverImg").style.display = "none";
            } else {
                document.getElementById("showCoverImg").style.display = "block";
                document.getElementById("showCoverImg").src = coverImg;
            }
            paragraph[i] = document.getElementById(temp).value;
            images[i] = document.getElementById(img).src;
            viceTitle[i] = document.getElementById(viceTemp).value;
            if (document.getElementById(checkbox).checked) {
                check[i] = "true";
            } else {
                check[i] = "false";
            }
            document.getElementById(viceShow).innerHTML = viceTitle[i];
            if (!(List[i]=="none"||List[i]==undefined)) {
                var toList = paragraph[i].split('\n');
                for (var num=0; num<toList.length;num++) {
                    if (List[i]=="."){
                        toList[num] = "● "+toList[num];
                    } else if (List[i]=="。"){
                        toList[num] = "○ "+toList[num];
                    }else if (List[i]=="1"){
                        toList[num] = (num+1)+" . "+toList[num];
                    }
                }
                paragraph[i] = toList.join('\n');
                console.log(toList);
            } 
            document.getElementById(contentShow).innerHTML = marked(paragraph[i]);
            document.getElementById(contentShow).innerHTML = document.getElementById(contentShow).innerHTML.replace(/\[\[(.*?)\]\]/g, '<font color="#CD0000">$1</font>');
            if (document.getElementById(checkbox).checked) {
                if (paragraph[i]) {
                    document.getElementById(contentShow).style.backgroundColor = "rgb(254, 251, 245)";
                    document.getElementById(contentShow).style.border = "solid";
                    document.getElementById(contentShow).style.borderWidth = "1px";
                    document.getElementById(contentShow).style.padding = "1em 1em 0 1em";
                    document.getElementById(contentShow).style.borderColor = "rgb(235, 230, 217)";
                } else {
                    document.getElementById(contentShow).style.backgroundColor = "white";
                    document.getElementById(contentShow).style.border = "none";
                }
            } else {
                document.getElementById(contentShow).style.backgroundColor = "white";
                document.getElementById(contentShow).style.border = "none";
            }
            
            if (images[i] == "https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png" || images[i] == undefined) {
                document.getElementById(imgDivTemp).style.display = "none";
            } else {
                document.getElementById(imgDivTemp).style.display = "block";
                document.getElementById(imgTemp).src = images[i];
            }
            if (viceTitle[i] == '' || viceTitle[i] == undefined) {
                document.getElementById(showViceB).style.borderColor = "white";
            } else {
                document.getElementById(showViceB).style.borderColor = "rgb(197, 36, 36)";
            }
        }
    }
    images.unshift(coverImg);
    var imgHave =0;
    var require =[];
    dataRequire = {};
    for (var i = 0; i <= (newDivNum+1); i++) {
        if (images[i].indexOf("https") !=-1) {
        } else {
            imgHave++;
            var address = images[i];
            base64Data[i] = splitStr(address);
            require.push(base64Data[i]);
        }
    }
    dataRequire ["Num"] =imgHave;
    for(var j = 0 ;j<require.length;j++) {
         dataRequire["Image" + (j+1)] = require[j]; 
    }
}

function doGet() {
    imageUp = images;
    for (var i=0;i<imageUp.length;i++) {
        if (imageUp[i].indexOf("https") != -1) {
        } else {
            imageUp[i] = getData.shift();
        }
    }
}

function upLoadData() {
    if(title){
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
    } else {
        alert("请先填充内容");
    }
}

function createFile() {
    if(!nowDate){
        nowDate = getNowFormatDate();
    }
    if(pageID){
        isCreate =1;
        finalData["id"] = pageID;
    }else {
        finalData["id"] = pageCreator + nowDate + "products" + pageCount;
    }
    isCreate++;
    finalData["newDivNum"] = newDivNum;
    finalData["checkbox"] = check;
    finalData["viceTitle"] = viceTitle;
    finalData["paragraph"] = paragraph;
    finalData["images"]= imageUp;
    finalData["title"] = '\"' + title + '\"';
    finalData["productInfo"] = '\"'+productInfo+'\"';
    console.log(finalData);
    if(isCreate==1){
        let data_db;
        data_db = new Datastore({
            filename: 'data.db',
            autoload: true
        });
        var newChange = {};
        var change = parseInt(pageCount);
        change++;
        newChange["productNum"] = change;
        console.log(newChange);
        data_db.update({ id: "user" }, { $set: newChange }, {},
            function (err, numAffected, affectedDocuments, upsert) {
            });
            var update = {};
            update["account"] = pageCreator;
            console.log(update);
            $.ajax({
                url: 'https://lsservice.leicacloud.com:1201/api/html/addProductNum',
                type: 'POST',
                data: JSON.stringify(update),
                dataType: "json",
                contentType: "application/json;utf-8",
                success: function (data, status) {
                    if (data["Status"] == 200) {
                       console.log("已更新产品界面数量");
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
    $.ajax({
        url: 'https://lsservice.leicacloud.com:1201//api/webpage/production',
        type: 'POST',
        data: JSON.stringify(finalData),
        dataType: "json",
        contentType: "application/json;utf-8",
        success: function (data, status) {
            if (status == 'success') {
                if (data.status == 0) {
                    console.log(data);
                    alert("已生成网页");
                    document.getElementsByClassName("result")[0].innerHTML = "网址为："+data["Url"];
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
        testData["id"] = pageCreator+nowDate+"products"+pageCount;
    }
    testData["account"] = pageCreator;
    var listType="";
    for(var i=0;i<List.length;i++) {
        listType =listType+"$"+  List[i];
    }
    var paragraphsend ="";
    for(var i=0;i<paragraph.length;i++) {
        paragraphsend =paragraphsend+ "$"+ paragraph[i];
    }
    var viceTitleSend="";
    for(var i=0;i<viceTitle.length;i++) {
        viceTitleSend =viceTitleSend+ "$"+ viceTitle[i];
    }
    var imageSend="";
    for(var i=0;i<imageUp.length;i++) {
        imageSend =imageSend+"$"+ imageUp[i];
    }
    var checkboxSend="";
    for(var i=0;i<check.length;i++) {
        checkboxSend =checkboxSend+ "$"+ check[i];
    }
    testData["newDivNum"] = newDivNum;
    testData["listType"] = listType;
    testData["paragraph"] = paragraphsend;
    testData["reviewStatus"] = "wait";
    testData["viceTitle"] = viceTitleSend;
    testData["images"]= imageSend;
    testData["title"] = title;
    testData["productInfo"] = productInfo;
    testData["checkbox"] = checkboxSend;
    console.log(testData);
    //处理返回数据
   /* var arr = testData["paragraph"].split('$');
    arr.pop();
    console.log(arr);*/
    
    $.ajax({
        url: 'https://lsservice.leicacloud.com:1201/api/html/newProducts',
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
}

function chooseList() {
    for (var j = 0; j <= newDivNum; j++) {
        var listName = "list0" + (j + 1);
        var radio = document.getElementsByName(listName);
        for (var i = 0; i < radio.length; i++) {
            if (radio[i].checked == true) {
                List[j] = radio[i].value;
                break;
            }
        }
    }
    for (var i=0;i<List.length;i++){
        if(List[i]==undefined) {
            List[i] = "none";
        }
    }
    console.log(List);
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
            console.log(pageCreator);
        } else {
        }
    });
    var locurl = window.location.href; //获得页面的URL
    var startplace = locurl.indexOf("?"); //得到网址与参数分隔符的位置，一般都用“？”分隔
    if (startplace != -1) { //判断网址中有没有参数
        var params = locurl.substr(startplace + 1); //获得参数字符串，从分隔符位置+1处开始获取   结果为id=xxx;
        if(params.substr(3).length>3) {
            pageID = params.substr(3);
            pageCreator = pageID.substring(0, 11);
            console.log(pageCreator);
            var sendinfo = {}
            sendinfo["id"] = pageID;
                $.ajax({
                    url: 'https://lsservice.leicacloud.com:1201/api/html/getSingleProducts',
                    type: 'POST',
                    data: JSON.stringify(sendinfo),
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    success: function (data) {
                        console.log(data);
                        newDivNum = data.newDivNum;
                        document.getElementById("title").value = data.title;
                        document.getElementById("productInfo").value = data.productInfo;
                        document.getElementById("coverImg").src = data.images[0];
                        var para;
                        if(data.productList[0]==".") {
                            document.getElementsByName("list01")[0].checked = true;
                            para = clearString("● ",data.paragraph[0]);
                        } else if (data.productList[0]=="。") {
                            document.getElementsByName("list01")[1].checked =true;
                            para = clearString("○ ",data.paragraph[0]);
                        } else if (data.productList[0]=="1") {
                            document.getElementsByName("list01")[2].checked =true;
                            para = clearString(". ",data.paragraph[0]);
                        } else {
                            document.getElementsByName("list01")[3].checked =true;
                            para = data.paragraph[0];
                        } 
                        document.getElementById("paragraph01").value = para;
                        document.getElementById("viceTitle01").value = data.viceTitle[0];
                        document.getElementById("showImg01").src = data.images[1];
                        if(data.checkbox[0]=="true") {
                            document.getElementById("checkbox01").checked = 1;
                        }
                        for(var i=1;i<=data.newDivNum;i++) {
                            var textName = "paragraph0" + (i + 1);
                            var listName = "list0" + (i + 1);
                            var imgName = "showImg0" + (i + 1);
                            var contentID = "content0" + i;
                            var contentRID = "content0" + (i + 1);
                            var viceID = "viceTitle0" + (i + 1);
                            var checkbox = "checkbox0" +(i +1);
                            var inputID = "readImg0" +(i +1);
                            var container = document.getElementById(contentID);
                            var node = container.nextSibling;
                            var oDiv = document.createElement('div');
                            var divattr = document.createAttribute("class");
                            divattr.value = "content";
                            oDiv.setAttributeNode(divattr);
                            oDiv.id = contentRID;
                            var inner = "<div class='contentText'><p class=\"normal\">副标题(按需求填写)</p><textarea class=\"viceTitle\" type=\"text\" id=" + viceID + " cols='60' rows='1'></textarea><p class=\"normal\">若想显示列表请选择</p><input type=\"radio\" name="+listName+" value=\".\">●   <input type=\"radio\" name="+listName+" value=\"。\">○   <input type=\"radio\" name="+listName+" value=\"1\">1.  <input type=\"radio\" name="+listName+" value=\"none\">不按列表显示<br><textarea class=\"contentInput\" id=" + textName + " cols='60' rows='15'></textarea><br><input style=\"vertical-align:middle;margin-left:25px\"  id="+checkbox+" type=\"checkbox\" name=\"checkbox\" />文字添加黄色背景</div><div class='contentImg'><p>图片:<span style=\"font-size: 10px\">(希望只显示图片则不用填写文字)</span></p>";
                            inner += "<input type=\"file\" id="+inputID+" onchange=\"showImage(this,'" + imgName + "')\" accept=\"image/*\" value=\"选择图片\" /><input type=\"button\" value=\"取消该图片\" onclick=\"call('" + imgName + "','" + inputID + "');\" /><img id=" + imgName + " style=\"border: solid #afafaf 0.8px\"src = \"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png\"/></div><button class=\"delete\" id=\"delete\" onclick='deleteContainer(this)'>删除该段落</button>";
                            oDiv.innerHTML = inner;
                            container.parentNode.insertBefore(oDiv, node)
                            node = oDiv.nextSibling;
                            var para ="";
                            if(data.productList[i]==".") {
                                document.getElementsByName(listName)[0].checked = true;
                                para = clearString("● ",data.paragraph[i]);
                            } else if (data.productList[i]=="。") {
                                document.getElementsByName(listName)[1].checked =true;
                                para = clearString("○ ",data.paragraph[i]);
                            } else if (data.productList[i]=="1") {
                                document.getElementsByName(listName)[2].checked =true;
                                para = clearString(". ",data.paragraph[i]);
                            } else {
                                document.getElementsByName(listName)[3].checked =true;
                                para = data.paragraph[i];
                            } 
                            document.getElementById(textName).value = para;
                            document.getElementById(viceID).value = data.viceTitle[i];
                            document.getElementById(imgName).src = data.images[i+1];
                            if(data.checkbox[i]=="true") {
                                document.getElementById(checkbox).checked = 1;
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
            pageCount = params.substr(3);//作用是只拿到1，从第三个位置开始截取
        }
    }
}

function getNowFormatDate() {
    var date = new Date();
    var seperator1 = "";
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

function clearString(a,string) {
    var reg = new RegExp(a,"g");
    var a = string.replace(reg,"");
    return a;
}