/**
 ************************************************************
 * @project 页面管理 (Pages Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2014-01-10
 * @Copyright : BSD License
 ************************************************************
 */

var pManage = pManage || {};

; (function (_PM, window, document, undefined) {

    //初始化一些基本数据
    var _W = window,

        document = _W.document;

    /*===============打开新页面=================Start*/
    _PM.openNewPage = function(e){
        /*
        在原来的窗口中，直接跳转至目标页面
        window.location.href="将要跳转的页面";

        在新窗口中打开页面
        window.open('将要跳转的页面');
        window.history.back(-1);返回上一页

        通过指定的URL替换当前的页面及缓存内容，导致跳转页面后没有后退功能
        window.location.replace("将要跳转的页面")

        通过文档头META跳转： CONTENT 后面的阿拉伯数字是代表过几秒中钟转入目标网页，URL是目标地址
        <META HTTP-EQUIV="Refresh" CONTENT="0;URL= "将要跳转的页面">
        */
        e.onclick = function(){
            //通过第一条的方式跳转页面
            window.location.href = this.getAttribute('data-href');
        }
    }
    /*==========打开指定大小的窗口============Start*/
    _PM.openwindow = function(w, h, href){
         w = w || "";
         h = h || "";
         /*window.open(
         "可选，将要跳转的页面",
         "可选，新窗口的名称",
         "可选，设置新窗口的一些特征，默认为浏览器的标准特征，可选参数---channelmode、directories、fullscreen、height、width等"
         "可选，规定装载到窗口的URL，是替换浏览器当前历史条目还是新创建一个新条目，true为替换，false为创建新条目"
         ) */
        window.open(href,'','width='+ w +',height='+ h)
    }
    /*==============打开模式子窗口=========Start*/
    _PM.opentChildWindow = function(){
        /*
        *  showModalDialog方法用来创建一个显示HTML内容的模态对话框，  object.showModalDialog(
        * '必选参数，类型：字符串。用来指定对话框要显示的文档的URL'
        * ,'可选，'
        * ,'可选')*/
        // 三个参数分别为：对话框加载的 HTML 页面的 URL、传入对话框页面的参数，控制对话框展现效果的参数

        window.showModalDialog("index.html");
    }
   /*==================获取子窗口的返回值=============Start*/
    _PM.opentChildWindowValue = function(){
        var returnV = window.showModalDialog("child.html");
        //监听子窗口返回值
        if(returnV){
            alert("返回值为：" + returnV);
        }
    }
    /*==========================刷新iframe窗口==========Start*/
    _PM.updateIframe = function(){
        //第1种获取iframe --- 用iframe的id属性定位，用location.href可以解决跨域的问题，网上流传用location.reload()，这个会有域的限制
        updateIframe.location.href = "child.html";
    }
    /*刷新当前页面===================================Start*/
    _PM.updatePage = function(){
       //在JavaScript用很多刷新当前页面的方法，本节介绍3种---window为当前的窗口对象
       //方法1 直接调用reload()方法，
       window.location.reload();

       //方法2 让页面跳转至原有的页面，也是刷新的一种实现方案
       //window.location.href = window.location.href;

       //方法3 利用新的页面替换当前的页面 ，会替换历史中的痕迹
       //window.location.replace(window.location.href);
    }
    /*不弹出提示框关闭父窗口---请查看closeParent.html相关代码================Start*/

    /*弹出窗口关闭时，刷新父窗口---请查看updateParentWindow.html相关代码======================Start*/

    /*子窗口打开---全屏=======================Start*/
    _PM.windowFullScreen = function(){
        /*设置新打开的页面：
            toolbar不显示浏览器的工具栏、
            location不显示地址字段、
            menubar不显示菜单栏、
            directories不显示目录添加按钮、
            scrollbars窗体中内部超出窗口可视范围时不存在有滚动条 */
        var win = window.open("child.html","_blank","resizable=yes;status=yes;toolbar=no;location=no;menubar=no;directories=no;scrollbars=no;");

        //设置新窗口的位置(0,0)
        win.moveTo(0,0);

        //设置新打开窗口的宽、高
        win.resizeTo(screen.availWidth,screen.availHeight);
    }
    /*屏蔽右键======================Start*/
    _PM.shieldingRight = function(){
        //禁止右键菜单的事件,一般情况下，IE、FF、Chrome都会支持，在一些其它个别浏览器下会不支持
        document.oncontextmenu=function(){
            alert('禁止鼠标右键菜单!');
            //返回false 则会禁止
            return false;
        }

    }
    /*网页将不能被另存为=========================Start*/
    _PM.banOnPage = function(){
        //打开新的窗口
        var _win=window.open('','','');
        //设置打开窗口的opener = null
        _win.opener = null;
        //兼容性有待验证，ie6~8，Chrome版本也会支持
        //向新的窗口填充HTML：加入iframe框架，设置src为坏链接
        _win.document.write('<html><head><meta http-equiv="Content-Type" content="text/html; charset=utf-8"><title>禁止用“另存为”</title></head><body>禁止另存为的代码<noscript>禁止另存为<iframe scr="*.htm"></iframe></noscript></body></html>');

    }
    /*防止被人frame*/
    _PM.banFrame = function(){
        //自动检测，然后跳出  ---top表示最顶级的窗口，也就是最外层的窗口，self指代当前窗口对象,属于window最上层的对象
        if (top.location != self.location){
            top.location = self.location;
        }
    }
    /*永远都会带着框架   */
    _PM.existFrame = function(){
        //判断网页是否在框架中，如果不在框架中，自动套上框架
        if (window.location.href == top.location.href) {
            //frames.html为框架网页
            top.location.href = "frames.html";
        }
    }
    /*禁止滚动条*/
    _PM.banScrollBar = function(){
        //css的方案，兼容性有问题
        //document.body.style.overflow = "hidden";
        document.onmousewheel = function(event){
            event = event||window.event;
            //检测浏览器是否存在，取消浏览器默认事件的接口preventDefault
            if (event && event.preventDefault){
                //取消默认事件
                event.preventDefault();
                //阻止事件的传播
                event.stopPropagation();
            }else{
                //返回false阻止事件
                return false;
            }
        }


    }
    /*禁止查看源代码*/
    //本节讨论禁止源代码是在JavaScript的基础上执行的，绝对的禁止不存在，因为可以采用很多其它的特殊手段获取源代码
    _PM.banViewSource = function(e){
        //以打开新窗口的形式禁止查看源代码，关闭浏览器的工具栏等，但是一些浏览器的调试工具无法屏蔽
        e.onclick = function(){
            window.open("banViewSource.html","","menubar=no,location=no,scrollbars=yes,resizable=yes")
        }
    }
    /*取消选取========================Start*/
    _PM.deselect = function(){
        /*
            1,document.selection不是W3C的标准，只是一些主流浏览器的API，只有ie支持，代表选中区块，之后可以调用这个API的一些操作方法；
            2,window.getSelection 返回一个由用户选定的表示文本的范围的对象，并可以调用此对象的一些方法进行操作
        * */
        (window.getSelection && window.getSelection().removeAllRanges())
        || (document.selection && document.selection.empty && document.selection.empty());
    }
    /*防止复制===========================Start*/
    _PM.preventCopying = function(e){
        //***第1种方法***
        //禁止复制
        e.oncopy = function(){
            return false;
        }
        //禁止剪切
        e.oncut = function(){
            return false;
        }
        //***第2种方法***
        //禁止选取
        e.onselectstart =  function(){
            return false;
        }
    }
    //添加到收藏夹=======================start
    _PM.addFavorite = function(fURL, fTitle){
        try {//IE支持的API
            window.external.AddFavorite(fURL, fTitle);
        } catch(e) {//FF支持的API
            try{
                window.sidebar.addPanel(fTitle, fURL, "");
            }catch(error){
                //如果不支持以上两种方案，采用 提示性收藏
                alert("加入收藏失败，请用Ctrl+D 或 手动设置！");
            }
        }
    }

    //网页设置为首页=======================start
    _PM.setHomePage = function(val){
        try{
            //设置或检索对象的DHTML行为
            document.body.style.behavior='url(#default#homepage)';
            document.body.setHomePage(val);
        }
        catch(e){
            if(window.netscape) {
                try {
                    //netscape.security.PrivilegeManager.enablePrivileg ，权限设置，有的浏览器需要用户配置浏览器安全属性才能执行
                    netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
                }
                catch (e)  {
                    alert("此操作被浏览器拒绝，请手动设置！");
                }
                //Components.classes 是一个被ContractID类索引的只读对象属性。
                var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService
                    (Components.interfaces.nsIPrefBranch);
                //浏览器的偏好设置
                prefs.setCharPref('browser.startup.homepage',val);
            }else{
                alert("设置首页失败，请手动设置！");
            }
        }
    }
    //将网页另存为=======================start
    _PM.webSave = function(page){
        /*document.execCommand(指令参数[,交互方式, 动态参数])---document.execCommand 方法提供了对浏览器内置命令调用的接口
         交互方式参数如果是true，显示对话框，false，不显示对话框，动态参数一般为一可用值或属性值（如下例中的”page”）
        */
        //将该网页保存到本地盘的其它目录，如果是ie可以另存为成功，Chrome、火狐及其它一些浏览器可能会弹出网页另存失败
        var save = document.execCommand('saveas','true', page);
        if(!save && !this.isIE()){
            alert("设置网页另存失败，请用Ctrl + S 或手动设置！");
        }
    }

    //IE地址栏前换成自己的图标 html link代码

    /*在收藏夹中显示出你的图标    html link代码 */
    //查看网页源代码
    _PM.viewDocumentSource = function(){
        var source = window.open("index.html","","menubar=no,location=no,scrollbars=yes,resizable=yes");
        //根据window.XMLHttpRequest对象是否存在使用不同的创建方式
        if (window.XMLHttpRequest) {
            xmlHttp = new XMLHttpRequest();                  //FireFox、Opera等浏览器支持的创建方式
        } else {
            xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");//IE浏览器支持的创建方式
        }
        xmlHttp.onreadystatechange = function(){
            if (xmlHttp.readyState == 4) {
                source.document.write("<textarea cols='1000' rows='1000'>" + xmlHttp.responseText +"</textarea>") ;
            }
        };
        //get形式请求数据
        xmlHttp.open("GET", "index.html", true);
        xmlHttp.send(null);
    }
    //判断上一页的来源
    _PM.getPreviousPage = function(){
        /*
        *一般情况下一些浏览器会将document.referrer来源处理为空字符 ，假设场景为：由B页面，跳转至A页面
        *  1，在地址栏中直接输入A地址
        *  2，在B页面右击link A，在新窗口中打开
        *  3，在B页面右击link A，在新标签页中打开
        *  5，鼠标拖动link A至地址栏、标签栏
        *  6，修改window.location打开A页面(同域)
        *  7，利用window.open打开A页面
        *  8，通过单击flash打开A页面
        *  9， 后台（服务器）重定向至A页面
        * */
         return document.referrer;
    }

    //最小化、最大化、关闭窗口
    _PM.updateWin = function(str){
        var _w = 0,
            _h = 0;
        //IE支持,其它浏览器只支持新打开窗口的大小设置
        if(str == "max"){
            _w=screen.availWidth;
            _h=screen.availHeight;
        }

        if(str == "min"){
            //方法1    updateWinMinIE.Click();

            /*方法2 各种浏览器对 window.resizeTo() 方法 与 window.moveTo() 支持程度不一样导致结果不一样，
            大多是出于用户体验及安全的考虑，截止2014年 1月份---Chrome、Firefox不支持此方法，ie支持，其它浏览器没测试过感兴趣的朋友可以测测*/
            _w = 1;
            _h = 1;
        }
        //关闭窗口
        if(str == "close"){
            /* 只对 ie 与Chrome起作用  ，Firefox需要特殊配置
            * 1.在Firefox地址栏里输入 about:config
              2.在配置列表中找到 dom.allow_scripts_to_close_windows
              3.点右键的选切换把上面的false修改为true即可，默认是false，是为了防止脚本乱关窗口
             FireFox中做如此设置以后，直接使用“window.close()”即可对窗口关闭。
            * */
            _W.open('','_self','');
            _W.close();
        }
        window.moveTo(0,0);
        window.resizeTo(_w,_h);

    }
    // 网页不会被缓存
    _PM.noCache = function(){
        //html 标准meta的写法
        /*
        <!--在头部注释中 第1种写法-->
        <META HTTP-EQUIV="pragma" CONTENT="no-cache"> 是用于设定禁止浏览器从本地机的缓存中调阅页面内容，设定后一旦离开网页就无法从Cache中再调出
        <META HTTP-EQUIV="Cache-Control" CONTENT="no-cache, must-revalidate"> 用于控制HTTP缓存（在HTTP/1.0中可能部分没实现，仅仅实现了Pragma: no-cache）
        <META HTTP-EQUIV="expires" CONTENT="Wed, 26 Feb 1997 08:21:57 GMT"> 表示存在时间，允许客户端在这个时间之前不去检查（发请求）
         <!--在头部注释中 第2种写法-->
         <META HTTP-EQUIV="expires" CONTENT="0">*/

        //js方法随机数   一般利用后台可以处理
        _W.location = _W.location.href+"#"+new Date().getTime()


    }
    // 检测某个网站的链接速度
    _PM.linkSpeedTime = 0;
    _PM.linkSpeedInterl = -1;
    _PM.linkSpeedE = null;
    _PM.linkSpeedURL = "";
    _PM.linkSpeed = function(e, t){
        pManage.linkSpeedTime = 1;
        //关闭线程
        _W.clearInterval(this.linkSpeedInterl);
        //开启线程
        this.linkSpeedInterl = setInterval(function(){
            pManage.linkSpeedTime++;
            console.log(pManage.linkSpeedTime);
        },100)
        this.linkSpeedURL = e.value;
        this.linkSpeedE = t;
        //创建一个img请求连接
        var img = new Image(); //创建一个Image对象，实现图片的预下载
        img.src = this.linkSpeedURL +"/"+Math.random();
        //检测测试结果
        img.onerror = function (call) { //图片下载完毕时异步调用callback函数。
            window.event
            console.log(call)
            if(pManage.linkSpeedURL){
                pManage.getLinkSpeed();
            }
        };
    }
    //计算、显示才而是结果
    _PM.getLinkSpeed = function(){
        this.linkSpeedE.value = (this.linkSpeedTime / 10 ) + "秒";
        //关闭线程
        _W.clearInterval(this.linkSpeedInterl);
    }
    // 脚本永不出错
    _PM.noError = (function(){
        //在打开页面时，普通用户并不希望看到弹出脚本错误的对话框，为避免这种情况可以在网页中添加捕获错误的代码

        //脚本发生错误时触发的对象---参数：m为错误信息、f错误的文件、l错误的行号
        window.onerror = function(m, f, l){
            return true;
        };
    })();
    //防止点击空链接，页面重置到页的首端
    _PM.noATop = function(){
        //一般点击空连接，页面重置到首页是因为再链接中加入了锚点"#"，或者为空字符等
        var as = document.getElementsByTagName("a"),
            i = 0,
            l = as.length,
            h = "";
        while(i < l){
            h = as[i].getAttribute("href");
            if(h = "#" || !h) as[i].href = "javascript:void(0)";
            i++;
        }
    }
    // 获取浏览器信息
    _PM.getBrowserInformation = function(e){
        //来自 navigator 对象的信息不一定准确，浏览器开发商可以随意更改，没有统一性
        var browerInfo = "",
            nav = navigator;

        //展示浏览器的一些基本信息
        browerInfo += "<h3>中文-简体</h3>";
        //appCodeName 属性是一个只读字符串，代表浏览器的代码名，在所有以Netscape代码为基础的浏览器中，值为“Mozilla”
        browerInfo += "浏览器代码名称：" + nav.appCodeName +"<br>";
        browerInfo += "浏览器类型：" + nav.appName +"<br>";
        browerInfo += "浏览器版本：" + nav.appVersion +"<br>";
        browerInfo += "浏览器语言：" + nav.language +"<br>";
        browerInfo += "是否启用JAVA：" + (nav.javaEnabled() ? "是" : "否") +"<br>";

        browerInfo += "<h3>English</h3>";
        //遍历所有的navigator浏览器对象数据，如果提供基本的字符数据，就打印出来
        for(var n in nav){
            if(typeof nav[n] == "string") browerInfo += n + "：" + nav[n] +"<br>";
        }
        e.innerHTML = browerInfo;
    }
    // URL传参中文出现乱码
    _PM.getURL = function(){
         //为了解决中文字符传递，乱码的问题，一般都将传递的参数利用 encodeURIComponent 进行utf-8格式的url编码，服务端可以进行再解码，这样就解决中文乱码问题了
        var cencodeStr =  encodeURIComponent("我是Qingjs");
        alert("调用encodeURIComponent对‘我是Qingjs’编码：" + cencodeStr +"\n"
            //decodeURIComponent返回统一资源标识符 (URI) 的一个已编码组件的非编码形式
            + "调用decodeURIComponent对解码后：" + decodeURIComponent(cencodeStr));

    }
    // 获取地址栏URL的参数
    _PM.getURLArgs = function(e){
        //试着在浏览器添加参数
        var args = "空",
             _args = [];
             u = _W.location.href,
             s = u.indexOf("?"),
             i = 0,
             l = 0,
             o = null;
        //如果不等于-1则存在参数
        if(s != -1){
            args = u.substr(s+1).split("&");
        }
        e. innerHTML = "参数以逗号分隔：" + args;
        l = args.length;
        for(; i < l; i++){
            if(args[i]){
                o = args[i].split("=");
                //相同的参数以后边添加的参数为主，会覆盖前面的参数
                _args[o[0]] = o[1];
            }
        }
        //打印参数列表
        console.log(_args);
        return _args;
    }

    //获得一个窗口的大小
    _PM.getWinSize = function(){
         return {
             //如果ie7~8不支持采用 后边获取属性的方法
             width: window.innerWidth || document.documentElement.offsetWidth,
             height:window.innerHeight || document.documentElement.offsetHeight
         };
    }

    //让弹出窗口总是在最上面 =======================================
    _PM.popWinMaxTop = function(){
        //1,在支持模式对话框的浏览器中，用 showModalDialog 方法建立模式对话框 或 showModelessDialog方法建立无模式对话框（参数与模式对话框一样），即可实现窗口最上边，请参考

        //2 打开新窗口
        var self = window.open("closeParent.html","newWindow","width=100,height=100");

        //新窗口，获取焦点即可在最前面
        self.focus();
    }
    // 屏蔽功能键Shift,Alt,Ctrl
    _PM.shieldingFunctionKeys = (function(){
        document.onkeydown = function(event){
            event = event || _W.event;
            if(event.shiftKey || event.altKey || event.ctrlKey){
                alert("禁止按Shift键、Alt键、Ctrl键!")
            }
        };
    })();

    //页面慢慢变大 =========================start
    _PM.pageFillOutSize= {
        width:100,
        height:100
    }
    _PM.pageFillOutWin = null;
    _PM.pageFillOutId = -1;
    // 页面慢慢变大,支持window.resizeBy方法的浏览器都支持此效果，部分ie支持,Chrome等
    _PM.pageFillOut = function(){

        this.pageFillOutWin = window.open("closeParent.html","","width=100,height=100");
        this.pageFillOutId = setInterval(function(){
            pManage.pageFillOutSize.width += 6;
            pManage.pageFillOutSize.height += 6;
            pManage.pageFillOutWin.window.resizeBy(pManage.pageFillOutSize.width, pManage.pageFillOutSize.height);
            //如果大于最大的宽度则停止动画
            if(pManage.pageFillOutSize.width >= screen.availWidth){
                clearInterval(pManage.pageFillOutId);
            }
        }, 50)

    }
    //页面进入和退出的特效===========start
    _PM.pageInOut = function(){
        /* 第一种方法，在<head></head>中加入以下类似代码：
        <meta http-equiv="Page-Enter" content="RevealTrans(duration=5,Transitionv=11)">
        http-equiv参数：
        "进入网页"（Page-Enter）、"离开网页"（Page-Exit）、"进入站点"（Site-Enter）、"离开站点"（Site-Exit）
        duration=时间
        Transitionv=方式
        Page-Enter
        说明：duration为页面切换的时间长度，3.000表示3秒钟，一般可以直接输入3便可；transition为切换效果，从1-23共22种不同的切换效果，其中23为随机效果。


        效果 　Content 　Transitionv
        盒状收缩 0　
        盒状展开 1
        圆形收缩 2　
        圆形展开 3
        向上擦除 4
        向下擦除 5
        向左擦除 6
        向右擦除 7
        垂直百页窗 8
        水平百页窗 9
        横向棋盘式 10
        纵向棋盘式 11
        溶解 12
        左右向中部收缩 13
        中部向左右展开 14
        上下向中部收缩 15
        中部向上下展开 16
        阶梯状向左下展开 17
        阶梯状向左上展开 18
        阶梯状向右下展开 19
        阶梯状向右上展开 20
        随机水平线 21
        随机垂直线 22
        随机 23
        */

        //第二种方法 操控IE滤镜的方法，
        if(!pageInOut.filters) return;
        pageInOut.filters[0].Apply();
        if (pageInOut.style.visibility == "visible")
        {
            pageInOut.style.visibility = "hidden";
            pageInOut.filters.revealTrans.transition=23;
        } else
        {
            pageInOut.style.visibility = "visible";
            pageInOut.filters[0].transition=23;
        }
        pageInOut.filters[0].Play();
    }
    // 页面全屏
    _PM.pageFullScreen = function(){
        //定位坐标
        window.moveTo(0,0);
        //修改大小
        window.resizeTo(screen.availWidth,screen.availHeight);
    }

    // 定时关闭页面

    //多少毫秒之后关闭
    _PM.timeClosePageT = -1;
    _PM.timeClosePage = function(t){
        this.timeClosePageT = t || -1;
        if(this.timeClosePageT != -1){
            setTimeout(function(){
                window.open('','_self','');
                window.close();
            }, this.timeClosePageT)
        }
    }
    //  定时跳转到其他页面==============start
    //跳转的时间
    _PM.timeOutHrefT = 0;
    //跳转的目标页
    _PM.timeOutHrefTi = null;
    _PM.timeOutHref = function(h, t){
        this.timeOutHrefT =  t || "";
        this.timeOutHrefTi =  h || null;
        if(!this.timeOutHrefT){
            setTimeout(function(){
                window.location.href = this.timeOutHrefTi;
            }, this.timeOutHrefT)
        }
    }
    //页面打印及预览指定区域=====Chrome 可以，其它等待打印机测试
    _PM.printAndpreview = function(){
        var styleId = this.getElement("styleId"),
            _noprint = this.getClassName("noprint"),
            _l = _noprint.length,
            displayFun = function(dis){
                for(var i = 0; i < _l; i++){
                    _noprint[i].style.display = dis;
                }
            }
        //将不被打印的区域隐藏
        displayFun("none");
        //IE
        if(this.isIE()){
            //注意有可能执行时，会出现没有效果的错误，这时原因是可能你的浏览器限制了active对象的创建，只要取消限制就好了，取消方法如下：
            // 打开你的ie浏览器internet选项—— 安全—— 自定义级别—— 把对没有标记为安全的activex控件进行初始化和脚本运行设置为启用，这样在加打印按钮的时候，只要加个事件触发就好了。
            wb.execwb(6,6)
        }else{
            //非IE支持的方案
            _W.print();
        }
        //将不被打印的区域显示
        displayFun("block");


    }
    //去掉打印时的页眉页脚
    _PM.clearPrintHeadFoot = function(){
        //IE---设置网页打印的页眉页脚为空
        try
        {
            var
            hkey_root="HKEY_CURRENT_USER",

            hkey_path="\\Software\\Microsoft\\Internet Explorer\\PageSetup\\",
            hkey_ = hkey_root+hkey_path,
            //通过ActiveXObject可以访问windows的本地文件系统和应用程序，创建WScript.Shell服务系统组件对象
            ws=new ActiveXObject("WScript.Shell"),
            //设置头部为根键
            hkey_key="header";
            ws.RegWrite(hkey_+hkey_key,"");
            //设置底部为根键
            hkey_key="footer";
            ws.RegWrite(hkey_+hkey_key,"");
        }
        catch(e)
        {
            alert("您的浏览器不支持脚本去除页眉与页脚，请手动设置！")
        }
    }
    //通过类获取元素的样式
    _PM.getClassName = function (className) {
        var all = document.all ? document.all :   document.getElementsByTagName( '*'),
            es = new Array(),
            l = all.length;
        for ( var e = 0; e < l; e ++ ) {
            if (all[e].className == className) {
                es[es.length] = all[e];
            }
        }
        return es;
    }
    //是否IE
    _PM.isIE = function(){
        return !!window.ActiveXObject;
    }

    //获取ID对象
    _PM.getElement = function(eStr){
        return document.getElementById(eStr);
    }

    //设置元素样式
    _PM.setCss = function(_this, cssOption){
        if ( !_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ) {
            return;
        }
        for(var cs in cssOption){
            _this.style[cs] = cssOption[cs];
        }
        return _this;
    }

    //获取指定类型的节点
    _PM.getTypeElement = function(es, type){
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
})(pManage , window, document);
