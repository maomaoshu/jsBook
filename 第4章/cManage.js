/**
 ************************************************************
 * @project 内容管理 (Contents Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2013-12-31
 * @Copyright : BSD License
 ************************************************************
 */

var cManage = cManage || {};

; (function (_CM, window, document, undefined) {

    //初始化一些基本数据
    var _W = window,

        document = _W.document,

        //鼠标在页面上的位置
        _mousepos = {
            "top":0,
            "left":0
        }
        ;

    /********************************
     * 单元行上鼠标悬停提示   start *
     ********************************/
    //参数---e被绑定的节点；tooltipMsg显示信息的节点
    _CM.tooltip = function(e, tooltipMsg){
        //获取被遍历的tr节点对象
        var trE = e.rows,

            //获取被遍历的节点长度
            trLen = trE.length,

            i = 0;
        //遍历被提示的对象
        for(; i < trLen ; i++){
            var trEi = trE[i],
                //获取数据
                dataTooltip = trEi.getAttribute("data-tooltip");

            //如果存在 data-tooltip 数据则绑定响应的事件
            if(dataTooltip){
                //显示提示信息
                trEi.onmousemove = function(event){
                    event = event || _W.event;
                    var _pos = _CM.getMousePoint(event);

                    //修正提示信息的坐标
                    tooltipMsg.innerHTML = this.getAttribute("data-tooltip");
                    _CM.setCss(tooltipMsg,{
                        "left":_pos.left + "px",
                        "top": (_pos.top+18) + "px",
                        //显示信息
                        "display":"inline"
                    })
                }

                //隐藏提示信息
                trEi.onmouseout = function(){
                    //隐藏信息
                    _CM.setCss(tooltipMsg,{
                        "display":"none"
                    })
                }
            }

        }

    }

    /********************************
     * 表格光棒效果           start *
     ********************************/
    _CM.lightBar = function(e){
        var trE = e.rows,

        //获取被遍历的节点长度
            trLen = trE.length,

            i = 0;
        //遍历被提示的对象
        for(; i < trLen ; i++){
            var trEi = trE[i];
                //设置光棒效果的样式
                trEi.onmousemove = function(event){
                    //光棒样式 background-color:#a5e5aa;
                    this.style.backgroundColor = "#a5e5aa";
                }

                //还原初始的样式
                trEi.onmouseout = function(){
                    this.style.backgroundColor = "#fff";
                }

        }

    }

    /********************************
     * 让表单没有凹凸感       start *
     ********************************/
    _CM.cleanConcaveConvex = function(e){
        //设定样式
        e.style.border = "1 solid #000000";
    }

    /********************************
     * 动态插入和删除单元行   start *
     ********************************/

    /*
    * 如果tr存在则是新增操作，否则为删除操作
    * 当为删除操作的时候，参数 --- table为表格的table对象，num为被删除的单元行序列数
    * 当为新增行操作的时候，参数 ---  table为表格的table对象，num是新增单元行的位置，tr为新增行的单元格的字符串型数组，
    * */
    _CM.trAct = function(table, num, tr){

        //如果num不存在则执行删除操作
        if(!tr){
            var _num = table.rows[num];
            //如果被删除的行对象存在，则删除 ，返回true
            if(_num){
                //js的原生函数删除行
                table.deleteRow(_num);
                return true;
            }
            else{
                //如果删除的对象不存在，则删除失败，返回false
                return false;
            }
        }
        else{
            //在指定的位置创建行对象
            var r = table.insertRow(num),
                i = 0,
                //待插入的数据长度
                l = tr.length;
            //遍历待插入数据
            for(; i < l ; i++){
                //插入新单元格数据
                r.insertCell(i).innerHTML = tr[i];
            }

            //新增成功返回 true
            return true;
        }

    }

    /************************************
     * 表格内容的展开和折叠效果   start *
     ************************************/
    _CM.tableOutIn = function(e, type){
        if(type != "open"){
            //隐藏指定的行元素
            e.style.display = "none"
        }
        else{
            //table-row设置此元素会作为一个表格行显示
            e.style.display = "table-row"
        }
    }

    /************************************
     * 表格内容拖拽效果           start *
     ************************************/
     //拖拽绑定
    _CM.drawContent = null;
     //是否开启拖拽
     _CM.drawing = false;
     //开始拖拽的td元素
     _CM.startDrawTd = null;
     //进入到指定td元素
     _CM.drawTd = null;
     //鼠标起始位置
     _CM.startDrawPos = {
         "left" : 0,
         "top" : 0
     };

     //拖拽的所有Td元素
     _CM.drawTds = [];
    //拖拽的所有Td元素个数
     _CM.drawTdsLen = 0;
     _CM.tableDraw = function(table, tableDrawContent){
        _CM.drawContent = tableDrawContent;

        var r = table.rows,
          rl = r.length,
          i = 0,
          c = [],
          cl = 0,
          l = 0;
        for(; i < rl; i++){
         c = r[i].cells;
         cl = c.length;
         l = 0;
          for(; l < cl; l++){
              _CM.drawTds.push(c[l]);
          }
        }
        _CM.drawTdsLen = _CM.drawTds.length;
        _CM.tableDrawing();
     }

    //开启拖拽
    _CM.openTableDraw = function(event){
        event = event || _W.event;
        var _pos = _CM.getMousePoint(event);
        this.drawing = open;
        //起始偏移值
        this.startDrawPos = {
              "left" : _pos.left-this.getAbsoluteLeft(_CM.drawContent),
              "top": _pos.top-this.getAbsoluteTop(_CM.drawContent)
        };
    }

    //关闭拖拽
    _CM.closeTableDraw = function(){
        this.drawing = false;
        _CM.setCss(_CM.drawContent, {
            "left" : "0px",
            "top" : "0px",
            "position" : "static"
        });
        _CM.drawTd.style.backgroundColor = "#fff";
    }

    _CM.tableDrawing = function(){

        _CM.drawContent.onmousedown = function(e){
            _CM.startDrawTd = this.parentNode;
            _CM.openTableDraw(e);
        }
    }

    _CM.bodyTableDrawmoveTd = function(event){
        var i = 0,
            _drawTdsI = null;
        for(; i < _CM.drawTdsLen; i++){
            _drawTdsI = _CM.drawTds[i];
            //检测是否选择当前元素
            if(_CM.pointCheck(event, _drawTdsI)){
                //进入元素
                if(_CM.drawing){
                    //设置选中的元素
                    _CM.drawTd = _drawTdsI;
                }
            }else{
                //恢复没有被选中的颜色
                _drawTdsI.style.backgroundColor = "#fff";
            }
        }
        //被选中的显示颜色
        _CM.drawTd.style.backgroundColor = "#E7AB83";
    }

    //表格拖拽body的move事件
    _CM.bodyTableDrawmove = function(event){
        //获取拖拽对象的坐标
        event = event || _W.event;
        var _pos = _CM.getMousePoint(event);
        //如果不存在被拖拽的对象，禁止拖拽
        if(!_CM.drawContent || !_CM.drawing) return false;

        //进入哪一个td --- 由于拖拽的元素覆盖td，所以事件绑定有碰撞检测担任
        this.bodyTableDrawmoveTd(event);
        //设置元素的位置
        _CM.setCss(_CM.drawContent, {
            "left" : (_pos.left - this.startDrawPos.left) + "px",
            "top" : (_pos.top - this.startDrawPos.top) + "px"
        });

        //修改元素的定位方式
        if(this.drawContent.style.position != "absolute"){
            this.drawContent.style.position = "absolute";
        }

    }
    //表格拖拽body的mouseup事件
    _CM.bodyTableDrawmouseup = function(){
        //如果不存在被拖拽的对象，禁止拖拽
        if(!_CM.drawContent || !_CM.drawTd || !_CM.drawing) return false;
        //设置被拖入的区域为空
        _CM.drawTd.innerHTML = "";
        //将被拖拽的内容追加在拖入的区域元素内
        _CM.drawTd.appendChild(_CM.drawContent);
        //内容替换，防止被拖拽的内容覆盖
        var _html = _CM.startDrawTd.innerHTML;
        if(_html.search("等待被拖入元素") == -1 && _html.search("被拖拽的内容") == -1){
            _CM.startDrawTd.innerHTML = "等待被拖入元素";
        }

        //关闭拖拽
        _CM.closeTableDraw();
    }

    /********************************************
     * 使用js对表格内容进行分页           start *
     ********************************************/

    //当前的页数
    _CM.currentPage = 1;
    //table对象
    _CM.table = null;
    //当前页的UI显示
    _CM.currentPageUi = null;
    //所有页的UI显示
    _CM.allPage = null;
    //模拟后端返回的数据结构，以供分页使用
    _CM.getPageData = function(){
        return [
            [
                "第"+_CM.currentPage+"页内容",
                "第"+_CM.currentPage+"页内容"
            ],
            [
                "第"+_CM.currentPage+"页内容",
                "第"+_CM.currentPage+"页内容"
            ]

        ]
    }
    //模拟所有页数
    _CM.allPages = 5;
    //初始化分页
    _CM.tablePaging = function(args){
        _CM.table = args.tablePaging;
        _CM.currentPageUi = args.currentPage;
        _CM.allPage = args.allPage;

        _CM.nextPaging(args.nextPaging);
        _CM.prevPaging(args.prevPaging);

        this.updateUi();
    }

    //分页的下一页
    _CM.nextPaging = function(e){
        e.onclick = function(){
            _CM.currentPage++;
            //如果页数高于最大页，则修改页数为最大页，并阻止程序流
            if(_CM.currentPage > _CM.allPages){
                _CM.currentPage = _CM.allPages;
                return;
            }
            //更新ui
            _CM.updateUi();
        }
    }

    //分页的上一页
    _CM.prevPaging = function(e){
        e.onclick = function(){
            _CM.currentPage--;
            //如果页数低于1页，则修改页数为1，并阻止程序流
            if(_CM.currentPage < 1){
                _CM.currentPage = 1;
                return;
            }
            //更新ui
            _CM.updateUi();
        }
    }
    //更新表格UI
    _CM.updateUi = function(){
        //更新表格的内容Ui
        this.tableUi();
        //设置当前页数
        _CM.currentPageUi.innerHTML = _CM.currentPage;
        //设置总页数
        _CM.allPage.innerHTML = _CM.allPages;
    }
    //更新当前页数的表格数据
    _CM.tableUi = function(){
        //返回模拟的后台数据
        var d = this.getPageData(),
            _dataI = null,
            l = d.length,
            i = 0;

        //清空表格数据，由于数据结构没变，所有清空数据与插入数据都是2
        for(; i < l; i++) {
            //由于节点的动态改变，不断减少，所以删除的节点永远是第一个
            this.trAct(_CM.table, 0);
        }

        //插入表格数据
        for(i = 0; i < l; i++) {
            _dataI = d[i];
            //调用前几一节的API增加td内容
            this.trAct(_CM.table, 0, [
                _dataI[0],
                _dataI[1]
            ]);
        }

    }

    /********************************************
     * 英文字符串超出元素宽度自动换行     start *
     ********************************************/
    _CM.autoNewline = function(e){
        //初始化接受字符串对象
        var str = "",
            //被切割的字符
            strContent = e.innerHTML,
            //被绑定元素的所有字体宽度
            allWidth = this.getTextWidth(e),
            //每个字体的宽度
            fontWidth = allWidth/strContent.length,
            //每行最多放多少字
            rowWidth = Math.floor(e.offsetWidth/fontWidth);
        //切割字符
        while(strContent.length > rowWidth){
            str+=strContent.substr(0,rowWidth)+"<br />";
            strContent=strContent.substr(rowWidth,strContent.length);
        }
        str+=strContent;
        //设置元素的字符结果
        e.innerHTML=str;

    }

    //获取文字的宽度
    _CM.getTextWidth = function(e){
        //深度克隆文字节点
        e = e.cloneNode(true);
        var textWidth = 0,
            _body = document.body;
        //追加在body元素上
        _body.appendChild(e);
        //设置样式
        this.setCss(e, {
            "width" : "auto",
            "position":"absolute",
            "zIndex":-1
        });
        //获取宽度
        textWidth = e.offsetWidth;
        //释放节点
        _body.removeChild(e);
        //返回文字宽度
        return textWidth;
    }
    /********************************************
     * 内容超过元素宽度显示省略号         start *
     ********************************************/
    _CM.contentApostrophe = function(e){
        var _left = this.getAbsoluteLeft(e),
            _top = this.getAbsoluteTop(e),
            _w = e.offsetWidth;
        e.style.overflow = "hidden";
        //循环节点，比较文字与目标元素的长度，如果文字的长度大于元素宽度，则继续循环处理
        while(this.getTextWidth(e) > _w){
            //提取文字片段
            e.innerHTML = e.innerHTML.substring(0, e.innerHTML.length-4);
            //添加省略号
            e.innerHTML = e.innerHTML + "…";
        }

    }
    /********************************************
     * 调整字体大小           start             *
     ********************************************/

    //参数---e代表被设置元素；unit设置的字大小
     _CM.fontSize = function(e, unit){
         e.style.fontSize = unit;
     }

    /********************************************
     * 实现打字机效果           start           *
     ********************************************/
    //打字的数据库队列
    _CM.typewriterArr = [];
    //打字机的线程是否开启
    _CM.typewritering = false;
    //打字机的线程ID
    _CM.typewriterID = -1;
    //超时调用的时间
    _CM.typewriterTime = 1000;

    //增加显示的元素
    _CM.typewriterEffect = function(e, str, color){
        this.typewriterArr.push({
            //目标元素上下文
            "context" : e,
            //显示的元素
            "str" : str,
            //截取的进度
            "lening":0,
            //最大进度
            "maxLength":str.length
        });
        //设置元素颜色
        e.style.color = color || "#000000";
        //模拟链式调用
        return this;
    }
    //开启间时调用 ， 参数为设置超时调用的时间
    _CM.startTypewriter = function(typewriterTime){
        //如果没有开启，则开启
        if(!this.typewritering){
            _CM.typewriterTime = typewriterTime || _CM.typewriterTime;
            //开始超时调用
            this.typewriterUi();
            //返回链式调用对象
            return this;
        }
        //返回链式调用对象
        return this;
    }
    //关闭间时调用
    _CM.closeTypewriter = function(){
        //清除线程
        clearTimeout(_CM.typewriterID);
        //改变状态
        this.typewritering = false;
        //返回链式调用对象
        return this;
    }
    //间时调用显示Ui
    _CM.typewriterUi = function(){
        var i = 0,
            l = _CM.typewriterArr.length,
            eing = null;
        for(; i < l; i++){
            eing = _CM.typewriterArr[i]
            //判断中英文进行+2或+1操作
            //递增，获取最新截取的长度
            eing.lening++;
            //如果截取的长度超过最大长度，则截取的长度设置为1
            if(eing.lening > eing.maxLength) eing.lening = 0;
            //显示截取的字符
            eing.context.innerHTML = eing.str.substring(0, eing.lening) + "_";
        }
        _CM.typewriterID = setTimeout(_CM.typewriterUi, _CM.typewriterTime);
    }




    /********************************************
     * 文本段落的展开和收拢效果           start *
     ********************************************/

    //参数---context，被绑定操作的元素；out展开的元素；roundin收缩的元素
    _CM.textOutIn = function(options){
        var e = options.e;
        //展开事件
        options.out.onclick = function(){
            if(e.style.height == "") return;
            new animateManage({

                //被操作的元素
                "context" : e,

                "effect":"linear",

                //持续时间
                "time": 100,

                //元素的起始值偏移量
                "starCss":{
                    "height":e.style.height || 35
                },

                //元素的结束值偏移量
                "css" :{
                    "height":203
                }
            }).init();
        }
        //收缩事件
        options.roundin.onclick = function(){
            new animateManage({

                //被操作的元素
                "context" : e,

                "effect":"linear",

                //持续时间
                "time": 100,

                //元素的起始值偏移量
                "starCss":{
                    "height":e.style.height || 203
                },

                //元素的结束值偏移量
                "css" :{
                    "height":35
                }
            }).init();
        }

    }

    /********************************************
     * 关键字的高亮显示           start *
     ********************************************/

    //参数---e代表被绑定的元素，keys关键字数组列表，color设置关键词的高亮颜色
    _CM.keyWordsHighlight = function(e, keys, color){
          var i = 0,
              //关键词的长度
              l = keys.length,
              k = "";
          for(; i < l ; i++){
              //获取关键词的对象
              k = keys[i];
              //替换关键词的数据
              e.innerHTML = e.innerHTML.replace(k, "<span style='color:"+ (color || "#000")+"'>" + k + "</span>")
          }
    }

    /********************************************
     * 字幕上下间歇滚动           start *
     ********************************************/
    //间歇滚动的li元素
    _CM.llis = [];
    //目标元素
    _CM.rollingE = null;
    //滚动的线程ID
    _CM.rollingID = -1;
    //滚动的形式 up/down
    _CM.rolling = "up";
    //初始化滚动层的数据
    _CM.rollingSubtitles = function(e){
        this.rollingE = e;
        //绑定滚动的元素
        this.llis = this.getTypeElement(e.childNodes, "li");
        //当进入滚动层，停止滚动
        e.onmouseover = function(){
            clearInterval(_CM.rollingID);
        }
        //当离开滚动层，开启滚动
        e.onmouseout = function(){
            //根据滚动的形式，选择up/down
            if( _CM.rolling == "down"){
                _CM.downSubtitles();
            } else{
                _CM.upSubtitles();
            }
        }
        return this;

    }
    //向上滚动，参数---manualOperation如果为true，则手动按钮操作
    _CM.upSubtitles = function(manualOperation){
        clearInterval(_CM.rollingID);
        _CM.rolling = "up";
        var up = function(){
            new animateManage({

                //被操作的元素
                "context" : _CM.rollingE,

                "effect":"linear",

                //持续时间
                "time": 200,

                //元素的起始值偏移量
                "starCss":{
                    "marginTop":_CM.rollingE.style.marginTop || 0
                },

                //元素的结束值偏移量
                "css" :{
                    "marginTop": -103
                },
                "callback" : function(){
                    _CM.llis = _CM.getTypeElement(_CM.rollingE.childNodes, "li");
                    _CM.rollingE.style.marginTop = "0px";
                    var cloneE = null;
                    for(var i = 0; i < 4; i++){
                        cloneE =  _CM.llis[i].cloneNode(true);
                        _CM.rollingE.removeChild(_CM.llis[i]);
                        _CM.rollingE.appendChild(cloneE);
                    }

                }
            }).init();
        }
        if(manualOperation){
            up();
        }
        _CM.rollingID = setInterval(function(){
            up();
        }, 3000)
    }

    //向下滚动，参数---manualOperation如果为true，则手动按钮操作
    _CM.downSubtitles = function(manualOperation){
        clearInterval(_CM.rollingID);
        _CM.rolling = "down";
        var down = function(){
            _CM.llis = _CM.getTypeElement(_CM.rollingE.childNodes, "li");
            //获取最大循环位置
            var len = _CM.llis.length - 1,
                //获取最小循环位置
                l = len - 4,
                //克隆的li对象
                cloneE = null;
            //在最大li逆向循环   ，补齐节点
            for(var i = len; i > l; i--){
                //动态获取每次变更的li
                _CM.llis = _CM.getTypeElement(_CM.rollingE.childNodes, "li");
                //克隆节点
                cloneE =  _CM.llis[len].cloneNode(true);
                //删除原有的节点
                _CM.rollingE.removeChild(_CM.llis[len]);
                //在新的0点位置，插入节点
                _CM.rollingE.insertBefore(cloneE,_CM.llis[0]);

            }
            _CM.rollingE.style.marginTop = "-103px";
            new animateManage({

                //被操作的元素
                "context" : _CM.rollingE,

                "effect":"linear",

                //持续时间
                "time": 200,

                //元素的起始值偏移量
                "starCss":{
                    "marginTop":_CM.rollingE.style.marginTop || 0
                },

                //元素的结束值偏移量
                "css" :{
                    "marginTop": -2
                },
                "callback" : function(){

                }
            }).init();
        }
        if(manualOperation){
             down();
        }
        _CM.rollingID = setInterval(function(){
            down();
        }, 3000)
    }
    /********************************************
     * 弹出层           start *
     ********************************************/
    _CM.setPopup = function(e, openPop, closePop){
        this.setCss(e, {
            "position":"absolute",
            "zIndex":100,
            "backgroundColor":"#EBEDF3"
        });
        openPop.onclick = function(){
            e.style.display = "block";
            //修改弹出层的位置，将其定位于屏幕的可见区域中间位置
            _CM.setCss(e, {
                "left": "50%" ,
                "marginLeft": -e.offsetWidth/2 + "px",
                "top":((document.body.scrollTop || document.documentElement.scrollTop) + window.screen.availHeight/2- e.offsetHeight) + "px"
            });
        }

        closePop.onclick = function(){
            e.style.display = "none";
        }
    }
    /********************************************
     * 层模拟的提示消息框           start *
     ********************************************/
    _CM.promptMsgBox = function(options){
        //获取元素
        var e =  options.promptMsgBox;
        //初始化基本样式
        this.setCss(e, {
            "position":"absolute",
            "zIndex":100,
            "top":((document.body.scrollTop || document.documentElement.scrollTop) + window.screen.availHeight/2- e.offsetHeight) + "px",
            "backgroundColor":"#EBEDF3"
        });
        //打开确认按钮
        options.promptMsgBoxOpen.onclick = function(){
            e.style.display = "block";
            //设置位置
            _CM.setCss(e, {
                "left": "50%" ,
                "marginLeft": -e.offsetWidth/2 + "px",
                //计算目标元素的top值：（页面的整体高度） 减去 （文档可见的高一半度） 减去 （元素的一半高度）
                "top":((document.body.scrollTop || document.documentElement.scrollTop) + window.screen.availHeight/2- e.offsetHeight) + "px"
            });
        }
        //确认按钮
        options.promptMsgBoxAgree.onclick = function(){
            //隐藏层
            e.style.display = "none";
            //如果存在确认的回调，则执行
            if(options.agreeCallBack) options.agreeCallBack();
        }
        //取消按钮
        options.promptMsgBoxCancel.onclick = function(){
            //隐藏层
            e.style.display = "none";
            //如果存在取消的回调，则执行
            if(options.cancelCallBack) options.cancelCallBack();
        }
    }
    /********************************************
     * 隐藏层           start *
     ********************************************/
    _CM.hide = function(e){
        e.style.display = "none";
    }
    /********************************************
     * 用层实现滚动条           start *
     ********************************************/

    //是否开启滚动
    _CM.isScrollBar = false;

    //拖拽的修正值
    _CM.scrollBarLeft = 0;

    //left最大拖拽值
    _CM.scrollBarMaxLeft = 0;

    //被拖拽的滚轴元素的对象
    _CM.scrollBarObj = null;

    //被拖动的内容元素
    _CM.scrollBarContent = null;

    //转换比例
    _CM.scrollBarScale = 1;

    //初始化滚动条
    _CM.scrollBar = function(options){
        var _parent = options.scrolling.parentNode,
            parentWidth = _parent.offsetWidth,
            contentWidth = options.contentScroll.scrollWidth,
            _scrolling = options.scrolling,
            _scale = _CM.scrollBarScale =parentWidth / contentWidth,
            _scrollingWidth = parentWidth * _scale;

        //初始化内容元素对象
        _CM.scrollBarContent = options.contentScroll;

        //初始化变量差值
        _CM.scrollBarObj = _scrolling;

        //初始化滚动条长度
        _scrolling.style.width = _scrollingWidth + "px";

        //初始化最大left值
        _CM.scrollBarMaxLeft = _CM.getAbsoluteLeft(_parent) + _parent.offsetWidth - _scrolling.offsetWidth -10;

        //开启滚动
        _scrolling.onmousedown = function(event){
            //获取拖拽对象的坐标
            event = event || _W.event;
            var _pos = _CM.getMousePoint(event);
            _CM.isScrollBar = true;
            _CM.scrollBarLeft = _pos.left - _CM.getAbsoluteLeft(this);
        }

    }

    //关闭滚动条
    _CM.closeScrollBar = function(){
        _CM.isScrollBar = false;
    }

    //移动滚动条
    _CM.moveScrollBar = function(event){
        //如果开启滚轴
        if(_CM.isScrollBar){
            //获取拖拽对象的坐标
            event = event || _W.event;
            var _pos = _CM.getMousePoint(event),
                _left = _pos.left - _CM.scrollBarLeft,
                cLeft = _left;
            if(_left < 0) {
                _left = 0;
                cLeft = 0;
            }
            //如果滚轴的left坐标大于最大值则修正
            if(_left > _CM.scrollBarMaxLeft) _left = _CM.scrollBarMaxLeft;

            if(cLeft > _CM.scrollBarMaxLeft + 10 ) cLeft = _CM.scrollBarMaxLeft + 10;

            //设置滚轴层的left
            _CM.scrollBarObj.style.left = _left + "px";

            //设置内容层left变化
            _CM.scrollBarContent.style.left = -1 * cLeft / _CM.scrollBarScale + "px"
        }
    }

    /********************************************
     * 让层可以随意拖动           start *
     ********************************************/
     _CM.drawElement = null;

     //是否可拖动元素
     _CM.isDrawElement = false;

     //鼠标按下的初始差值
     _CM.startMousePos = {
         "left" : 0,
         "top" : 0
     }
     //绑定要滚动的元素
     _CM.bindDrawElement = function(e){
         _CM.drawElement = e;
         var absoluteLeft = this.getAbsoluteLeft(e),
             absoluteTop = this.getAbsoluteTop(e);
         //初始化样式
         this.setCss(e, {
             //设置为绝对定位
              "position" : "absolute",
              "left" : absoluteLeft + "px",
              "top" : absoluteTop+ "px",
              "cursor" : "move",
              "zIndex" : 101
         });
         e.onmousedown = function(event){
             event = event || _W.event;
             var _pos = _CM.getMousePoint(event);
             //开启移拖拽
             _CM.isDrawElement = true;
             //设置差量，方便修正坐标
             _CM.startDrawPos = {
                 "left" : _pos.left - _CM.getAbsoluteLeft(this),
                 "top" : _pos.top - _CM.getAbsoluteTop(this)
             }
         }

         e.onmouseup = function(){
             _CM.isDrawElement = false;
         }
     }

    //拖动元素
    _CM.moveDraw = function(event){
        //如果开启滚轴
        if(_CM.isDrawElement){
            //获取拖拽对象的坐标
            event = event || _W.event;
            var _pos = _CM.getMousePoint(event);
            _CM.setCss(_CM.drawElement, {
                "left": (_pos.left - _CM.startDrawPos.left) + "px",
                "top": _pos.top - _CM.startDrawPos.top + "px"
            })

        }
    }
    /********************************************
     * 遮罩层效果           start *
     ********************************************/
     _CM.maskLayer = function(e){
         var b =  document.body.parentNode;
         //初始化遮罩的样式
         this.setCss(e, {
             "position":"absolute",
             "left":"0px",
             "display":"block",
             "top":"0px",
             "zIndex":1000,
             "backgroundColor":"#ccc",
             "height":  b.scrollHeight + "px",
             "width": b.offsetWidth + "px",
             /*为了兼容各种浏览器的透明层效果*/
             "filter":"alpha(Opacity=60)",
             "opacity" : "0.6",
             "-moz-opacity":"0.6",
             "filter": "progid:DXImageTransform.Microsoft.Alpha(Opacity=60)",
             "-MS-filter":"progid:DXImageTransform.Microsoft.Alpha(Opacity=60)"
         })
     }
    /********************************************
     * Tab选项卡切换           start *
     ********************************************/
     _CM.tabSwitch = function(e){
         var divs = this.getTypeElement(e.childNodes, "div"),
             l = divs.length,
             i = 0;
         for(; i < l;i++){
             divs[i].onclick = function(){
                for(var ii = 0; ii < l; ii++){
                    //删除选项卡的边框
                    divs[ii].className = "";
                    //隐藏内容
                    _CM.getElement("tabSwitch" + (ii+1)).style.display = "none";
                }
                //设置当前元素的选中样式
                this.className = "on";
                //获取指定内容的对象，并显示
                _CM.getElement(this.getAttribute("data-targent")).style.display = "block";
             }
         }
     }
    /********************************************
     * 对联浮动广告           start *
     ********************************************/
    _CM.coupletAdsLeft = null;
    _CM.coupletAdsRight = null;
    _CM.coupletAds = function(absLeft, absRight){
        this.coupletAdsLeft = absLeft;
        this.coupletAdsRight = absRight;

        this.coupletAdsLeft.style.display = "block";
        this.coupletAdsRight.style.display = "block";
        this.absTop();
    }
    //两个对联层的top位置
    _CM.absTop = function(){
        if(!this.coupletAdsLeft) return;
        //如果 document.body.scrollTop == 0 选则document.documentElement.scrollTop值，
        var top = ((document.body.scrollTop || document.documentElement.scrollTop) + window.screen.availHeight/2 - this.coupletAdsLeft.offsetHeight) + "px";
        this.coupletAdsLeft.style.top = top;
        this.coupletAdsRight.style.top = top;
    }

    _CM.scrollEvent = (function(){
        window.onscroll = function(){
            _CM.absTop();
            _CM.QQMsgTop();
        }
    })();
    /********************************************
     * 类似QQ消息窗口提示           start *
     ********************************************/
    _CM.QQMsgE = null;
    _CM.QQMsgTop = function(){
         if(_CM.QQMsgE && _CM.QQMsgE.style.display != "none"){
             var bodyHeight = (document.body.scrollTop || document.documentElement.scrollTop)  + window.screen.availHeight;
             this.setCss(_CM.QQMsgE, {
                 "top": (bodyHeight - 260) + "px",
                 "left": "100%",
                 "marginLeft":"-244px"
             });
         }
    }
    _CM.QQMsg = function(e, closeQQMsg){
        _CM.QQMsgE = e;
        //top的值 = 滚轴的高度top+窗口的高度 ，目的是隐藏窗口
        var bodyHeight = (document.body.scrollTop || document.documentElement.scrollTop)  + window.screen.availHeight;
        _CM.QQMsgE.style.display = "block";
        this.setCss(_CM.QQMsgE, {
            "top": bodyHeight+ "px",
            "left": "100%",
            "marginLeft":"-244px"
        });
        new animateManage({

            //被操作的元素
            "context" : e,

            "effect":"linear",

            //持续时间
            "time": 200,

            //元素的起始值偏移量
            "starCss":{
                "top": bodyHeight
            },

            //元素的结束值偏移量
            "css" :{
               "top": bodyHeight - 260
            },
            "callback" : function(){

            }
        }).init();
        closeQQMsg.onclick = function(){

            new animateManage({

                //被操作的元素
                "context" : e,

                "effect":"linear",

                //持续时间
                "time": 200,

                //元素的起始值偏移量
                "starCss":{
                    "top": bodyHeight - 260
                },

                //元素的结束值偏移量
                "css" :{
                    "top": bodyHeight
                },
                "callback" : function(){
                    e.style.display = "none";
                }
            }).init();
        }

    }
    /********************************************
     * 修改浏览器title           start *
     ********************************************/
    //绑定换行的元素
     _CM.titleNewline = function(e){
         document.title =  e.getAttribute("data-title");
     }
    /********************************************
     * 打开链接时弹出确认框           start *
     ********************************************/
    _CM.linkConfirmation = function(e){
        e.onclick = function(){
            if(window.confirm(e.getAttribute("data-msg"))){
                window.open(e.getAttribute("data-target"));
            }
        }

    }
    /********************************************
     * 删除时弹出确认对话框           start *
     ********************************************/
    _CM.deleteConfirmation = function(e){
        e.onclick = function(){
            if(_CM.getElement("deleteElement")){
                if(window.confirm(e.getAttribute("data-msg"))){
                    document.body.removeChild(_CM.getElement("deleteElement"));
                    alert("删除成功！");
                }
            }else{
                alert("元素已经删除过！");
            }

        }

    }











    //body 事件 ，将所有的body事件都放在一个函数内---拖拽事件、
    _CM.bodyEvents = function(){

        document.body.onmousemove = function(e){
            //表格内容拖拽效果
            _CM.bodyTableDrawmove(e);
            //用层实现滚动条
            _CM.moveScrollBar(e);
            //让层可以随意拖动
            _CM.moveDraw(e);
        }

        document.body.onmouseup = function(e){
            _CM.bodyTableDrawmouseup(e);
        }

        document.onmouseup = function(e){
            _CM.closeScrollBar(e);
        }
    };

    //获取元素的绝对left
    _CM.getAbsoluteLeft = function (_e){
        var _left = _e.offsetLeft,
            _current = _e.offsetParent;
        while (_current !== null){
            _left += _current.offsetLeft;
            _current = _current.offsetParent;
        }
        return _left;
    }

    //获取元素的绝对top
    _CM.getAbsoluteTop = function (_e){
        var _top = _e.offsetTop,
            _current = _e.offsetParent;
        while (_current !== null){
            _top += _current.offsetTop;
            _current = _current.offsetParent;
        }
        return _top;
    }

    //获取ID对象
    _CM.getElement = function(eStr){
        return document.getElementById(eStr);
    }

    //设置元素样式
    _CM.setCss = function(_this, cssOption){
        if ( !_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ) {
            return;
        }
        for(var cs in cssOption){
            _this.style[cs] = cssOption[cs];
        }
        return _this;
    }

    //获取指定类型的节点
    _CM.getTypeElement = function(es, type){
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

    /**
     * 获取鼠标在页面上的位置
     * _e		触发的事件
     * left:鼠标在页面上的横向位置, top:鼠标在页面上的纵向位置
     */
    _CM.getMousePoint = function (_e) {
        var _body = document.body,
            _left = 0,
            _top = 0
            ;
        //浏览器支持 pageYOffset, 那么可以使用pageXOffset 和 pageYOffset 获取页面和视窗之间的距离
        if(typeof window.pageYOffset != 'undefined') {
            _left = window.pageXOffset;
            _top = window.pageYOffset;
        }
        //如果浏览器指定了DOCTYPE并且支持compatMode
        else if(typeof document.compatMode != 'undefined' && document.compatMode != 'BackCompat') {
            _left = document.documentElement.scrollLeft;
            _top = document.documentElement.scrollTop;
        }
        //其他的如果浏览器支持document.body
        else if(typeof _body != 'undefined') {
            _left = _body.scrollLeft;
            _top = _body.scrollTop;
        }

        _left += _e.clientX;
        _top += _e.clientY;

        _mousepos.left = _left;
        _mousepos.top = _top;

        return _mousepos;
    }

    //碰撞检测
    _CM.pointCheck = function(_event,_e, options){
        var _pos = _CM.getMousePoint(_event),
        //获取元素的宽度
            _w = options && options.width || _e.offsetWidth,
        //获取元素的高度
            _h = options && options.height || _e.offsetHeight
        _left = _CM.getAbsoluteLeft(_e),
            _top = _CM.getAbsoluteTop(_e)
        ;
        _pos.left += options && options.left || 0;
        //计算鼠标的top与left值，是否落入元素的left与top内即可
        if(_pos.left < (_left+_w) && _left < _pos.left && _pos.top > _top && _pos.top < (_top+_h)){
            return true;
        }
        return false;
    }

})(cManage , window, document);
