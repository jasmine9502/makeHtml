const Datastore = require('nedb');
var per = [
    { ID: '暂无信息', creator: '暂无信息',operation:'暂无可执行操作' },
];

function refresh() {
    var li =document.getElementsByTagName("li");
    if(li[0].className=="current") {
        LoadPersonalNewsTable();
    } else {
        LoadPersonalProductsTable();
    }
}

function LoadPersonalNewsTable() {
    var account;
    let data_db;
        data_db = new Datastore({
            filename: 'data.db',
            autoload: true
        });
        data_db.find({ id: "user" }, function (err, docs) {
            if (docs[0]) {
                account = docs[0]["name"];
                var sendinfo = {}
                sendinfo["account"] = account;
                $.ajax({
                    url: 'https://lsservice.leicacloud.com:1201/api/html/getPersonalNews',
                    type: 'POST',
                    data: JSON.stringify(sendinfo),
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    success: function (data) {
                        console.log(data);
                        if (data.length > 0) {
                            var tbody = document.getElementById('tbody');
                            var childs = tbody.childNodes;
                            var count = childs.length;
                            for (var i = count - 1; i >= 0; i--) {//清空列表
                                tbody.removeChild(childs[i]);
                            }
                            for (var i = 0; i < data.length; i++) { //遍历一下json数据 
                                var trow = getDataRow(data[i]); //定义一个方法,返回tr数据 
                                tbody.appendChild(trow);
                            }
                        } else {
                            var tbody = document.getElementById('tbody');
                            var childs = tbody.childNodes;
                            var count = childs.length;
                            for (var i = count - 1; i >= 0; i--) {//清空列表
                                tbody.removeChild(childs[i]);
                            }
                            for (var i = 0; i < per.length; i++) { //遍历一下json数据 
                                var trow = getDataRow(per[i]); //定义一个方法,返回tr数据 
                                tbody.appendChild(trow);
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
            }
        });
    
}

function LoadPersonalProductsTable() {
    var account;
    let data_db;
        data_db = new Datastore({
            filename: 'data.db',
            autoload: true
        });
        data_db.find({ id: "user" }, function (err, docs) {
            if (docs[0]) {
                account = docs[0]["name"];
                var sendinfo = {}
                sendinfo["account"] = account;
                $.ajax({
                    url: 'https://lsservice.leicacloud.com:1201/api/html/getPersonalProducts',
                    type: 'POST',
                    data: JSON.stringify(sendinfo),
                    dataType: "json",
                    contentType: "application/json;utf-8",
                    success: function (data) {
                        console.log(data);
                        if (data.length > 0) {
                            var tbody = document.getElementById('tbody');
                            var childs = tbody.childNodes;
                            var count = childs.length;
                            for (var i = count - 1; i >= 0; i--) {//清空列表
                                tbody.removeChild(childs[i]);
                            }
                            for (var i = 0; i < data.length; i++) { //遍历一下json数据 
                                var trow = getDataRow(data[i]); //定义一个方法,返回tr数据 
                                tbody.appendChild(trow);
                            }
                        } else {
                            var tbody = document.getElementById('tbody');
                            var childs = tbody.childNodes;
                            var count = childs.length;
                            for (var i = count - 1; i >= 0; i--) {//清空列表
                                tbody.removeChild(childs[i]);
                            }
                            for (var i = 0; i < per.length; i++) { //遍历一下json数据 
                                var trow = getDataRow(per[i]); //定义一个方法,返回tr数据 
                                tbody.appendChild(trow);
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
            }
        });
}

function getDataRow(h) {
    var row = document.createElement('tr'); //创建行 
    var nameCell = document.createElement('td');//创建第1列name 
    nameCell.innerHTML = h.ID;
    nameCell.setAttribute('style', 'width:222px');
    row.appendChild(nameCell);
    var creatorCell = document.createElement('td');//创建第2列creater
    creatorCell.innerHTML = h.creator;
    creatorCell.setAttribute('style', 'width:92px');
    row.appendChild(creatorCell);
    //到这里，json中的数据已经添加到表格中，下面为每行末尾添加操作按钮 
    var reviewCell = document.createElement('td');//创建第3列，操作列 
    reviewCell.setAttribute('style', 'width:214px');
    row.appendChild(reviewCell);
    var btnLoad = document.createElement('input'); //创建一个input控件 
    btnLoad.setAttribute('type', 'button'); //type="button" 
    btnLoad.setAttribute('value', '预览');
    btnLoad.onclick = function () {
        //清除原有元素
        var childs = document.getElementById("showPage").childNodes;
        var count = childs.length;
        for (var i = 0; i < count; i++) {
            document.getElementById("showPage").removeChild(childs[0]);
        }
        //产品填充页面
        if (h.ID.indexOf("product") != -1) {
            var container = document.getElementById("showPage");
            var topDiv = document.createElement('div');
            var divattr = document.createAttribute("class");
            divattr.value = "topLogo";
            topDiv.setAttributeNode(divattr);
            topDiv.innerHTML = "<img src=\"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/7.png\">";
            container.appendChild(topDiv);
            var img = document.createElement('img');
            img.id = "showCoverImg";
            var imgattr = document.createAttribute("class");
            imgattr.value = "showCoverImg";
            img.setAttributeNode(imgattr);
            container.appendChild(img);
            var h1 = document.createElement('h1');
            h1.id = "showTitle";
            container.appendChild(h1);
            var info = document.createElement("div");
            info.id = "infoBorder1";
            var infoattr = document.createAttribute("class");
            infoattr.value = "infoBorder1";
            info.setAttributeNode(infoattr);
            container.appendChild(info);
            info.innerHTML = "<div class=\"infoBorder2\" id=\"infoBorder2\"><p id=\"showProductInfo\" class=\"showProductInfo\"></p></div>";
            var inner = document.createElement("div");
            inner.id = "showModule";
            var innerattr = document.createAttribute("class");
            innerattr.value = "showModule";
            inner.setAttributeNode(innerattr);
            container.appendChild(inner);
            inner.innerHTML = "<div class=\"show\" id=\"show01\"><div class=\"showViceBorder\" id=\"showViceBorder01\"><p class=\"showViceTitle\" id=\"showViceTitle01\"></p></div><p class=\"showContent\" id=\"showContent01\"></p></div>"
            makeProduct(h);
        }
        else if (h.ID.indexOf("news") != -1) {
            var container = document.getElementById("showPage");
            var topDiv = document.createElement('div');
            var divattr = document.createAttribute("class");
            topDiv.id="showReal";
            divattr.value = "showReal";
            topDiv.setAttributeNode(divattr);
            topDiv.innerHTML = " <h1 class=\"newsh1\" id=\"showTitle\"></h1><p class=\"showDate\" id=\"showDate\">2018-2-23<span style=\"color: #607fa6;font-size: 1em;\"> 徕卡测量系统</span></p><div class=\"shown\" id=\"show01\"><p class=\"showViceTitlen\" id=\"showViceTitle01\"></p><p id=\"showContent01\"></p><div class=\"showImageDivn\" id=\"showImgDiv01\"><img class=\"showImagen\" id=\"showImage01\" /></div><p class=\"showImgTitle\" id=\"showImgTitle01\"></p></div>";
            container.appendChild(topDiv);
            var info = document.createElement("div");
            info.id = "bottom";
            var infoattr = document.createAttribute("class");
            infoattr.value = "bottom";
            info.setAttributeNode(infoattr);
            container.appendChild(info);
            info.innerHTML = "<div class=\"logo\"><img class=\"logoImage\" src=\"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/6.png\" id=\"logoImage\" /></div><div class=\"info\"><div class=\"info-top\"><div class=\"littleLeft\"><img class=\"littleLogo\" src=\"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/5.png \"></div><div class=\"littleRight\"><p style=\"font-size:0.9em;margin-left:-1px;text-align:left;line-height: 15px;padding: 0 5px;margin-bottom: 1px;\">点击徕卡测量系统官网查看更多信息</p><a href=\"https://www.leica-geosystems.com.cn\">www.leica-geosystems.com.cn</a></div></div><div class=\"info-bottom\"><div class=\"littleLeft\"><img class=\"littleLogo\" src=\"https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/4.png \"></div><div class=\"littleRight\"><p style=\"font-size:0.9em;margin-left:-1px;text-align:left;line-height: 15px;padding: 0 5px;margin-bottom: 1px;\">点击徕卡AppStore查看在线销售商品</p><a href=\"http://www.leica-geosystems.com.cn/shopping/\">http://www.leica-geosystems.com.cn/shopping/</a></div></div></div>";
            var writer = document.createElement("p");
            var writerattr = document.createAttribute("class");
            writerattr.value = "writer";
            writer.setAttributeNode(writerattr);
            container.appendChild(writer);
            makeNews(h);
        }
    }
    var btnEdit = document.createElement('input'); //创建一个input控件 
    btnEdit.setAttribute('type', 'button'); //type="button" 
    btnEdit.setAttribute('value', '编辑');
    btnEdit.onclick = function () {//审核操作 
        if (confirm("确定编辑吗？")) {
            if(h.ID.indexOf("news") != -1) {
                window.open("news.html?id="+h.ID,"","width=1300px,height=900px");
            } else {
                window.open("product.html?id="+h.ID,"","width=1300px,height=900px");
            }
        }
    }
    var stateLabel = document.createElement('span'); //创建一个span控件,放审核状态信息 
    if(h.review_status=="pass"){
        stateLabel.innerHTML = "审核通过";
        stateLabel.setAttribute('style', 'color:#64825A;font-weight:bolder;margin-left: 10px;font-size: 13px;');
    } else if (h.review_status=="reject") {
        stateLabel.innerHTML = "审核被拒";
        stateLabel.setAttribute('style', 'color:#DC143C;font-weight:bolder;margin-left: 10px;font-size: 13px;');
    }
    if(h.review_status =="wait"){
        reviewCell.appendChild(btnLoad);
        reviewCell.appendChild(btnEdit); //把审核按钮加入td
    } else if (h.review_status == "pass"||h.review_status=="reject"){
        reviewCell.appendChild(btnLoad);
        reviewCell.appendChild(stateLabel);
    } else {
        reviewCell.innerHTML = h.operation;
    }
    return row; //返回tr数据  
}

function makeProduct(data) {
    var newDivNum = data.newDivNum;
    var checkbox = data.checkbox;
    var viceTitle = data.viceTitle;
    var paragraph = data.paragraph;
    var images = data.images;
    var title = data.title;
    var productInfo = data.productInfo;
    for (var i = 0; i <= newDivNum; i++) {
        var contentShow = "showContent0" + (i + 1);
        var imgDivTemp = "showImgDiv0" + (i + 1);
        var imgTemp = "showImage0" + (i + 1);
        var viceShow = "showViceTitle0" + (i + 1);
        var showViceB = "showViceBorder0" + (i + 1);
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
            oDiv.innerHTML = "<div class=\"showViceBorder\"id= " + showViceB + "><p class=\"showViceTitle\" id=" + showViceTitleID + "></p></div><p class=\"showContent\" id=" + showContentID + "></p><div class='showImageDiv' id=" + showImgDivID + "><img class='showImage' id=" + showImgID + " /></div>";
            container.parentNode.insertBefore(oDiv, node)
            node = oDiv.nextSibling;
        } else {
            var checkNode = document.getElementById("showModule");
            checkNode.innerHTML = "<div class=\"show\" id=\"show01\"><div class=\"showViceBorder\" id= \"showViceBorder01\"><p class=\"showViceTitle\" id=\"showViceTitle01\"></p></div><p class=\"showContent\" id=\"showContent01\"></p><div class=\"showImageDiv\" id=\"showImgDiv01\"><img class=\"showImage\" id=\"showImage01\" /></div>";
        }
        document.getElementById("showTitle").innerHTML = title;
        document.getElementById("showProductInfo").innerHTML = marked(productInfo);
        document.getElementById("showProductInfo").innerHTML = document.getElementById("showProductInfo").innerHTML.replace(/\[\[(.*?)\]\]/g, '<font color="CD0000">$1</font>');
        if (productInfo) {
            document.getElementById("infoBorder1").style.display = "block";
            document.getElementById("infoBorder2").style.display = "block";
        } else {
            document.getElementById("infoBorder1").style.display = "none";
            document.getElementById("infoBorder2").style.display = "none";
        }
        if (images[0] == "https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png") {
            document.getElementById("showCoverImg").style.display = "none";
        } else {
            document.getElementById("showCoverImg").style.display = "block";
            document.getElementById("showCoverImg").src = images[0];
        }
        if (checkbox[i] == "true") {
            if (paragraph[i]) {
                document.getElementById(contentShow).style.backgroundColor = "rgb(254, 251, 245)";
                document.getElementById(contentShow).style.border = "solid";
                document.getElementById(contentShow).style.borderWidth = "1px";
                document.getElementById(contentShow).style.borderColor = "rgb(235, 230, 217)";
                document.getElementById(contentShow).style.padding = "1em 1em 0 1em";
            } else {
                document.getElementById(contentShow).style.backgroundColor = "white";
                document.getElementById(contentShow).style.border = "none";
            }
        } else {
            document.getElementById(contentShow).style.backgroundColor = "white";
            document.getElementById(contentShow).style.border = "none";
        }
        document.getElementById(viceShow).innerHTML = viceTitle[i];
        document.getElementById(contentShow).innerHTML = marked(paragraph[i]);
        document.getElementById(contentShow).innerHTML = document.getElementById(contentShow).innerHTML.replace(/\[\[(.*?)\]\]/g, '<font color="#CD0000">$1</font>');
        if (images[(i + 1)] == 'https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png' || images[(i + 1)] == undefined) {
            document.getElementById(imgDivTemp).style.display = "none";
        } else {
            document.getElementById(imgDivTemp).style.display = "block";
            document.getElementById(imgTemp).src = images[(i + 1)];
        }
        if (viceTitle[i] == '' || viceTitle[i] == undefined) {
            document.getElementById(showViceB).style.borderColor = "white";
        } else {
            document.getElementById(showViceB).style.borderColor = "rgb(197, 36, 36)";
        }
    }
}

function makeNews(data) {
    var newDivNum = data.newDivNum;
    var viceTitle = data.viceTitle;
    var paragraph = data.paragraph;
    var images = data.images;
    var imgTitle = data.imgTitle;
    var title = data.title;
    var titleColor = data.titleColor;
    var titleLoc = data.titleLoc;
    var titleFont = data.titleFont;
    var viceTitleColor = data.viceTitleColor;
    var textColor = data.textColor;
    var bgColor = data.bgColor;
    var viceLoc = data.viceLoc;
    var showLogo = data.showLogo;
    var showDate = data.showDate;
    var writer = data.writer;
    var comeFrom = data.comeFrom;
    for (var i = 0; i <= newDivNum; i++) {
        var contentShow = "showContent0" + (i + 1);
        var imgDivTemp = "showImgDiv0" + (i + 1);
        var imgTemp = "showImage0" + (i + 1);
        var viceShow = "showViceTitle0" + (i + 1);
        var showImgTitleID = "showImgTitle0" + (i + 1);
        var imgTitleShow = "showImgTitle0" + (i + 1);
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
            var divattr = document.createAttribute("class");
            divattr.value = "shown";
            oDiv.setAttributeNode(divattr);
            oDiv.id = showRID;
            oDiv.innerHTML = "<p class=\"showViceTitlen\" id=" + showViceTitleID + "></p><p class=\"newsp\" id=" + showContentID + "></p><div class='showImageDivn' id=" + showImgDivID + "><img class='showImagen' id=" + showImgID + " /></div><p class=\"showImgTitle\" id= " + showImgTitleID + ">";
            container.parentNode.insertBefore(oDiv, node)
            node = oDiv.nextSibling;
        } else {
            var checkNode = document.getElementById("showReal");
            checkNode.innerHTML = "<h1 class=\"newsh1\" id=\"showTitle\"></h1><p class=\"showDate\" id=\"showDate\"><span style= color: #607fa6;font-size: 1em;\">    徕卡测量系统</a></span></p><div class=\"shown\" id=\"show01\"><p class=\"showViceTitlen\" id=\"showViceTitle01\"></p><p class=\"newsp\" id=\"showContent01\"></p><div class=\"showImageDivn\" id=\"showImgDiv01\"><img class=\"showImagen\" id=\"showImage01\" /></div><p class=\"showImgTitle\" id= \"showImgTitle01\"></p></div>";
        }
        document.getElementById("showTitle").innerHTML = title;
        document.getElementById("showTitle").style.textAlign = titleLoc;
        document.getElementById("showTitle").style.color = titleColor;
        if(titleFont=="null"){
            document.getElementById("showTitle").style.fontFamily = "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif";
        } else {
            document.getElementById("showTitle").style.fontFamily = titleFont;
        }
        if (!(showDate == "")) {
            if (comeFrom == "") {
                document.getElementById("showDate").innerHTML = showDate + "<span style=\"color: #607fa6;font-size: 1em;\" >    徕卡测量系统</span>";
            } else {
                document.getElementById("showDate").innerHTML = showDate + "<span style=\"color: #607fa6;font-size: 1em;\">    " + comeFrom + "</span>";
            }
        } else {
            if (comeFrom == "") {
                document.getElementById("showDate").innerHTML = "<span style=\"color: #607fa6;font-size: 1em;\">    徕卡测量系统</span>";
            } else {
                document.getElementById("showDate").innerHTML = "<span style=\"color: #607fa6;font-size: 1em;\">" + comeFrom + "</span>";
            }
        }
        document.getElementById(contentShow).innerHTML = marked(paragraph[i]);
        document.getElementById(contentShow).innerHTML = document.getElementById(contentShow).innerHTML.replace(/\[\[(.*?)\]\]/g, '<font color="CD0000">$1</font>');
        if (document.getElementById(contentShow).getElementsByTagName("p")[0]) {
            document.getElementById(contentShow).getElementsByTagName("p")[0].style.color = textColor[i];
        } else {
        }
        document.getElementById(imgTitleShow).innerHTML = imgTitle[i];
        document.getElementById(contentShow).style.backgroundColor = bgColor[i];
        if (!(paragraph[i] == "")) {
            document.getElementById(contentShow).style.backgroundColor = bgColor[i];
            if (!(bgColor[i] == "#ffffff")) {
                document.getElementById(contentShow).style.padding = "5px";
            }
        }
        document.getElementById(viceShow).style.color = viceTitleColor[i];
        document.getElementById(viceShow).innerHTML = viceTitle[i];
        if (viceLoc[i] == "center") {
            document.getElementById(viceShow).style.fontSize = "20px";
        }
        document.getElementById(viceShow).style.textAlign = viceLoc[i];
        if (images[i] == 'https://lsservice.leicacloud.com:1201/WebpageTemplate/Image/8.png' || images[i] == undefined) {
            document.getElementById(imgDivTemp).style.display = "none";
        } else {
            document.getElementById(imgDivTemp).style.display = "block";
            document.getElementById(imgTemp).src = images[i];
        }
        if (showLogo == "true") {
            document.getElementById("bottom").style.display = "block";
        } else {
            document.getElementById("bottom").style.display = "none";
        }
        if (writer) {
            document.getElementsByClassName("writer")[0].innerHTML = "撰稿人: " + writer;
        }
    }
}

$(function(){
    $('#tabs a').click(function(e) {
         e.preventDefault();                
         $('#tabs li').removeClass("current").removeClass("hoverItem");
         $(this).parent().addClass("current");
         $("#content div").removeClass("show");
         $('#' + $(this).attr('title')).addClass('show');
         if($(this).attr('title')=="tab1"){  
            LoadPersonalNewsTable() 
         }
         if($(this).attr('title')=="tab2"){ 
            LoadPersonalProductsTable()
         } 
     });
    $('#tabs a').hover(function(){
       if(!$(this).parent().hasClass("current")){
         $(this).parent().addClass("hoverItem");
       }
    },function(){
       $(this).parent().removeClass("hoverItem");
    });
 });