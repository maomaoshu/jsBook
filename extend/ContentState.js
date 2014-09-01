 /**
 ************************************************************
 *@project ContentState
 *@author xlxi
 *@Mail 939898101@qq.com
 *@ver version 1.0
 *@time 2013-01-16
 ************************************************************
 */
 


var ContentState={
	 _Val:{},
    _obj:null,
    ctor:function () {

    },
    "init":function(objID){
        var self = this;
        var isString=typeof objID;
        var initAll = function(_objID){
            self._obj=$('#'+_objID);
            self._Val[self._obj.attr('id')]=self._obj.val();

            //事件绑定
            self.eventBind();
        }
        if(isString == 'string'){
            initAll(objID);
        }else if($.isArray(objID)){
            var objIDL=objID.length;
            for(var k=0 ; k < objIDL ; k++){
                initAll(objID[k]);
            }
        }else{
            jQuery.error('Error!Please use the string type.');
        }
    },

    "eventBind":function(){
        var that=this;
        this._obj.die();
        this._obj.css('color',"#999");
        this._obj.live('focusout focusin', function(event) {
                  that.targetEvent(event, $(this));
        });
    },

    "targetEvent":function(_event, _this){
        var that = this;
        var valIng=_this.val();
        var _type=_this.attr("input-type");
        if (_event.type == 'focusout') {
            if(valIng.length <= 0 && _type != "password"){
                //判断是否为密码框 ,如果密码 就隐藏当前元素创建一个与其一样的属性的元素

                _this.val(this._Val[_this.attr('id')]);
                _this.css('color',"#999");
            }
        } else {
            if(valIng == this._Val[_this.attr('id')]){
                if(_type && _type == "password"){
                    _this.hide();
                    _this.next().show().focus();
                    _this.next().blur(function(){
                        if($.trim($(this).val()).length <= 0){
                            $(this).hide().unbind();
                            _this.show().val(that._Val[_this.attr('id')]);

                        }
                    });
                }else{
                    _this.val('');
                    _this.css('color',"#666");
                }

            }
        }
    },

    "eventDie":function(){
        if(this._obj){
            this._obj.die();
        }

    }
};