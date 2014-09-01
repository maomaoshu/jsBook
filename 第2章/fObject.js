/**
 ************************************************************
 * @project 表单对象管理 (Form Library)
 * @author XinLiang
 * @Mail 939898101@qq.com
 * @ver version 1.0
 * @time 2013-10-16
 * @Copyright : BSD License
 ************************************************************
 */

var fObject = fObject || {};

; (function (_F, window, document, undefined) {

    var _W = window,
        document = _W.document;

    //正则管理---获取正则字符
    _F.getRegular = function(rstr){

        //正则数据存储域
        var regData={};

        // 去除空格的正则
        regData.rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g;

        //中文
        regData.Chinese = /[\u4e00-\u9fa5]/g;

        //数字
        regData.nonumber = /\D/g;

        //非中文
        regData.nochinese = /[^\u4e00-\u9fa5]/g;

        //邮件
        regData.email = /^\s*[a-zA-Z0-9]+(([\._\-]?)[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([_\-][a-zA-Z0-9]+)*(\.[a-zA-Z0-9]+([_\-][a-zA-Z0-9]+)*)+\s*$/;

        //电话
        regData.phone = /^(([0\+]\d{2,3}-)?(0\d{2,3})-)(\d{7,8})(-(\d{3,})){0,}$/;

        //带小数位的数字
        regData.decimalNumber = /^\d+(\.\d+)+$/;

        //html
        regData.htmlTags = /<[\/\!]*[^<>]*>/ig;

        return regData[rstr];

    }

    //去除字符串左右两边的空格
    _F.trim = function(chars){
		
        return (chars || "").replace( this.getRegular("rtrim"), "" );

    }

    //验证是否为空
    _F.isContent = function(chars){
        //第一种写法
        //return !chars ? true : false;

        //第二中写法
        return chars.length == 0 ? true : false;

    }

    //禁止输入
    _F.inhibitingInput = function(_element){
        //第一种写法  控制失去焦点
        _element.onfocus = function(){
            _element.blur();
        }

        //第二中写法 通过keyup 与blur 组合使用
        /* 		var noText = function (){
         _element.value = "";
         }

         _element.onkeyup =
         _element.onblur = noText; */

    }

    //关闭输入法
    _F.banInputMethod = function(_elementArr){
        var arr =_elementArr,
            self = this
            ;
        if(!(_elementArr instanceof Array)) {
            arr = [_elementArr];
        };
        for(var i= 0,arrLen = arr.length ;i<arrLen;i++){
            var arrI = arr[i];
            arrI.onfocus = function(){
                //样式方案,只兼容除了谷歌浏览器之外的浏览器
                this.style.imeMode='disabled';
            }

            var banInputMethod = arrI.getAttribute("banInputMethod");
            if(banInputMethod) {
                var clearChinese = function(_this){
                    var _v = _this.value;
                    _this.value = _v.replace(self.getRegular("Chinese"),"");
                }
                arrI.onkeyup = function(){
                    clearChinese(this);
                }
                arrI.onblur = function(){
                    clearChinese(this);
                }
            }
        }

    }
    //禁止复制粘贴
    _F.banCopyPaste = function(_elementArr){
        //优化前
       /* var arr =_elementArr,
            self = this
            ;
        if(!(_elementArr instanceof Array)) {
            arr = [_elementArr];
        };
        for(var i= 0,arrLen = arr.length ;i<arrLen;i++){
            var arrI = arr[i];
            //禁止复制
            arrI.oncopy = function(){
                return false;
            }
            //禁止粘贴
            arrI.onpaste = function(){
                return false;
            }
        }*/

        //优化后
        this.forElementArr(_elementArr, function(index, _this){
            //禁止复制
            _this.oncopy = function(){
                return false;
            }
            //禁止粘贴
            _this.onpaste = function(){
                return false;
            }
        });

    }
    //限制只能输入数字
    _F.banNumber = function(_elementArr){
		var self = this;
        //优化后
        this.forElementArr(_elementArr, function(index, _this){
            var clearNonumber = function(tThis){
                var _v = tThis.value;
                tThis.value = _v.replace(self.getRegular("nonumber"),"");
            }
            _this.onfocus = function(){
                clearNonumber(this);
            }
            _this.onkeyup = function(){
                clearNonumber(this);
            }
            _this.onblur = function(){
                clearNonumber(this);
            }
        });

    }   
	//限制只能输入中文
    _F.chineseStr = function(_elementArr){
		var self = this;
        //优化后
        this.forElementArr(_elementArr, function(index, _this){
            var clearNonumber = function(tThis){
                var _v = tThis.value;
                tThis.value = _v.replace(self.getRegular("nochinese"),"");
            }
            _this.onfocus = function(){
                clearNonumber(this);
            }
            _this.onblur = function(){
                clearNonumber(this);
            }
        });

    }	
	//字符串长度限制（中英文限制、实现显示）
    _F.limitLength = function(_elementArr){
		var self = this;
        //优化后
        this.forElementArr(_elementArr, function(index, _this){
            var clearNonumber = function(tThis){
                var _v = tThis.value,
                    _vLen = _v.length,
                    dataLength = tThis.getAttribute("data-length"),
                    //如果有实时显示的属性，则在指定元素上显示
                    remainingCharacters = tThis.getAttribute("data-remainingCharacters");

                //区分中英文前
/*                if(_v.length > dataLength) tThis.value = _v.substr(0, dataLength);*/
                //区分中英文后
                var dataModel = tThis.getAttribute("data-model");
                var subLen = dataLength;
                if(dataModel == "Ch"){
                    _vLen = strLen(_v, dataModel);
                    var vv = _v.match(/[\u4e00-\u9fa5]/g);
                    subLen = dataLength - (!vv ? 0 : vv.length);
                }
				if(_vLen > dataLength)  tThis.value = _v.substr(0, subLen);
                if(remainingCharacters){
                    self.showRemainingCharacters(!_vLen ? dataLength :(_vLen > dataLength ? 0 :dataLength - _vLen), remainingCharacters);
                }

            }
            _this.onfocus = function(){
                clearNonumber(this);
            }
			_this.onkeyup = function(){
                clearNonumber(this);
            }
            _this.onblur = function(){
                clearNonumber(this);
            }
        });

    }

    //实时显示还剩余多少字符
    _F.showRemainingCharacters = function(_nums, _remainingCharacters){
        if(_remainingCharacters.search(",") != -1){
            _remainingCharacters = _remainingCharacters.split(",");//英文字符串分割
        }
        this.forElementArr(_remainingCharacters, function(_index, _this){
            _this.innerHTML = (_nums && _nums.toString()) || "0";
        });
    }

    //显示输入提示，获取焦点提示取消
    _F.hintInput = function(_elementArr){
        var self = this;
        this.forElementArr(_elementArr, function(index, _this){
            var _span = document.createElement("span");
            var dataHint = _this.getAttribute("data-hint");
            _span.innerText = dataHint;
            self.setCss(_span, {
                "position":"absolute",
                "left":_this.offsetLeft+2,
                "top":_this.offsetTop,
                "zIndex":2
            });
            _span.className = "hintInput";
            _this.value = "";
            _span.setAttribute("id" ,"hint"+index);
            _this.parentNode.insertBefore(_span,_this);

            var onhint = function(e){
               self.setCss(_span, {
                    "display":"none"
                })
               _this.focus();


            }
            _this.onblur = function(e){
               if(!self.trim(_this.value)){
                    self.setCss(_span, {
                        "display":"block"
                    })
                }

            }
            _span.onclick = _this.onfocus = onhint;
        });
    }
    //滚动效果
    _F.rollContent = function(_element,ags){
        var self = this;
            var _div = _element.innerHTML;
            _element.innerHTML = "<div id='rollContent_roll'>"+_div+"</div>";
            self.setCss(_element, {
                "position":"relative",
                "overflow":"hidden",
                "wordWrap":"break-word",
                "wordBreak":"break-all",
                "width":_element.getAttribute("data-rwidth"),
                "height":_element.getAttribute("data-rhight")
            });


            self.timeRoll = self.getElement("rollContent_roll");
            var _h = this.timeRoll.offsetHeight;
            if(_h > _element.getAttribute("data-rhight")){
                self.timeoutRoll();
                self.setCss( self.timeRoll, {
                    "position":"relative",
                    "top":"0px"
                });
            }




    }

    _F.timeoutRoll = function(){
        var _h = this.timeRoll.offsetHeight,
            _t = parseInt(this.timeRoll.style.top, 10),
            _tt =  _h > Math.abs(_t) || _t >= 0 ? _t-10: (_h || 0);

        /*精简写法之前
        if(isNaN(_t)){
            _tt = 0;
        }

        if(_t < 0 &&  _h <= Math.abs(_t)){
            _tt = _h;
        }

        if(_t <0 &&  _h > Math.abs(_t) || _t >= 0){
            _tt = _t-10;
        }*/
        this.setCss(this.timeRoll, {
            "top":_tt+"px"
        });
        setTimeout("fObject.timeoutRoll()",200);
    }
    _F.passwordStrength = function(passwordStrength, showStrength){
        var self = this;
        /*字符权重：
                数字1，字母2 ，其他字符为3
                当密码长度小于6为不符合标准，
                长度大=6强度小于10，强度弱
                ，长度大=6 强度>=10 <15，强度中，
                长度大=6 强度>=15 强*/
        passwordStrength.onkeyup = function(){
            var _color = ["red", "yellow", "orange", "green"],
                msgs = ["密码太短","弱","中","强"],
                _strength= 0,
                _v = self.trim(passwordStrength.value)
                _vL = _v.length,
                i = 0;
            //计算单个字符强度
            var charStrength = function(char){
                if (char>=48 && char <=57){ //数字
                    return 1;
                }
                if (char>=97 && char <=122) {//小写
                    return 2;
                }else{
                    return 3; //特殊字符
                }
            }
            //计算模式
            if(_vL < 6){
                showStrength.innerText = msgs[0];
                self.setCss(showStrength, {
                    "color":_color[0]
                })
            }else{
                for( ; i < _vL ; i++){
                    _strength+=charStrength(_v.toLocaleLowerCase().charCodeAt(i));
                }
                if(_strength < 10){
                    showStrength.innerText = msgs[1];
                    self.setCss(showStrength, {
                        "color":_color[1]
                    })
                }
                if(_strength >= 10 && _strength < 15){
                    showStrength.innerText = msgs[2];
                    self.setCss(showStrength, {
                        "color":_color[2]
                    })
                }
                if(_strength >= 15){
                    showStrength.innerText = msgs[3];
                    self.setCss(showStrength, {
                        "color":_color[3]
                    })
                }
            }
        }
    }
    //回车提交
    _F.enterSubmit = function(enterSubmit, submitCall){
        enterSubmit.onkeyup = function(e){
            e = e || _W.event;
            var keycode = e.keyCode || e.which ||e.charCode;
            if(keycode === 13){
               alert("回车提交成功");
            }

        }
    }

    //光标位置永远在最后
    _F.cursorPos = function(_this){
        //绑定两种事件，已达到最大兼容性
        _this.onclick = _this.onkeyup  = function(){
            var _vLen = this.value.length;
            if(this.setSelectionRange){
                //非IE
                this.setSelectionRange(_vLen,_vLen);
            }else{
                //IE中
                var a =this.createTextRange();
                a.moveStart('character',_vLen);
                a.collapse(true);
                a.select();
            }
        }


    }
    //禁止自动完成
    _F.banAutocomplete = function(_elementArr){
        var self = this;
        this.forElementArr(_elementArr, function(index, _this){
            //设置禁用属性
            _this.setAttribute("autocomplete", "off");
        });
    }
     //自动选定TextArea内容
    _F.autoSelected = function(_elementArr){
        var self = this;
        this.forElementArr(_elementArr, function(index, _this){
            //调用浏览器内置的文本选定方法
            _this.select();
        });
    }
    //获取、失去焦点修改样式
    _F.autoUpdateCss = function(_elementArr){
        var self = this;
        this.forElementArr(_elementArr, function(index, _this){
            var fCss = _this.getAttribute("data-fCss"),
                fClass = _this.getAttribute("data-fClass"),
                bClass = _this.getAttribute("data-bClass"),
                bCss = _this.getAttribute("data-bCss");
            _this.onfocus = function(){
                fCss && self.setCss(this, self.strToJson(fCss));
                fClass && (this.className = fClass);

            }
            _this.onblur = function(){
                bCss && self.setCss(this, self.strToJson(bCss));
                bClass && (this.className = bClass);
            }
        });
    }
    //常见正则验证
    _F.regVerification = function(_elementArr){
        var self = this
            ;
        this.forElementArr(_elementArr, function(index, _this){

            _this.onkeyup = function(){
                //获取被处理的元素值
                var _v = self.trim(this.value),
                    //获取正则
                    _reg = this.getAttribute("data-reg"),
                    //如果含有“,”则将其转换成多数组
                    __reg = _reg.indexOf(",") > 0 ? _reg.split(","): [_reg],
                    //数组长度
                    _regLen = __reg.length,
                    //错误信息显示
                    _emsg = this.getAttribute("data-emsg"),
                    //通过信息显示
                    _smsg = this.getAttribute("data-smsg"),
                    //获取显示信息的元素
                    _target = self.getElement(this.getAttribute("data-tmsg")),
                    i = 0
                    ;
                for(; i < _regLen ; i++){
                     if(!self.verification(_v, __reg[i])){
                         _target.innerHTML = _emsg ;
                         self.setCss(_target, {
                             "color":"red"
                         })
                         return;
                     }
                }
                _target.innerHTML = _smsg ;
                self.setCss(_target, {
                    "color":"green"
                })
            }
        });
    }
    //文本内容关键词过滤
    _F.keyWordsFiltering = function(_elementArr){
        var self = this,
            //关键词库
            keyWordsLibs = [
                "JavaScript",
                "美女",
                /[外]{1}.{0,3}[挂]{1}/
            ],
            keyWordsLibsLen = keyWordsLibs.length;
        this.forElementArr(_elementArr, function(index, _this){
            //正则过滤
            for(var i = 0 ; i < keyWordsLibsLen; i++){
                _this.value = _this.value.replace(keyWordsLibs[i], "***")
            }
        });
    }
    //从字符串中剔除所有HTML代码
    _F.delHtmlTags = function(_elementArr){
        var self = this;
        this.forElementArr(_elementArr, function(index, _this){
            _this.value = _this.value.replace(self.getRegular("htmlTags"), "")
        });
    }
    //测试是否为数值型
    _F.isNumber = function(_number){
       return typeof _number == "number";
    }
    //TextArea自适应文字行数多少
    _F.autoRow = function(_elementArr){
        var self = this;

        this.forElementArr(_elementArr, function(index, _this){
            _this.style.overflowY = "hidden";
            _this.onkeyup= function(){
                _this.style.height = _this.scrollHeight;
            };
        });
    }
    //判断单选框是否选中
    _F.isRadioChecked = function(_elment){
        return _elment.checked ? true : false;
    }
    //限制复选框最多选择几项
    _F.forbidcheckSelects = function(selectNames){
        var _forbidcheckSelects = document.getElementsByName(selectNames),
            //限制复选框最多选择3项
            banNums = 3;
        for(var i in _forbidcheckSelects){
            _forbidcheckSelects[i].onclick = function(){
                var __forbidcheckSelects = document.getElementsByName(selectNames),
                    selectNum = 0;
                for(var i in __forbidcheckSelects){
                    if(i == "length") break;
                    if(_F.isRadioChecked(__forbidcheckSelects[i])){
                        selectNum++;
                    }
                }
                //如果选中的复选项，超过限制最大数，将当前的选中选项设置为没选中false
                if(selectNum > banNums) {
                    this.checked = false;
                }

            }

        }

    }
   // Checkbox全选、取消全选、反选
    _F.actionSelects = function(options){
        var targets = options.targets,
            targetsLen = targets.length,
            i = 0;

        options.allSelect.onclick = function(){
               for(i = 0 ;i < targetsLen ; i ++){
                    targets[i].checked = true;
                }
        }

        options.canelallSelect.onclick = function(){
               for(i = 0 ;i < targetsLen ; i ++){
                    targets[i].checked = false;
                }
        }

        options._select.onclick = function(){
                for(i = 0 ; i < targetsLen ; i ++){
                    targets[i].checked = !targets[i].checked;
                }

        }

    }

    //根据指定内容选中复选框
    _F.contentCheckbox = function(_elementArr){
        var self = this;
        this.forElementArr(_elementArr, function(index, _this){
            var _targets = document.getElementsByName(_this.getAttribute("data-target")),
                targetsLen = _targets.length,
                i = 0;
            _this.onkeyup = function(){
                for(i = 0 ; i < targetsLen ; i ++){
                    var _t = _targets[i],
                        _v = this.value;
                    //如果内容与复选框的关键词匹配，选择当前的复选框
                    //三元运算写法
                    /*_v.search(_t.getAttribute("data-k")) != -1 ?
                        _t.checked = true :
                        _t.checked = false;*/

                    //单链式条件写法
                    _t.checked = _v.search(_t.getAttribute("data-k")) != -1 && true || false;
                }
            }
        });
    }
    //获取复选框所有选中内容
    _F.selectContents = "";      //复选框选择的内容
    _F.getSelectContent = function(selectNames){
        var _selectContent = document.getElementsByName(selectNames),
            i = 0,
            sl = _selectContent.length;
        //限制复选框最多选择3项
        for(;  i < sl ; i++){
            _selectContent[i].onclick = function(){
                var _t = this.nextSibling.innerText;
                if(this.checked){
                    _F.selectContents += "<br />" + _t;
                }else{
                    _F.selectContents = _F.selectContents.replace("<br />" + _t, "")
                }
                _F.getElement("selectedContents").innerHTML = "被选择的内容："+_F.selectContents;
            }

        }
    }
    _F.addOptions = function(target, optons){
        var _option = null,
            ol = optons.length,
            i = 0,
            _v = "",
            _t = "";
        for(; i < ol ; i++ ){
            _v = optons[i].value;
            _t = optons[i].text;
            _option = document.createElement("OPTION")
            _option.value = _v;
            _option.text = _t;
            target.options.add(_option);
        }

    }

    _F.removeOptions = function(target, optons){
        var ol = optons.length,
            i = 0;
        for(; i < ol ; i++ ){
            target.options[i] && target.options.remove(target.options[i]);
        }
    }
    /*
    * 联动效果，地区数据字典
    * 为了方便用户查阅代码，将数据属性写在此处。
    * code代表被绑定的二级菜单标示符
    **/
    _F.linkDatas = {
        provinces:[
            {
                "code":"0",
                "name":"请选择"
            },
            {
                "code":"1",
                "name":"北京"
            },
            {
                "code":"2",
                "name":"天津"
            },
            {
                "code":"3",
                "name":"河北"
            },
            {
                "code":"4",
                "name":"湖北"
            },
            {
                "code":"5",
                "name":"广东"
            },
            {
                "code":"6",
                "name":"其它"
            }
        ],
        citys:{
            0:[
              "请选择"
            ],
            1:[
                "朝阳区",
                "海淀区",
                "东城区",
                "西城区",
                "房山区",
                "其它"
            ],
            2:[
                "天津"
            ],
            3:[
                "沧州",
                "石家庄",
                "秦皇岛",
                "其它"
            ],
            4:[
                "武汉市",
                "宜昌市",
                "襄樊市",
                "其它"
            ],
            5:[
                "广州市",
                "深圳市",
                "汕头市",
                "佛山市",
                "珠海市",
                "其它"
            ],
            6:[
                "其它"
            ]
        }
    };
    //联动效果，业务处理---参数（一级菜单，二级菜单）
    _F.linkage = function(parents, childs){
        var  _linkDatas = _F.linkDatas,
            _parents = _linkDatas.provinces,
            _childs = _linkDatas.citys,
            _initCity = _childs[0],
            _p = [];
        //初始化数据

        //省
        for(var i in _parents){
            _p.push({
                "text" : _parents[i].name,
                "value" : _parents[i].code
            });
        }
        _F.addOptions(parents, _p);

        //城市
        _F.addOptions(childs,[{
            "value":_initCity,
            "text":_initCity
        }]);

        //联动事件绑定及具体业务处理
        parents.onchange = function(){
            var __childs = _childs[this.value],
                __childsLen = __childs.length,
                l = 0,
                __p = [];
            childs.innerHTML = "";
            for(; l < __childsLen ; l++){
                __p.push({
                    "value" : __childs[l],
                    "text" : __childs[l]
                });
            }
            _F.addOptions(childs, __p);
        }

    }
    //小写转大写
    _F.getLowerCase = function(str, type){

        //是否采取本地转换格式
        type = type || "locale";

        //返回转换后的值
        return type === "locale" && str.toLocaleUpperCase() || str.toUpperCase();
    }

    //字符型转换成数值型
    _F.getNumbers = function(s){

        //获取转换值
        var n = parseInt(s ,10);

        //如果为NaN则转换结果为0
        if(isNaN(n))  return 0;

        return  n;
    }

    //数字转换成字符型
    _F.getString = function(n){
        return n.toString();
    }
    //设置表单中所有文本型的成员的值为空
    _F.clearText = function(_eForm){
        var _elements = _eForm.elements,
            _elementsLen = _elements.length
            _ei = null,
            i = 0;
        for (; i < _elementsLen ; i++){
            _ei = _elements[i];
            (_ei.type == "text" || _ei.type == "textarea") && (_ei.value = "");
        }
    }
    //限制上传文件的格式
    _F.fileType = function(_eForm, types){
        var _elements = _eForm.elements,
            _elementsLen = _elements.length
            _ei = null,
            _v = "",
            _contentType = "",
            i = 0;
        for (; i < _elementsLen ; i++){
            _ei = _elements[i];
            if(_ei.type == "file"){
                //var _i = _ei.value.lastIndexOf("\\");
                _v = _ei.value,
                _contentType = _v && _v.match(/^(.*)(\.)(.{1,8})$/)[3];
                //如果文件上传为空或者类型为限制类型则返回false
                if(!_v || types.search(_contentType) != -1){
                    return false;
                }
            }
        }
        return true;
    }
    /*
    * 兼容ie6，ie7，ie8 ，Google Chrome，ff等浏览器，
    * 如果遇到ie8不支持，请在安全设置处设置一下就ok(工具 => Internet选项 => 安全 => Internet => 自定义级别    找到“将文件上载到服务器时包含本地目录路径”，设置为“启用”)
    * */
    _F.getFileSize = function(_f){
        var _fileSize = 0;
        if (this.isIE() && !_f.files) {
            var filePath = _f.value;
            var fileSystem = new ActiveXObject("Scripting.FileSystemObject");

            if(!fileSystem.FileExists(filePath)){
                return 0;
            }
            var file = fileSystem.GetFile (filePath);
            _fileSize = file.Size;
        } else {
            _fileSize = (_f.files[0] && _f.files[0].size) || 0;
        }
        return _fileSize;
    }
    //清空input为file的ui
    _F.clearFile = function(_eForm){
        var _elements = _eForm.elements,
            _elementsLen = _elements.length,
            _ei = null,
            i = 0;
        for (; i < _elementsLen ; i++){
            _ei = _elements[i];
            //如果为IE，利用其特性清空，否则直接将value设置为空值
            (_ei.type == "file") && ((this.isIE() && (_ei.outerHTML = _ei.outerHTML)) || (_ei.value = ""));
        }
    }
    //是否是ie
    _F.isIE = function(){
        return document.all ? true : false;
    }
    //正则验证
    _F.verification = function(str, reg){
        return this.getRegular(reg).test(str);
    }
    //获取对象组
    _F.forElementArr = function(_elementArr, callBack){
        var arr =_elementArr,
            self = this
            ;

        if(!(_elementArr instanceof Array)) {
            arr = [_elementArr];
        };
        for(var i= 0,arrLen = arr.length ;i<arrLen;i++){
            var arrI = arr[i];
            if(typeof arrI == "string"){
                arrI = self.getElement(arrI);
            }
            callBack && callBack(i, arrI);
        }
    }
    //将字符转换为json对象
    _F.strToJson = function(str){
        return typeof JSON  == "object" ? JSON.parse(str) : (new Function("return " + str))();
    }

    _F.getElement = function(eStr){
        return document.getElementById(eStr);
    }

    _F.setCss = function(_this, cssOption){
        if ( !_this || _this.nodeType === 3 || _this.nodeType === 8 || !_this.style ) {
            return;
        }
        for(var cs in cssOption){
            _this.style[cs] = cssOption[cs];
        }
        return _this;
    }

})(fObject , window, document);   