/**
 ************************************************************
 * @project 图片管理 (Image Manage)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2013-12-18
 * @Copyright : BSD License
 ************************************************************
 */

var iManage = iManage || {};

; (function (_IM, window, document, undefined) {

    //初始化一些基本数据
    var _W = window,

        document = _W.document,

        //鼠标在页面上的位置
        _mousepos = {
            "top":0,
            "left":0
        }
        ;
    /******************************
     * 动画管理   start  *
     *******************************/

    _IM.animate = function(option){
        return new animateManage(option);
    }

    /******************************
     * 实时预览上传图片    start  *
     *******************************/

    _IM.upPreviewImg = function(options){
        var _e = options.e,
            preloadImg = null;
        _e.onchange = function(){
            var _v = this.value,
                _body = document.body;

               //图片正则
               picReg = /(.JPEG|.jpeg|.JPG|.jpg|.GIF|.gif|.BMP|.bmp|.PNG|.png){1}/;

            //简单的图片格式验证
            if(!picReg.test(_v)){
               alert("请选择正确的图片格式");
               return false;
            }

            //不支持FileReader
            if(typeof FileReader == 'undefined'){
                if(this.file){
                    options.previewImgSrc.setAttribute("src", this.file.files[0].getAsDataURL());
                    options.previewImgSrc.style.display = "block";
                }
                else if(_IM.isIE6()){
                    //ie6支持
                    options.previewImgSrc.setAttribute("src", _v);
                    options.previewImgSrc.style.display = "block";
                }
                else{
                    /*ie7、ie8等支持 filters滤镜的浏览器
                    * 为了去除图片默认的icon采用Data URI 与 MHTML技术接口，修改默认的图片
                    * AlphaImageLoader 滤镜 ---filter : progid:DXImageTransform.Microsoft.AlphaImageLoader ( enabled=bEnabled , sizingMethod=sSize , src=sURL )
                    * Data URI --- RFC 2397定义的一种把小文件直接嵌入文档的方案,格式：data:[<MIME-type>][;base64],<data>，注意ie6/7不支持Data URI
                    * MHTML --- RFC 2557定义的把一个多媒体的页面所有内容都保存到同一个文档解决方案
                    * */

                     /*
                     Content-Type: multipart/related; boundary="_CLOUDGAMER"

                     --_CLOUDGAMER
                     Content-Location:blankImage
                     Content-Transfer-Encoding:base64

                     R0lGODlhAQABAJEAAAAAAP///////wAAACH5BAEAAAIALAAAAAABAAEAAAICVAEAOw==
                     */

                    /*
                     * 为了防止路径中有“)”，“%”这类字符，直接拼接到滤镜字符串中会出现一些sql注入的问题，所以进行escape编码
                     */
                    _v = _v.replace(/[)'"%]/g, function(str){ return escape(escape(str)); });
                    _IM.setCss(options.previewImgSrc, {
                        "filter":"progid:DXImageTransform.Microsoft.AlphaImageLoader(sizingMethod='scale',src=\"" + _v + "\")",
                        "display":"block"
                    });
                    options.previewImgSrc.setAttribute("src", ( _IM.isIE6() || _IM.isIE7() ? "!blankImage" :
                    "data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw=="));

                }


            }

            //支持FileReader
            else{

                /*
                * 调用FileReader 文件API的readAsDataURL，启动异步加载文件的数据，通过监听reade的onload事件，
                * 等待数据加载完毕后，在回调函数onload事件中，通过reader的result属性即可获得图片文件的相关内容
                * */
                var reader = new FileReader(),

                    //读取被加载的文件对象
                    _file = this.files[0];

                //监听load事件
                reader.onload = (function(file) {
                    return function() {
                        options.previewImgSrc.setAttribute("src", this.result);
                        options.previewImgSrc.style.display = "block";
                    };
                })(_file);

                //监听文件读取的错误处理
                reader.onerror = function(){
                    alert("文件读取数据出错");
                }

                //读取文件内容···
                reader.readAsDataURL(_file);
            }
        }
    }

    /***************************************
     * 鼠标移入移出，改变图片样式   start  *
     ***************************************/

    _IM.imgChangeStyle = function(e){
        e.onmouseover = function(){
             _IM.setCss(this, {
                  border:"2px solid red"
             })
        }

        e.onmouseout = function(){
            _IM.setCss(this, {
                border:"0px"
            })
        }
    }


    /******************************
    * 移动鼠标图片放大镜   start  *
    *******************************/

    //是否移动焦点
    _IM.isMoveFocus  = false;

    //焦点对象
    _IM.focusElement  = null;

    //放大镜
    _IM.magnifierElement  = null;

    //放大镜宽度
    _IM.magnifierWidth  = 800;

    //焦点的Z轴
    _IM.focusZindex  = 100;

    //比例尺
    _IM.magnifierScale = 0;


    //放大镜的Z轴
    _IM.magnifierZindex  = 101;

    //放大镜的对象
    _IM.eMagnifierMages  = null;

    //焦点的面积
    _IM.focusArae ={
        "width":50,
        "height":50
    }

    //初始化图片管理相关元素
    _IM.initMagnifierMages = function(_e){
        /*
         * 初始化放大镜效果的一些数据
         * */
        //焦点对象
        _IM.focusElement  = _IM.setCss(_IM.getElement("focusPoint"), {
            "z-index":_IM.focusZindex,
            "width":_IM.focusArae.width,
            "height":_IM.focusArae.height
        });

        _IM.initMagnifierPos(_e);

        //比例尺换算
        _IM.magnifierScale =  _IM.magnifierWidth / _e.offsetWidth;

        //设置大图
        var _img = _e.getAttribute("data-maxImg");
        _IM.getElement("magnifierImg").setAttribute("src", _img);

    }

    //放大镜业务处理
    _IM.mouseMagnifier = function(_e){

        //初始化图片管理的的元素
        this.initMagnifierMages(_e);

        //移动
        this.eMagnifierMages = _e;

    }

    _IM.bodyMagnifiermousemove  =  function(event){
        var _event = _event || window.event,
            _e = _IM.eMagnifierMages;
        if(_IM.pointCheck(_event, _e)){
            _IM.isMoveFocus = true;
            _IM.focusStatus();

            //是否关闭放大镜效果
            if(!_IM.isMoveFocus) return;

            //计算焦点的位置
            _IM.focusPos(_e, _event);

            //显示放大镜效果
            _IM.magnifierPos(_e, _event);
        }else{
            _IM.isMoveFocus = false;
            _IM.focusStatus();
        }
    }

    //计算聚焦点位置
    _IM.focusPos = function(_e, _event){
        var _pos = _IM.getMousePoint(_event),
            _top = _pos.top - _IM.focusArae.height/2,
            _left = _pos.left - _IM.focusArae.width/2
            ;
        _IM.setCss(_IM.focusElement, {
            "top" : _top,
            "left" : _left
        })
    }

    //焦点的状态
    _IM.focusStatus = function(){
        _IM.isMoveFocus &&
        (_IM.setCss(_IM.focusElement, {
            "display":"block"
        }) && _IM.setCss(_IM.magnifierElement, {
            "display":"block"
        })) || (_IM.setCss(_IM.focusElement, {
            "display":"none"
        }) && _IM.setCss(_IM.magnifierElement, {
            "display":"none"
        }));
    }

    //初始化放大镜位置
    _IM.initMagnifierPos = function(_e){
        //放大镜位置初始化
        _IM.magnifierElement  = _IM.setCss(_IM.getElement("magnifier"), {
            "z-index":_IM.magnifierZindex,
            "top":_IM.getAbsoluteTop(_e),
            "left":_IM.getAbsoluteLeft(_e) + _e.offsetWidth + _IM.focusArae.width
        });
    }

    //计算放大镜中图片位置
    _IM.magnifierPos = function(_e, _event){
            var _pos = _IM.getMousePoint(_event),
                _top = _IM.magnifierScale * ( _pos.top - _IM.getAbsoluteTop(_e) -_IM.focusArae.height/2),
                _left = _IM.magnifierScale * ( _pos.left - _IM.getAbsoluteLeft(_e) - _IM.focusArae.width/2)
                ;
            if(_top < 0 || _left < 0) return;
            _IM.setCss(_IM.getElement("magnifierImg"), {
                "top":"-"+_top,
                "left":"-"+_left
            });

    }

    /******************************
     * 点击图片缓缓放大      start  *
     *******************************/

    _IM.slowlyEnlarge = function(e){
        e.onclick = function(){
            if(e.offsetWidth + 50 >= 300){
                return;
            }
            new animateManage({

                //被操作的元素
                "context":e,

                "effect":"linear",

                //持续时间
                "time": 200,

                //元素的起始值偏移量
                "starCss":{
                    "width": e.offsetWidth
                },

                //元素的结束值偏移量
                "css" :{
                    "width":e.offsetWidth + 50
                }
            }).init();
        }
    }


    /******************************
     * 水中倒影效果        start  *
     *******************************/

    //初始化
    _IM.shadows = null;
    _IM.shadowsLen = 0;
    _IM.shadowInWater = function(_o){
        //水中倒影效果
        this.shadowsSource = _o;
        this.shadows = this.getElement(_o.getAttribute("data-water"));

        //ie
        if (_IM.isIE()) {
            this.updateShadow();
            return;
        }
        //非ie
        else{
            _IM.canvasShadowInWater();
        }
    };

    //IE 动态更新倒影视图
    _IM.updateShadow = function(){
        if(_IM.isIE6()){
            return;
        }
        iManage.shadows.filters.wave.phase+=10;
        setTimeout("iManage.updateShadow()", 150);
    };

    //canvas的水中倒影
    _IM.canvasShadowInWater = function(){
        //（1）配置及初始化数据，创建canvas
        var settings = {
            //速度
            'speed':    1,
            //比例
            'scale':    1,
            //波幅度
            'waves':    10
            },
            waves = settings['waves'],
            speed = settings['speed']/ 4,
            scale = settings['scale']/ 2,
            ca = document.createElement('canvas'),

            //获取画布的句柄
            c = ca.getContext('2d'),
            img = iManage.shadowsSource;
        //canvas覆盖源图片
        img.parentNode.insertBefore(ca, img);

        var w,
            h,
            dw,
            dh,
            offset = 0,
            frame = 0,

            //最大数据帧率
            max_frames = 0,

            //图片的帧数据
            frames = [];

            c.save();

            c.canvas.width  = iManage.shadowsSource.offsetWidth;

            //因为要基于原图，进行倒影投射，所以必须是原图的2倍高度
            c.canvas.height = iManage.shadowsSource.offsetHeight*2;

            /*
            *绘制图形 --- context.drawImage(img,sx,sy,sw,sh,x,y,w,h)
            *（必须）img要使用的图片、视频、画布
            *（可选）sx开始剪切的x坐标
            *（可选）sy开始剪切的y坐标
            *（可选）sw被剪切图形的宽度
            *（可选）sh被剪切图形的高度
            *（必须）x在画布上放置图形的x位置
            *（必须）y在画布上放置图形的y位置
            *（可选）w将要使用图形的宽度
            *（可选）h将要使用图形的高度
            *在画布上绘制原图
            * */
            c.drawImage(iManage.shadowsSource, 0,  0);

            //垂直镜像转换
            c.scale(1, -1);

            c.drawImage(iManage.shadowsSource, 0,  -iManage.shadowsSource.offsetHeight*2);


            //返回之前保存过的路径状态和属性
            c.restore();

            w = c.canvas.width;
            h = c.canvas.height;
            dw = w;
            dh = h/2;

            /*
            * 复制画布上指定的矩形的像素数据 --- context.getImageData(x,y,w,h);
            * 以左上角为（0，0）原点
            * x代表开始的x位置
            * y代表开始的y位置
            * w欲复制的矩形区域宽度
            * h欲复制的矩形区域高度
            * 在被创建的第一个原图的基础上，进行绘制倒影的形象
            * */
            var id = c.getImageData(0, h/2, w, h).data,
                end = false;

            //状态保存起来
            c.save();
            //预先计算缓存的帧
            while (!end) {
                var odd = c.getImageData(0, h/2, w, h),
                    od = odd.data,
                    pixel = 0;
                for (var y = 0; y < dh; y++) {
                    for (var x = 0; x < dw; x++) {
                        var displacement = (scale * 10 * (Math.sin((dh/(y/waves)) + (-offset)))) | 0,
                            j = ((displacement + y) * w + x + displacement)*4;

                        // 修复倒影与原图的水平线闪烁问题
                        if (j < 0) {
                            pixel += 4;
                            continue;
                        }

                        // 修复边缘波纹问题
                        var m = j % (w*4);
                        var n = scale * 10 * (y/waves);
                        if (m < n || m > (w*4)-n) {
                            var sign = y < w/2 ? 1 : -1;
                            od[pixel]   = od[pixel + 4 * sign];
                            od[++pixel] = od[pixel + 4 * sign];
                            od[++pixel] = od[pixel + 4 * sign];
                            od[++pixel] = od[pixel + 4 * sign];
                            ++pixel;
                            continue;
                        }
                        //水影阵列计算
                        if (id[j+3] != 0) {
                            od[pixel]   = id[j];
                            od[++pixel] = id[++j];
                            od[++pixel] = id[++j];
                            od[++pixel] = id[++j];
                            ++pixel;
                        } else {
                            od[pixel]   = od[pixel - w*4];
                            od[++pixel] = od[pixel - w*4];
                            od[++pixel] = od[pixel - w*4];
                            od[++pixel] = od[pixel - w*4];
                            ++pixel;
                        }
                    }
                }

                if (offset > speed * (6/speed)) {
                    offset = 0;
                    max_frames = frame - 1;
                    // frames.pop();
                    frame = 0;
                    end = true;
                } else {
                    offset += speed;
                    frame++;
                }
                frames.push(odd);
            }

        //隐藏原图
        _IM.setCss(iManage.shadows, {
            "display":"none"
        })
        _IM.setCss(iManage.shadowsSource, {
            "display":"none"
        })

        //返回上一个状态
        c.restore();

        //更新视图
        setInterval(function() {
            c.putImageData(frames[frame], 0, h/2);
            // c.putImageData(frames[frame], 0, h/2);
            if (frame < max_frames) {
                frame++;
            } else {
                frame = 0;
            }
        }, 50);
    }

    /******************************
     *图片轮播 --横向        start*
     *******************************/
     _IM.horizontalShuffling = function(options){
         var e = options.e;
         var child = this.getTypeElement(e.childNodes, "li"),
             childLen = child.length,
             w = 300,
             _w = childLen * w;

        //初始化样式
         this.setCss(e, {
             "width": _w
         });

         //节点移动
         var move = function(type, callback){
             var v = 0,
                 _left = parseInt((e.style.left || e.offsetLeft), 10);
             //向左移动
             if(type == "l"){
                v = w;
                if(_left <= -(_w-w)){
                    return ;
                }
             //向右移动
             } else{
                 v = -w;
                 if(_left >= 0){
                     return;
                 }

             }
             //防止产生不是300的整数，导致横向轮播不准确
             var __left = Math.ceil((_left - v)/300)*300;

             //修正左偏向值
             if(__left > 0){
                 __left = 0;
             }
             new animateManage({

                 //被操作的元素
                 "context":e,

                 "effect":"linear",

                 //持续时间
                 "time": 200,

                 //元素的起始值偏移量
                 "starCss":{
                     "left":_left
                 },

                 //元素的结束值偏移量
                 "css" :{
                     "left":__left
                 },
                 "callback":function(){
                     callback && callback();
                 }
             }).init();
         }
         //横向轮播 ，间时调用
         var direction = "l",
             horizontalID = -1,
             closeHorizontal = function(){
                 horizontalID != -1 && clearInterval(horizontalID);
             },
             openHorizontal = function(){
                 horizontalID = setInterval(function(){//循环调用
                     var _left = parseInt((e.style.left || e.offsetLeft), 10);
                     if(_left == -(_w-w)){
                         direction = "r";
                     }
                     if(_left == 0){
                         direction = "l";
                     }
                     move(direction);
                 }, 2000)
             };
         openHorizontal();
         options.left.onclick = function(){
             move("l");
         }

         options.left.onmouseover = function(){
             closeHorizontal();
         }

         options.left.onmouseout = function(){
             openHorizontal();
         }

         options.right.onclick = function(){
             move("r");
         }

         options.right.onmouseover = function(){
             closeHorizontal();
         }

         options.right.onmouseout = function(){
             openHorizontal();
         }



     }

    /*******************************
     * 图片层叠轮播          start *
     *******************************/

    //左侧数据图片堆叠
    _IM.leftPics = [],

    //右侧数据图片堆叠
    _IM.rightPics = [],

    _IM.cascadingShuffling = function(_options){
             //获取指定的节点数据
        var child = this.getTypeElement(_options.e.childNodes, "li"),

            //待缓存的一份初始化的数据 ,用于轮播层叠元素更新位置用
            _child = [],

            //节点个数
            childlen = child.length,

            i = 0,

            //距左边的基准参考值
            baseLeft = 220,

            //中心界点值
            center = Math.floor((childlen-1)/2),

            //自由变量基准
            vt = 50,

            cvt = center * vt,

            //中间的图片
            centerPic = null;

        //左、右及中间的堆叠数据初始化
        for(; i < childlen ; i++){
            var childI = child[i];

            if(i === 0){
                centerPic = child[i];
                _child[i] =
                {"style":{
                    "left":baseLeft + center*vt,
                    "top" : (childI.offsetTop-vt),
                    "zIndex":childlen
                }};
            }else if(i <= center){
                _IM.leftPics.push(child[i]);
                _child[i] =  {"style":{
                    "left":baseLeft +  cvt - vt*i,
                    "top" : (childI.offsetTop-vt*(childlen - i)/childlen),
                    "zIndex":center - i
                }};
            }else{
                _IM.rightPics.push(child[i]);
                _child[i] =  {"style":{
                    "left":baseLeft +  cvt + vt*(i - center),
                    "top" : (childI.offsetTop-vt*(childlen - i + center)/childlen),
                    "zIndex":childlen - (i - center)
                }};
            }

        }

       //ui动画变换 参数---target为被变换的元素，_target变换的目标属性
       var updateUI = function(target,_target, callback){
           //动画管理测试，点击元素会触发闪烁式动画
           new animateManage({

                   //被操作的元素
                   "context":target,

                   "effect":"linear",

                   //持续时间
                   "time": 200,

                   //元素的起始值偏移量
                   "starCss":{
                       "left":target.style.left || target.offsetLeft,
                       "top":target.style.top || target.offsetTop,
                       "zIndex":target.style.zIndex
                   },

                   //元素的结束值偏移量
                   "css" :{
                       "left":_target.style.left || target.offsetLeft,
                       "top":_target.style.top || target.offsetTop,
                       "zIndex":_target.style.zIndex
                   },
                   "callback":function(){
                       callback && callback();
                   }
               }).init();

       }

        /*
        *所有的元素层叠变换
        * o1：参考对象1，当o1为_IM.leftPics，方向向左旋转
        * o2：参考对象2
        * type：与前面的第一个参数对应，当o1 为 _IM.leftPics的时候，对应的值必须为l，反之为"r"
        * */
        var  rotate = function(o1, o2, type){
            type = type || "l";
            o1.unshift(centerPic);
            var li = 0,
                leftLen = o1.length-1
                _center = type == "r" && (center) || 0;
            for(; li < leftLen ; li++){
                if(li == 0){
                    updateUI(o1[li],  _child[1+_center]);

                }else{
                    updateUI(o1[li], _child[li+1+_center]);
                }
            }
            o2.push(o1.pop());
            var ri = o2.length-1;
            for(; ri >= 0 ; ri--){
                if(ri == 0){
                    updateUI(o2[ri], _child[0]);
                }else{
                    updateUI(o2[ri],  _child[center+ri-_center]);
                }

            }
            centerPic = o2.shift();
        }

        //间时调用的线程
        var rotateID = -1,
            //关闭间时调用
            closeRotate  = function(){
                clearInterval(rotateID);
            },
            //开启间时调用
            openRotate  = function(){
                rotateID = setInterval(function(){//循环调用
                    rotate(_IM.leftPics , _IM.rightPics);
                }, 2000);
        }

        //初始化所有层叠节点的位置样式
        rotate(_IM.leftPics , _IM.rightPics);

        //开启轮播
        openRotate();

        //左旋转
        _options.left.onclick = function(){
            rotate(_IM.leftPics , _IM.rightPics);
        }
        _options.left.onmousemove = function(){
            closeRotate()
        }
        _options.left.onmouseout = function(){
            openRotate()
        }

        //右旋转
        _options.right.onclick = function(){
            rotate(_IM.rightPics, _IM.leftPics ,"r");
        }
        _options.right.onmousemove = function(){
            closeRotate()
        }
        _options.right.onmouseout = function(){
            openRotate()
        }
    }




    /******************************
     * 图片旋转             start *
     *******************************/

    //先检测支持哪一种CSS3变换属性，如果为空则为IE的私有方法变换
    _IM.transform = (function(){
        var _transform = '',

            //待变换样式属性库
            _transforms = [
                "transform",
                "MozTransform",
                "webkitTransform",
                "OTransform",
                "msTransform"
            ],
            _transformsLen = _transforms.length,
            i = 0,
            _styles = document.createElement("div").style
            ;
        for(; i<_transformsLen; i++){
            if(_transforms[i] in _styles){
                _transform = _transforms[i];
                break;
            }
        }

        return _transform;
    })();

    //旋转图片
    _IM.rotateImg = function (img, degree){
        if(_IM.isIE6()){
            return;
        }
        //设置矩阵变换数据
        var cosa = (degree == 90 || degree == 270) ? 0 : Math.cos(degree*Math.PI/180),
            sina = (degree == 180) ? 0 : Math.sin(degree*Math.PI/180),
            newMatrix = {M11: cosa, M12: (-1*sina), M21: sina, M22: cosa},
            name;

        if(_IM.transform == ''){    //if IE

            /*
             *IE的滤镜语法：
             * filter: progid:DXImageTransform.Microsoft.Matrix( enabled= bEnabled , SizingMethod= sMethod , FilterType= sType , Dx= fDx , Dy= fDy , M11= fM11 , M12= fM12 , M21= fM21 , M22= fM22 )
             * 如果只是简单的实现一些旋转，可以用filter:progid:DXImageTransform.Microsoft.BasicImage(rotation=degree)语法结构;
             * */
            img.style.filter =
                "progid:DXImageTransform.Microsoft.Matrix(SizingMethod='auto expand')";
            for (name in newMatrix)
                img.filters.item("DXImageTransform.Microsoft.Matrix")[name] = newMatrix[name];
        }
        else
        {
            /*
            *在最新的CSS3中，新增加了transform 属性，允许向元素应用 2D 或 3D 转换。该属性允许我们对元素进行旋转、缩放、移动或倾斜
            * matrix(n,n,n,n,n,n)对元素进行2D矩阵变换总共设置6个值
            * */

             //保持旋转的一致性，修正方向， matrix设置旋转属性
             img.style[_IM.transform] = "matrix(" + newMatrix.M11  + "," + ( -newMatrix.M12 ) + ","
                + ( -newMatrix.M21 ) + "," + newMatrix.M22 + ",0,0)";

            //transform:rotate(degree); 只要设置相应的旋转角度即可
            /*img.style[_IM.transform] = "rotate("+degree+"deg)";*/
        }
    }

    /******************************
     * 类似QQ相册效果       start *
     *******************************/

    _IM.QQPhotoAlbum = function(options){

        //线轴运动
        var scrollLine = options.scrollLine,

            minLeft = this.getAbsoluteLeft(scrollLine),

            maxLeft = options.width - 100,

            childDivs = this.getTypeElement(options.photoStreamMain.childNodes, "div"),

            childDivsLen = childDivs.length,

            cW = 0,

            //横向浮动元素
            ve = [],

            //初始化图片节点
            initChilds = (function(){
                var i = 0,
                    imge = null;
                while(childDivs[i]){
                    imge = _IM.getTypeElement(childDivs[i].childNodes, "img")[0];
                    if(i%2 == 0){
                        ve.push(imge);
                        cW += 150;
                        childDivs[i].style.width = "150px";
                    }else{
                        cW += 300;
                        childDivs[i].style.width = "300px";
                    }
                    i++;
                }
            })(),

            s = cW/options.width;
        //开启
        scrollLine.onmousedown = function(e){
            _IM.bodyscrollLineingE.scrollLineing = true;
            e = e || _W.event;
            var _pos = _IM.getMousePoint(e);
            _IM.bodyscrollLineingE.vx = _pos.left - minLeft - (parseInt(this.style.left) || 0);

        }
        //关闭
        document.body.onmouseup = function(){
            _IM.bodyscrollLineingE.scrollLineing = false;
        }

        //主流宽度
        options.photoStreamMain.style.width = cW;

        //主流的left
        mainScrollLine = function(ml){
            var _ml = -1 * ml * s;
            options.photoStreamMain.style.left = _ml+"px";
        }

        //移动
        _IM.bodyscrollLineingE = {
            minLeft:minLeft,
            maxLeft:maxLeft,
            scrollLine:scrollLine,
            mainScrollLine:mainScrollLine
        }
        //图片动态浮动
        setInterval(function(){
            var veLen = ve.length,
                l = 0;
            for(; l < veLen ; l++){
                new animateManage({

                    //被操作的元素
                    "context":ve[l],

                    "effect":"linear",

                    //持续时间
                    "time": 5000,

                    //元素的起始值偏移量
                    "starCss":{
                        "left":ve[l].style.left || 0
                    },

                    //元素的结束值偏移量
                    "css" :{
                        "left":(parseInt(ve[l].style.left, 10) == -150 ? 0 : -150)
                    }
                }).init();
            }

        },6000)


    }
    _IM.bodyscrollLineingE = {
        scrollLineing:false,
        minLeft:0,
        maxLeft:0,
        scrollLine:null,
        vx:0,
        mainScrollLine:0
    }

    _IM.bodyscrollLineing = function(e){
        var _ee =  _IM.bodyscrollLineingE;
        if(_ee.scrollLineing){
            e = e || _W.event;
            var _pos = _IM.getMousePoint(e),
                _l = _pos.left - _ee.minLeft- _ee.vx;
            if(_l < 0) _l = 0;
            if(_l > _ee.maxLeft) _l = _ee.maxLeft;
            _ee.scrollLine.style.left = (_l || 0) +"px";

            //横式布局left转换
            _ee.mainScrollLine(_l);
        }
    }
    //body 移动事件
    _IM.bodymousemove = function(){
        document.body.onmousemove = function(e){
            _IM.bodyMagnifiermousemove(e);
            _IM.bodyscrollLineing(e);
        }
    }

    //获取元素的绝对left
    _IM.getAbsoluteLeft = function (_e){
        var _left = _e.offsetLeft,
            _current = _e.offsetParent;
        while (_current !== null){
            _left += _current.offsetLeft;
            _current = _current.offsetParent;
        }
        return _left;
    }

    //获取元素的绝对top
    _IM.getAbsoluteTop = function (_e){
        var _top = _e.offsetTop,
            _current = _e.offsetParent;
        while (_current !== null){
            _top += _current.offsetTop;
            _current = _current.offsetParent;
        }
        return _top;
    }

    //获取ID对象
    _IM.getElement = function(eStr){
        return document.getElementById(eStr);
    }

    //设置元素样式
    _IM.setCss = function(_this, cssOption){
        if ( !_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ) {
            return;
        }
        for(var cs in cssOption){
            _this.style[cs] = cssOption[cs];
        }
        return _this;
    }

    //获取指定类型的节点
    _IM.getTypeElement = function(es, type){
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

    /*
    * 检测浏览器是否支持canvas
    * 生成一个Canvas元素来进行这种判断，创建的元素不会被看到，只会占用小部分内存
    * */
    _IM.canvasSupport = function () {
        return !!document.createElement('canvas').getContext;
    }

    /**
     * 获取鼠标在页面上的位置
     * _e		触发的事件
     * left:鼠标在页面上的横向位置, top:鼠标在页面上的纵向位置
     */
    _IM._mouseposousePoint = function (_e) {
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
    _IM.pointCheck = function(_event,_e, options){
        var _pos = _IM.getMousePoint(_event),
            //获取元素的宽度
            _w = options && options.width || _e.offsetWidth,
            //获取元素的高度
            _h = options && options.height || _e.offsetHeight
            _left = _IM.getAbsoluteLeft(_e),
            _top = _IM.getAbsoluteTop(_e)
            ;
        _pos.left += options && options.left || 0;
        //计算鼠标的top与left值，是否落入元素的left与top内即可
        if(_pos.left < (_left+_w) && _left < _pos.left && _pos.top > _top && _pos.top < (_top+_h)){
            return true;
        }
        return false;
    }

    //是否IE
    _IM.isIE = function(){
        return !!window.ActiveXObject;
    }

    //是否IE6
    _IM.isIE6 = function(){
        return this.isIE() && !window.XMLHttpRequest;
    }

    //是否IE7
    _IM.isIE7 = function(){
        return this.isIE() && !this.isIE6() && !this.isIE8();
    }

    //是否IE8
    _IM.isIE8 = function(){
        return this.isIE() && !!document.documentMode;
    }
    /**
     * 获取鼠标在页面上的位置
     * _e		触发的事件
     * left:鼠标在页面上的横向位置, top:鼠标在页面上的纵向位置
     */
    _IM.getMousePoint = function (_e) {
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



})(iManage , window, document);
