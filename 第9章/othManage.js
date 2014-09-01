/**
 ************************************************************
 * @project 其他常用代码 (Other Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2014-02-24
 * @Copyright : BSD License
 ************************************************************
 */

var othManage = othManage || {};

; (function (_Oth, window, document, undefined) {

    var _W = window,//初始化一些基本数据

        document = _W.document;

    /*
    使用JavaScript代码调用百度地图
    */

    _Oth.baiduMap = null;//百度地图对象

    _Oth.intBaiduMap = function(m){

        this.baiduMap = new BMap.Map(m);            // 创建 BMap 实例

        var point = new BMap.Point(116.404, 39.915);    // 创建点坐标

        this.baiduMap.centerAndZoom(point,15);                     // 初始化地图,设置中心点坐标和地图级别。

        this.baiduMap.enableScrollWheelZoom();                            //启用滚轮放大缩小，默认禁用

        this.baiduMap.disableDragging();                            //禁用地图拖拽
    }

    /*
     让HTML 5能在老版本IE中使用（略）*/

    /*
    Js解析XML数据
    */
    _Oth.parseXML = function(xmlData){//解析函数
        var
            /*
            * 初始化数据
            * */

            xml = null, //默认为null

            domP;
        if ( !xmlData || typeof xmlData !== "string" ) {

            return xml;
        }
        try {

            /*
            * 检测浏览器支持哪种xml解析方法
            * DOMParser 对象解析 XML 文本并返回一个 XML Document 对象,浏览器支持：Firefox, Mozilla, Opera, etc.
            * 目前在全球市场份额中，IE的整体占有率，在降低，因此将这个方法放在第一检测位置
            * */

             if ( window.DOMParser ) {

                domP = new DOMParser();//构建加载对象

                xml = domP.parseFromString( xmlData , "text/xml" );  //执行解析，加载文件

            } else { //IE支持的方法

                xml = new ActiveXObject( "Microsoft.XMLDOM" );  //构建IE浏览器的xml加载对象

                xml.async = "false"; //关闭异步加载，这样可确保在文档完整加载之前，解析器不会继续执行脚本

                xml.loadXML( xmlData ); //执行解析，加载文件
            }
        } catch( e ) {

            xml = "Parse failure";//解析失败，返回提示性信息
        }
        if ( !xml || !xml.documentElement || xml.getElementsByTagName( "parsererror" ).length ) {
            new Error( "损坏的XML: " + xmlData );
        }
        return xml;
    }


    /*
    Js解析JSON数据
    */

    //去除字符串左右两边的空格
    _Oth.trim = function(chars){

        return (chars || "").replace(/^(\s|\u00A0)+|(\s|\u00A0)+$/g, "" );
    }

    _Oth.parseJSON = function(jsonData){//解析函数

        if (typeof jsonData === 'object') {  //判断是否为对象

            return jsonData;//直接返回对象
        }

        if ( window.JSON && window.JSON.parse ) {//如果存在原生的JSON解析API，则使用原生的解析API

            return window.JSON.parse( jsonData );//解析JSON字符
        }

        if ( typeof jsonData === "string" ) {

            jsonData = this.trim( jsonData );//简单的过滤字符，保证前后没有空格

            if ( jsonData ) {//如果不是空字符

                    return ( new Function( "return " + jsonData ) )();  //利用Function的特性，构造 JSON 对象
            }
        }
    }

    /*
     *夸浏览器的Ajax（Js实现无刷新Ajax）
     * */

    _Oth.ajax = function(options){

        if(!options || !options.url){//检测是否存在请求的URL

            return false;//ajax调用失败
        }

        /*
        * 数据初始化
        * */

        options.data = options.data || "";//待传送的值

        options.method = (options.method || "GET").toUpperCase();//传送类型，默认是GET

        options.async = options.async || true;//异步（true）或同步（false）

        /*
         *响应类型,如果请求的是xml文件，则默认类型为xml，否则默认为json，目前支持3种：text、xml、json
         * */
        options.responseType = options.responseType || (/xml/.test(options.url) ? "xml" : "json");

        options.successCall = options.successCall || false;//成功回调

        options.failureCall = options.failureCall || false;//失败回调


        var xmlhttp;

        if (window.XMLHttpRequest)// code for IE7+, Firefox, Chrome, Opera, Safari etc.
        {
            xmlhttp=new XMLHttpRequest();
        }

        else//IE6, IE5
        {
            xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function()
        {
            if (xmlhttp.readyState == 4 && xmlhttp.status == 200) //成功回调
            {
                if(options.successCall){
                    options.successCall(_Oth.getResponseData(xmlhttp, options.responseType));
                }
            }

            if(xmlhttp.readyState == 4 && xmlhttp.status != 200){ //失败回调
                if(options.failureCall){

                    options.failureCall(xmlhttp, xmlhttp.status); //参数1---xml响应对象，参数2---状态码
                }
            }

        }

        xmlhttp.open(options.method, options.url + (options.method == "GET" ? "?" + options.data : ""), options.async);
        if(options.method != "GET"  &&  options.data){
            xmlhttp.send(options.data);
        }else{
            xmlhttp.send();
        }


        return true; //ajax调用成功
    }

    _Oth.getResponseData = function(xmlhttp, type){//解析响应的ajax数据

        var resData = xmlhttp.responseText; //获得字符串形式的响应数据

        if(type === "json"){//因为默认值为json，而且现在json格式的流行度优于其它格式，因此将此放在第一位
            return _Oth.parseJSON(resData);
        }

        if(type === "xml"){
            return xmlhttp.responseXML; //获得 XML 形式的响应数据
        }

        if(type === "text"){
            return resData;
        }
    }

    /*
     使用Ajax轻松加载文件----与上一节合并
     */

    /*跨浏览器的XML读取代码---解决跨域问题*/
    _Oth.getReqxml = function(urlXml, callFun){
        this.ajax({//加载xml文件
            "url" : "../API/reqxml.php",
            "data" : "url=" + urlXml,
            //成功回调
            "successCall" : function(msg){
                if(callFun){
                    callFun({
                        "status":"ok",//请求成功状态码
                        "data":msg //成功的数据
                    });
                }
            },
            //失败回调
            "failureCall" : function(xmlRes, resCode){
                if(callFun){
                    callFun({
                        "status":"error",//请求失败状态码
                        "data":"请求失败"//失败的数据
                    });
                }
            }
        })
    }

    /*获取当前地理坐标*/
    _Oth.geolocation = function(success){  //HTML5 里面引入了geolocation的API可以帮助用户获得浏览器所在的地理位置
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition(

                function(position){//成功回调

                    var coords = position.coords, //取得地理位置信息

                        longitude = coords.longitude, // 经度

                        latitude = coords.latitude; // 维度

                    document.getElementById("geolocationMap").innerHTML = "经度：" + longitude + " 维度：" + latitude;

                    if(success){//成功后的回调
                        success(longitude, latitude);
                    }
                },

                function(error){//失败回调
                    var msg = "";
                    switch (error.code){
                        case 1:
                            msg = "用户拒绝了位置服务";
                            break;
                        case 2:
                            msg = "获取不到位置信息";
                            break;
                        case 3:
                            msg = "获取信息超时错误";
                            break;
                        default :
                            msg = "code：" + error.code + " msg：" + error.message
                    }

                    document.getElementById("geolocationMap").innerHTML = msg;//显示错误信息
                },

                null);//getCurrentPosition(成功回调, 错误回调, 更多选项)
        } else {
            document.getElementById("geolocationMap").innerHTML = "获取当前地理坐标失败";
        }


    }

    /*
    Ajax实现导航
    * */
    _Oth.getAjaxNavigation = function(){
        var createNav = function(data){//创建菜单导航列表

            var nav = document.getElementById("ajaxNavigation"),//获取对象

                navHtml = '<h2>Ajax实现导航</h2>',//菜单字符

                l = data.length,//数据长度

                i = 0,//开始值

                d = null; //遍历的当前值



            for(; i < l ; i++){

                d = data[i];//当前数据

                navHtml += '<div><a href="'+ d.href +'" target="_blank">'+ d.name +'</a></div>';//累加菜单
            }

            nav.innerHTML = navHtml;

        }

        this.ajax({//加载json文件
            "url":"navigation.json",

            "successCall":function(msg){ //成功回调
                createNav(msg.menu);
            },

            "failureCall":function(xmlRes, resCode){//失败回调

            }
        })
    }


    /*类似百度的自动完成功能*/

    _Oth.lexicon = [//默认联想词库
        "美女",
        "美眼美女",
        "QingJs",
        "火影忍者",
        "新浪微博",
        "腾讯微博",
        "QQ控件",
        "中国强",
        "12阿卡丽",
        "888网上",
        "88发财",
        "JavaScript编程",
        "JavaScript教程",
        "JavaScript学习不难",
        "HTML5很好",
        "HTML5学习",
        "英雄联盟"
    ]

    _Oth.thread = -1;//超时填充线程

    _Oth.createAutoHtml = function(autoCompleteList, str){
        var _html = "",
            i,
            lexicon = _Oth.lexicon,
            regStr = null,
            n = 0,
            v = "";

        regStr = new RegExp("^(" + str + ")", "g");//匹配合适的联想词

        for(i in lexicon){//检索匹配词
            if(n >= 3){
                break;//限制最多3个联想词
            }
            v = lexicon[i];



            if(regStr.test(v)){
                n++;
                _html += "<div>" + v + "</div>";
            }
        }

        if(!_html){ //如果不存在联想词，隐藏联想的层

            autoCompleteList.style.display = "none";

            return false;

        }else{//存在联想词，显示联想层

            autoCompleteList.innerHTML = _html;
            autoCompleteList.style.display = "block";
            return true;
        }

    }
    _Oth.autoComplete = function(){
        console.log(_Oth.lexicon)

        var autoComplete = this.getElement("autoComplete"),
             autoCompleteList = null,
             str = ""
             ;

        var createAuto = function(_this){
            clearTimeout(_Oth.thread);  //清除定时

            str = _this.value;

            str = str.replace( /[,|\-|——|!|！|\@|＠|，|/|=|+|\[|\]|.|。|‘|’|%|^|&|(|)|（|）|……|＃|#|￥|\$|？|、|【|】|\"|\"|\'|\'|?|\\|、|\||｜|;|:|：|；|\{|\}|｛|｝|《|》|_|\||＋|<|>|`|~|～|｀|*|×|\"|\"|“|”]/g, ""); //过滤特殊字符,暂时不考虑检索

            if(!str){
                return;
            }
            _Oth.thread = setTimeout(function(){ //如果1秒中停留，则填充词库
                if(str.length > 2 && !_Oth.lexicon[str]){
                    _Oth.lexicon[str] = str; //填充词库
                }
            }, 500)

            autoCompleteList = _Oth.getElement("autoCompleteList");

            /*
             *构建联想词,不存在联想词，不执行事件绑定
             * */
            if(!_Oth.createAutoHtml(autoCompleteList, str)){
                return;
            }


            /*
             *绑定事件
             * */

            var autoCompleteLists = _Oth.getTypeElement(autoCompleteList.childNodes, "div"),
                i = 0,
                l = autoCompleteLists.length;

            for(; i < l ; i++){
                autoCompleteLists[i].onclick = function(){
                    autoComplete.value = _this.innerHTML;
                    autoCompleteList.style.display = "none";
                }
            }
        }

        autoComplete.onkeyup = function(){
            createAuto(this);
        }

        autoComplete.onfocus = function(){
            createAuto(this);
        }


    }
    /*等级星投票效果*/
    _Oth.vote = function(e){
        var votes = _Oth.getTypeElement(e.childNodes, "div"),
            i = 0,
            m = null,
            k = 0,
            n = 0,
            allnum = 5,
            voteed = this.getElement("voteed");
        for(; i < allnum ; i++){

            m = votes[i];

            m.setAttribute("data-num", i);//设置星星的级别

            m.onmouseover = function(){
                k = 0;

                n = parseInt(this.getAttribute("data-num"), 10);//获取当前元素第几个

                voteed.innerHTML = "选取"+ (n+1) + "星级";

                for(; k < allnum; k++){
                    var v = votes[k];
                    v.innerHTML =  parseInt(v.getAttribute("data-num"), 10) <= n ? "★" : "☆";
                }

            }
        }
    }


    /*将数据导出Excel*/
    _Oth.exportExcel = function(tableid){
        if (!!+[1,]){//判断是否为IE
            alert("不是IE浏览器，不支持此方法！");
            return;
        }
        var

                curTbl = this.getElement(tableid),
                /*
                * 如果IE浏览器报错：SCRIPT429: Automation 服务器不能创建对象
                * 打开Internet Explorer “工具”菜单栏中的“选项”一栏，单击“安全”栏中的“自定义级别”选项卡，
                * 将第三项“对没有标记为安全的activex控件进行初始化和脚本运行”设置成“启用”即可
                * */

                oXL = new ActiveXObject("Excel.Application"),

                oWB = oXL.Workbooks.Add(),//创建AX对象excel

                xlsheet = oWB.Worksheets(1),//获取workbook对象

                sel = document.body.createTextRange();//激活当前sheet

            sel.moveToElementText(curTbl);//把表格中的内容移到TextRange中

            sel.select();//全选TextRange中内容

            sel.execCommand("Copy");//复制TextRange中内容

            xlsheet.Paste();//粘贴到活动的EXCEL中

            oXL.Visible = true;//设置excel可见属性

            try{
                var fname = oXL.Application.GetSaveAsFilename("save.xls", "Excel Spreadsheets (*.xls), *.xls");
            }catch(error){
                print("Nested catch caught " + error);
            }finally{
                if(fname){
                    oWB.SaveAs(fname);
                    oWB.Close(savechanges=false);

                    oXL.Quit();

                    oXL=null;
                }else{
                    alert("导出失败");
                }



                _W.setTimeout(function(){//结束excel进程，退出完成
                    CollectGarbage();
                },1);

            }
    }
    /*
     *HTML5版Js实现的MP3播放器
     * */
    _Oth.playerMp3 = function(mp3){

        var playerMp3 = function(option){//mp3播放器

                this.audio = option.audio;
                this.audioAction = option.audioAction;
                this.process = option.process;
                this.setProcessO = option.setProcess;
                this.setProcessOK = option.setProcessOK;
                this.volup = option.volup;
                this.voldown = option.voldown;
                this.muted = option.muted;

            var self = this;

            this.audioAction.onclick = function(){ //播放控制
                if(this.value == "播放"){
                    self.start();
                    this.value = "暂停";
                }else{
                    self.pause();
                    this.value = "播放";
                }
            }

            this.volup.onclick = function(){//音量增大
                self.setVolup();
            }

            this.voldown.onclick = function(){//音量减少
                self.setVoldown();
            }

            this.muted.onclick = function(){//静音、发声
                self.setMute();
            }

            setInterval(function(){//获取播放进度
                self.getProcess();
            },1000)

            this.setProcessOK.onclick = function(){//确定修改进度
                self.setProcess();
            }

        }

        playerMp3.prototype.start = function(){//开始播放
            this.audio.play();
        }


        playerMp3.prototype.pause = function(){//暂停播放
            this.audio.pause();
        }

        playerMp3.prototype.getProcess = function(){//获取播放进度
            this.process.value = Math.floor(this.audio.currentTime) + "秒";
        }

        playerMp3.prototype.setProcess = function(){//设置播放进度
            this.audio.currentTime = (this.setProcessO.value || 0);
        }

        playerMp3.prototype.setVolup = function(){//音量+
            var v = this.audio.volume + 0.1;

            this.audio.volume = (v > 1 ? 1 : v);
        }

        playerMp3.prototype.setVoldown = function(){//音量-
            var v = this.audio.volume - 0.1;

            this.audio.volume = (v < 0 ? 0 : v);
        }

        playerMp3.prototype.setMute = function(){//静音/发声
            this.audio.muted = !this.audio.muted;
            this.audio.muted ? (this.muted.value = "发声") : (this.muted.value = "静音");

        }

        //实例化播放器
        return new playerMp3(mp3);
    }

    /*网页图片较多时，分批次加载图片*/

    _Oth.preImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAAANSURBVBhXYzh8+PB/AAffA0nNPuCLAAAAAElFTkSuQmCC";//预设图片

    _Oth.needLoadImgs = (function(loads){
        /*
        * 1,待加载元素的集合
        * 2,待加载的元素，必须采用替换或其它方法停止图片加载
        * 3,加载图片的触发条件，容器在可视区域内
        * 4,,加载图片的影响因素，窗体滚动、大小改变的时候
        * 5，重复以上动作，直到所有图片加载完毕为止
        * */

        var needLoadImgs = function(){
            var that = this;
            this._imgs = [];
            this.initImgs = function(){
                var l = document.images.length,
                    i = 0,
                    imgs = document.images,
                    _i = null;

                if(l > 0){//是否启用事件
                    for(;i < l ; i++){
                        _i = imgs[i];

                        this._imgs[i] = _i;//待载入图的数组

                        if (_i.src === undefined || _i.src === false) {//检测是否存在损坏图片
                            _i.src = _Oth.preImg;
                        }
                    }
                    that.updateImg();
                    that.initEvent();
                }

            }
        }

        needLoadImgs.prototype.initEvent = function(){//绑定事件检测
            var that = this;
            //滚轴事件
            _W.onscroll = function(){
               that.updateImg();
            }
        }

        needLoadImgs.prototype.updateImg = function(){
            var i = 0,
                l = this._imgs.length,
                imgs = this._imgs,
                cimg = "",
                _i = null,
                windowHeight=document.all ? document.getElementsByTagName("html")[0].offsetHeight : window.innerHeight,
                scrollY = document.documentElement.scrollTop || document.body.scrollTop; //滚动条距离顶部高度
            for(;i < l ; i++){
                _i = imgs[i];
                cimg = _i.getAttribute("data-source");

                if (cimg){//判断图片是否在可视区域,如果在可视区域加载

                    if(_Oth.getAbsoluteTop(_i)+_i.offsetHeight/4 < windowHeight + scrollY){

                        _i.src = cimg;//设置源图片地址

                        imgs.splice(i, 1); //删除已经设置过图片的对象
                    }
                }
            }


        }

        return new needLoadImgs(loads);
     })();

    //获取元素的绝对top
    _Oth.getAbsoluteTop = function (_e){
        var _top = _e.offsetTop,
            _current = _e.offsetParent;
        while (_current !== null){
            _top += _current.offsetTop;
            _current = _current.offsetParent;
        }
        return _top;
    }

    //获取ID对象
    _Oth.getElement = function(eStr){
        return document.getElementById(eStr);
    }

    //获取指定类型的节点
    _Oth.getTypeElement = function(es, type){
        var esLen = es.length,
            i = 0,
            eArr = [],
            esI = null;
        for(; i < esLen ; i++){
            esI = es[i];
            if(esI.nodeName.replace("#", "").toLocaleLowerCase() == type){
                eArr.push(esI);
            }
        }
        return eArr;
    }
})(othManage, window, document);
