/**
 ************************************************************
 * @project 移动开发常用代码管理 (Mobile Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2014-02-20
 * @Copyright : BSD License
 ************************************************************
 */

var mobManage = mobManage || {};

; (function (_Mob, window, document, undefined) {

    var _W = window,//初始化一些基本数据

        document = _W.document;

    /*
     * 区分平台类型
     * 则在主体元素中添加“iPhone”、“Android”等标示符
     * */

    _Mob.mobPlatformType = function(){

        var platformType = "others", //平台类型模式是其它

            platforms = [//一些主流设备类型库
                "iphone",
                "ipod",
                "ipad",
                "android",
                "windows phone os"
            ],

            reg = null,//正则匹配的设备字符

            userAgent = navigator.userAgent.toLowerCase(),//设备字符串

            i = 0,//初始值

            l = platforms.length,//设备的数量上限

            p = "";//当前设备

        for(; i < l;i++){
            p = platforms[i];

            reg = new RegExp(p, "i");//正则设备匹配

            if (userAgent.match(reg))//正则判断是否为iPhone
            {
                platformType = p;
            }

        }

        document.body.setAttribute("mob-platformType", platformType);
    }

    /*
     * 方向变更捕获
     * */

    _Mob.orientationCall = [];//方向改变事件待执行的函数队

    _Mob.orientation = (function(){//移动设备方向改变事件

        var o = ""; //待遍历的对象键

        window.addEventListener("orientationchange", function(event) {//检测浏览器的方向改变

            for(o in this.orientationCall){

                this.orientationCall[i]();     //运行待执行的函数
            }
        }, false);

    })();

    _Mob.addOrientation = function(callFun){//增加方向变换的回调队列

        this.orientationCall[this.orientationCall.length] = callFun;//推入回调
    }

    /*
     *区分移动设备屏幕的竖/横 屏
     * */
    _Mob.orientation = "vertical";//默认垂直（vertical），横向（Horizontal）

    _Mob.isOrientation = (typeof window.orientation == "number" && typeof window.onorientationchange == "object");//检测是否支持window.orientation

    _Mob.getOrientation = function(){//获取设备的方向

        if(this.isOrientation){//如果支持 window.orientation

            this.orientation = window.orientation == 0 ? "vertical" : "Horizontal";  //0表示竖屏，正负90表示横屏（向左与向右）模式
        }
        else{

            this.orientation = window.innerWidth > window.innerHeight ? "Horizontal" : "vertical";  //根据高度与宽度判断是：横屏或竖屏
        }


        document.body.setAttribute("mob-orientation", this.orientation);//为body添加判断方向属性
    }

    _Mob.updateorientation = function (){ //更新屏幕的方向值

        this.getOrientation();//更新方向

        this.addOrientation(this.getOrientation);//方向变更的时候，更新屏幕方向数值

    };

    /*
     *移除浏览器地址栏
     * */

     _Mob.clearUrl = function(){

        /*
         * 页面内容多，超过屏幕高度时，却会自动隐藏地址栏，
         * 目前网络上流行的是将当前页面的屏幕向上滚动，
         * 造成地址栏超出视野范围，就不会看到
         * */

         var  scroll = function(){

            _W.scrollTo(0, 1);// 将屏幕滚动到指定的位置
        };

        scroll();//页面载入的时候运行

        this.addOrientation(scroll);//待方向变更的时候修改屏幕滚轴
    }



    /*防止网页触摸滚动*/
     _Mob.notouchmove = function(event) {

         document.body.ontouchmove = function(event){ //body中增加触摸事件

             event.preventDefault();//该方法将通知 Web 浏览器不要执行与事件关联的默认动作
         }
     }

})(mobManage, window, document);
