/**
 ************************************************************
 * @project 页面管理 (Dates Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2014-02-12
 * @Copyright : BSD License
 ************************************************************
 */

var dManage = dManage || {};

; (function (_DM, window, document, undefined) {

    //初始化一些基本数据
    var _W = window,

        document = _W.document;
    //获取日期的指定部分====================start

    //显示当前时间====================start
    _DM.getNowTime = function(){
        //获取日期对象
        var date =new Date();
        //获取年、月、日、时、分、秒，本地系统的时间
        return date.getFullYear() + "年"
            + (date.getMonth() + 1) + "月"
            + date.getDate() + "日"
            + " "
            + date.getHours() + "时"
            + date.getMinutes() + "分"
            + date.getSeconds() + "秒";
    }

    //显示最后修改时间 --- 代码在index.html中====================start

    //实时显示当前时间====================start
    _DM.showNowTime = function(e){
         setInterval(function(){
             e.innerHTML = "时间：" + dManage.getNowTime();
         }, 1000);
    }

    //日期格式化成字符串====================start
    _DM.dateFormat = function(){
        Date.prototype.format = function(f){
            //获取对象中的日期
            var date = {
                //获取年
                "Y" : this.getFullYear(),
                //获取月
                "M" : (this.getMonth() + 1),
                //获取日
                "D" : this.getDate(),
                //获取小时
                "h" : this.getHours(),
                //获取分钟
                "m" : this.getMinutes(),
                //获取秒
                "s" : this.getSeconds()
                },
                //初始化接受日期变量的对象
                d = "",

                //判断是否存在待替换的字符
                r = false,

                //正则
                reg = null,

                //日期
                _d = "";
                ;

            //过滤日期标示符
            for(d in date){
                //判断是否有待格式化的字符
                reg = new RegExp("[" + d + "]{1,}", "g");

                r = reg.test(f);

                //验证是否存在
                if(r)
                {
                    //被替换的日期
                    _d = date[d];
                    f = f.replace(reg, _d < 10 ? ("0" + _d) : _d);
                }
            }

            return f;
        }
    }

    //获取短日期格式====================start
    _DM.getMinDate = function(){
         return new Date().format("YYYY-MM-DD");
    }

    //获取指定日期所在月份的天数====================start
    _DM.getMonthDays = function(Y, M){
        //Y代表年份；M 代表为月数0~11,月份加1,但是第3个参数为0，所以不+1；第3个参数要求最小为1，但是设置0，就变成M月的最后一天了
        return new Date(Y, M, 0).getDate();
    }

    //获取指定日期所在周是第几周====================start
    _DM.getHowManyWeeks = function(Y, M, D){
        //总天数
        var totalDays = 0,
            //默认开始为第1个月
            i = 1;

        //计算总天数
        for(; i < M ; i++){
            totalDays += this.getMonthDays(Y, M);
        }

        totalDays += D;

        //除以7，向上取数，计算第几周
        return Math.ceil(totalDays/7);

    }

    //到指定日期的时间的倒计时====================start
    _DM.getCountDown = function(Y, M, D, h, m, s){
        Y = Y || 0;
        M = M || 0;
        D = D || 0;
        h = h || 0;
        m = m || 0;
        s = s || 0;
        var date = new Date(Y, M-1, D, h, m, s),
            //转换为时间戳，方便计算差值
            times = date.getTime() - new Date().getTime();
            //返回天数
        return Math.ceil(times / (1000 * 60 * 60 * 24));
    }

    //节日倒计时====================start

    //比较两个日期的差====================start
    _DM.getDateDifferenceValue = function(date1,date2){
        var d1 = new Date(date1.Y || 0, (date1.M-1) || 0, date1.D || 1, date1.h || 0, date1.m || 0, date1.s || 0).getTime(),
            d2 = new Date(date2.Y || 0, (date2.M-1) || 0, date2.D || 1, date2.h || 0, date2.m || 0, date2.s || 0).getTime();
        return (d1 - d2)/1000;
    }

    //日期比较大小,返回true为大，false为小====================start
    _DM.getDateSize = function(date1,date2){
        return this.getDateDifferenceValue(date1, date2) > 0 ? true : false;
    }

    //对指定日期进行加减====================start
    _DM.setXDate = function(date, xY, xM, xD, xh, xm, xs){
        xY = xY || 0;
        xM = xM || 0;
        xD = xD || 0;
        xh = xh || 0;
        xm = xm || 0;
        xs = xs || 0;

        //如果存在年的差值，则计算
        if(xY){
           date.setFullYear(date.getFullYear() + xY);
        }
        //如果存在月的差值，则计算
        if(xM){
           date.setMonth(date.getMonth() + xM);
        }
        //如果存在日的差值，则计算
        if(xD){
           date.setDate(date.getDate() + xD);
        }
        //如果存在时的差值，则计算
        if(xh){
           date.setHours(date.getHours() + xh);
        }
        //如果存在分的差值，则计算
        if(xm){
           date.setMinutes(date.getMinutes() + xm);
        }
        //如果存在秒的差值，则计算
        if(xs){
           date.setSeconds(date.getSeconds() + xs);
        }

        return date.format("YYYY-MM-DD h:m:s")

    }

    //字符串转换为日期格式====================start
    _DM.strDate = function(strDate, s1, s2){
        //以空格进行第一次日期分隔
        var d = strDate.split(" "),
            //年月日的数组
            d1 = d[0],
            //时分秒的数组
            d2 = d[1],
            //分隔年月日为数组
            D1 = d1.split(s1 ||"-"),
            //分隔为时分秒的数组
            D2 = d2.split(s2 || ":");
        return new Date(
            D1[0] || 0,
            D1[1] || 0,
            D1[2] || 1,
            D2[0] || 0,
            D2[1] || 0,
            D2[2] || 0
        )
    }

    //判断日期是闰年还是平年====================start
    _DM.getYearType = function(Y){
        return  this.getMonthDays(Y, 2) == 28 ? "平年" : "闰年" ;
    }

    //日期合法性验证 ====================start
    _DM.verifyDate = function(vDate){
        //验证格式必须为  "YYYY-MM-DD hh:mm:ss" 格式，类似“2014-02-12 16:34:57”
        return /^(\d{4}-\d{2}-\d{2})\s{1}(\d{2}:\d{2}:\d{2})$/.test(vDate);
    }



    //获取ID对象
    _DM.getElement = function(eStr){
        return document.getElementById(eStr);
    }
})(dManage, window, document);
