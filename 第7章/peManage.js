/**
 ************************************************************
 * @project 页面特效 (Page Effects Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2014-02-12
 * @Copyright : BSD License
 ************************************************************
 */

var peManage = peManage || {};

; (function (_PeM, window, document, undefined) {

    var _W = window,//初始化一些基本数据

        document = _W.document;

    _PeM.suspendNavigation = function(e){    //    页面悬浮导航===========================start

        var suspendNavigation = this.getElement("suspendNavigation");//获取待定位的元素

        window.onscroll = function(){ //绑定滚轴事件

            suspendNavigation.style.top = (document.documentElement.scrollTop || document.body.scrollTop) + "px";//将元素top定位
        }
    }

    _PeM.pullDownNavigation = function(){//    下拉式导航菜单 ===========================start

        var navs = this.getTypeElement(this.getElement("pullDownNavigation").childNodes, "div"),//获取所有下拉式导航菜单

            i = 0,

            l = navs.length,//元素个数

            targetID = null;

        for(; i < l ; i++){

            navs[i].onmousemove = function(){    //显示下拉菜单

                targetID = this.getAttribute("data-targetID");

                _PeM.getElement(targetID).style.display = "block";

            }

            navs[i].onmouseout = function(){  //隐藏下拉菜单

                _PeM.getElement(targetID).style.display = "none";

            }
        }
    }

   _PeM.slideNavs = function(slide){//    滑动门导航===========================start
       var slideId = -1;;
       slide.onmouseover = function(){//打开滑动门

           clearTimeout(slideId);//由于子元素会干扰事件，导致滑动抖动，当再次进入元素，停止隐藏滑动门的线程

           new animateManage({//播放显示元素的动画

               //被操作的元素
               "context" : slide,

               "effect":"linear",

               //持续时间
               "time": 100,

               //元素的起始值偏移量
               "starCss":{
                   "left":slide.style.left
               },

               //元素的结束值偏移量
               "css" :{
                   "left":0
               }
           }).init();
       }

       slide.onmouseout = function(){//关闭滑动门

           slideId = setTimeout(function(){

               new animateManage({//播放隐藏元素的动画

                   //被操作的元素
                   "context" : slide,

                   "effect":"linear",

                   //持续时间
                   "time": 100,

                   //元素的起始值偏移量
                   "starCss":{
                       "left":slide.style.left
                   },

                   //元素的结束值偏移量
                   "css" :{
                       "left":-72
                   }
               }).init();
           }, 300)

       }
   }

    _PeM.treeMenuNav = function(){//    树形菜单导航===========================start

        var as = document.getElementsByTagName('a'),//获取所有a元素

            ai = 0,//循环变量初始引导值

            al = as.length,//a的个数

            ao = null;    //被遍历的当前元素

        for(; ai < al ; ai++){
            ao = as[ai];

            if(ao.className == "treeIcon"){//判断是否是树形节点被点击的地方

                ao.onclick = function(){//绑定点击事件

                    var iconType = this.innerHTML,//获取展示类型

                        uls = _PeM.getTypeElement(this.parentNode.parentNode.childNodes, "ul"),//所有将要设置是否显示的元素

                        uli = 0,//元素初始值

                        ull = uls.length,//子菜单个数

                        dis = "block";//默认显示（展开）子菜单

                    if(iconType == "-"){
                        this.innerHTML = "+";
                        dis = "none";
                    }
                    else{
                        this.innerHTML = "-";
                    }
                    for(; uli < ull ; uli++){
                        uls[uli].style.display = dis;
                    }
                }
            }
        }
    }
    //    仿QQ菜单===========================start
    _PeM.likeQQMenue = function(){
        var ls = this.getElement("likeQQMenue").childNodes,
            li = 0,
            ll = ls.length,
            lo = null;
        for(; li < ll ; li++){
            lo = ls[li];
            if(lo.className == "likeQQMenueLists"){
                lo.onclick = function(){
                    var divs = _PeM.getTypeElement(this.childNodes, "div"),
                        dis = "block",
                        classNames = divs[0].className,
                        target = _PeM.getElement(this.getAttribute("data-targetID"));

                    if(classNames == "relationMenu on"){//展开列表
                        divs[0].className = "relationMenu";
                        target.style.display = "block";
                    }
                    else{ //收缩列表
                        divs[0].className = "relationMenu on";
                        target.style.display = "none";
                    }
                }
            }
        }
    }
    //    漂浮广告===========================start
    _PeM.floatingAd = function(){

        var animateFloat = function(){//运动行动画

            var floatingAd = _PeM.getElement("floatingAd"),//浮动的动画

                bodyW = window.innerWidth || document.documentElement.offsetWidth,//浮动的最大范围

                maxLeft = bodyW -120,//浮动的最大范围修正

                thisLeft = parseInt(floatingAd.style.left);//元素的left值

            new animateManage({

                "context" : floatingAd,//被操作的元素

                "effect":"linear",

                "time": 10000,//持续时间

                "starCss":{//元素的起始值偏移量
                    "left":thisLeft
                },

                "css" :{//元素的结束值偏移量

                    "left":thisLeft >=  maxLeft ? 0 : maxLeft//检测是否达到最左边或右边，开始反向运动
                }
            }).init();
        }

        animateFloat();

        setInterval(function(){
            animateFloat();
        }, 10100);
    }

    _PeM.adOpenOrShrink = function(e){//    滑动展开/收缩广告===========================start
        //滑动展开广告
        new animateManage({

            //被操作的元素
            "context" : e,

            "effect":"linear",

            //持续时间
            "time": 1000,

            //元素的起始值偏移量
            "starCss":{
                "height":0
            },

            //元素的结束值偏移量
            "css" :{
                "height":210
            },
            "callback":function(){
                //滑动收缩广告
                new animateManage({

                    //被操作的元素
                    "context" : e,

                    "effect":"linear",

                    //持续时间
                    "time": 1000,

                    //元素的起始值偏移量
                    "starCss":{
                        "height":210
                    },

                    //元素的结束值偏移量
                    "css" :{
                        "height":0
                    }
                }).init();
            }
        }).init();
    }

    _PeM.backAd = function(e){//    定时关闭的背投广告===========================start

        var time = 5000, //间隔多久关闭

            timeID = -1;//间时调用线程

        timeID=setInterval(function(){

            if(time == 0){//如果时间等于0，则关闭背投广告，停止调用

                e.style.display = "none";//隐藏元素

                clearInterval(timeID);//关闭调用
            }

            time-=1000;//递减时间

            e.innerHTML = (time/1000) + "秒后关闭背投广告";//修改多少秒关闭广告
        },1000)
    }

    _PeM.picLists = function(){//    随图片快速翻动幻灯代码===========================start

        var imgs = this.getTypeElement(this.getElement("picLists").childNodes, "div"),//获取所有待点击的图片对象

            l = imgs.length,//图片对象个数

            i = 0,//遍历初始位置

            src = "",

            firstUi = this.getElement("firstUi"),  //第一个节点

            firstUiimg = this.getElement("firstUiimg"),//第一个节点的图片对象

            secondUi = this.getElement("secondUi"),//第二个节点

            secondUiimg = this.getElement("secondUiimg"),//第二个节点图片对象

            t = 1, //切换节点类型

            main = this.getElement("main");
        for(; i < l ; i++){

            imgs[i].onclick = function(){ //为图片绑定点击事件，响应切换图片

                src = _PeM.getTypeElement(this.childNodes, "img")[0].src;//被点击事件的图片对象

                if(t == 1){ //如果等于1，则修改第二个节点的src
                    secondUiimg.src = src;
                }else{
                    firstUiimg.src = src;
                }

                new animateManage({//播放动画

                    "context" : t == 1 ? firstUi : secondUi,//被操作的元素

                    "effect":"linear",

                    "time": 300, //持续时间

                    "starCss":{//元素的起始值偏移量
                        "width":208
                    },

                    "css" :{//元素的结束值偏移量
                        "width":0
                    },
                    "callback":function(){
                        if(t == 1){
                            t = 2;

                            firstUi.style.width = "208px";    //回复第1个节点的宽度

                            main.appendChild(firstUi);//将第1个节点设置成最后节点
                        } else{
                            t = 1;

                            main.appendChild(secondUi);//将第2个节点设置成最后节点

                            secondUi.style.width = "208px";//回复第2个节点的宽度
                        }
                    }
                }).init();
            }
        }
    }

    /*
     *页面五颜六色的雪花================start
     */

    _PeM.isOpen = false;//雪花启动的开关

    _PeM.flutterChar = function(){

        if(_PeM.isOpen){//是否开启过
            return;
        }
        _PeM.isOpen = true;

        var allChar = [],//创建文字

            maxSnowflake = 90, //雪花的最大数目

            maxleft = (document.body.clientWidth || document.documentElement.clientWidth)-100, //最大的left值

            maxTop = -1,//最高高度

            i = 0,//遍历计数器

            snowflake = [//雪花类型
                '❉',
                '❈',
                '*',
                '✲',
                '❀',
                '❃'
            ],

            snowflakeColor = [   //颜色库
                "red",
                "green",
                "#ccc123",
                "#345232",
                "#231111",
                "#ab2322"
            ],

            s = 0,  //计数雪花---类型与颜色

            createCharr = function(){//创建雪花

                var d = document.createElement("div");

                s++;//修改颜色与雪花值

                s = s > 5 ? 0 : s;

                d.innerHTML = snowflake[s];//填充值

                d.style.left = Math.round(Math.random()*maxleft+0) + "px";//设置雪花的left值

                d.style.top = (-1 * Math.round(Math.random()*100+0)) + "px";//设置雪花的top值

                d.style.position = "absolute";//绝对定位

                d.style.zIndex = "999";//Z轴设置

                d.style.color = snowflakeColor[s]; //设置颜色

                d.setAttribute("data-v", Math.round(Math.random()*5+2));//随机雪花速度

                d.setAttribute("data-time", "0");//雪花的漂浮时间

                document.body.appendChild(d);

                return d;//返回雪花对象
            },

            moveChar = function(e){//移动雪花

                maxTop = document.body.scrollHeight-50;

                var l = parseInt(e.style.left, 10),

                    t = parseInt(e.style.top, 10),

                    v = parseInt(e.getAttribute("data-v"), 10),//当时速度

                    time = parseInt(e.getAttribute("data-time"), 10),  //时间  ]

                    _time = time + 50,

                    _l = l + v,

                    _t =  0.5 * 9 * _time * _time * 0.001 * 0.001 * v,//落体位移的路程，加入修正值v

                    top = _t >= maxTop ? 0 : _t,

                    _time = _t >= maxTop ? 0 : _time;

                e.style.top =  top + "px";

                e.style.left = ( _l >= maxleft ? 0 : _l) + "px";

                e.setAttribute("data-time", _time);
            };



        var createS = setInterval(function(){//雪花运动
            //创建很多雪花
            var length = allChar.length,
                l =  length + 10;
            for(; i <  l ; i++){
                allChar.push(createCharr());
            }
            if(allChar.length > maxSnowflake){
                clearInterval(createS);
            }
        }, 1000)

        setInterval(function(){//雪花运动
            var ll = allChar.length;
            for(i = 0 ; i < ll ; i++){
                moveChar(allChar[i]);
            }
        }, 50)




    }

    //获取ID对象
    _PeM.getElement = function(eStr){
        return document.getElementById(eStr);
    }

    //获取指定类型的节点
    _PeM.getTypeElement = function(es, type){
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
})(peManage, window, document);
