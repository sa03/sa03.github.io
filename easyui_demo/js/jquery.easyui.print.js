/**
 * EasyUI打印插件
 *
 * 使用方法：
 *     1. 在页面添加这个js
 *     
 *     2. $("element").print(/options/);
 *     
 *     3. $("element").print({
 *         title : "在这里设置需要添加的DataGrid标题",  (默认为空)
 *         stylesheet : "需要额外添加的样式表",          (默认为null)
 *         pagination : "如果是打印所有页，则需要传入一个
 *                       Object {url : '请求所有页数据url', obj : '初始化的datagrid对象'}，
 *                       如果是打印当前页，则不需要传入该值，默认为false"
 *     })
 *  
 */
(function($){
	$.print = $.fn.print = function() {
		var options = arguments[0],
			defaults = {
    			title : "",
                append : null,
                pagination : false,
                stylesheet : null
    		};

		options = $.extend({}, defaults, (options || {}));

		var $styles = $("style, link, meta, title");
        if(options.stylesheet){
            $styles = $.merge($styles, $('<link rel="stylesheet" href="' + options.stylesheet + '">'));
        }
		$styles = $.merge($styles, $('<style>.datagrid-toolbar,.datagrid-pager{display:none!important}</style>'));

		//创建缓存副本
        
        if(options.pagination){
            var copy = options.pagination.obj.clone();
            
            copy.append($styles.clone());

            var content = '<div style="font-size:28px;font-weight:700;margin-bottom:15px;text-align:center;">'+options.title+'</div>'+copy[0].outerHTML+'</div>';
        }else{
    		var copy = $(this).clone();

    		copy.append($styles.clone());

        	var content = '<div style="font-size:28px;font-weight:700;margin-bottom:15px;text-align:center;">'+options.title+'</div>'+copy.html()+'</div>';
        }

        //清除缓存副本
        copy.remove();

    	var w, el;
    	try {
            //动态生成一个iframe
        	$iframe = $('<iframe height="0" width="0" border="0" wmode="Opaque"/>').prependTo('body').css({
                "position" : "absolute",
                "top" : -999,
                "left" : -999
            });

            w = $iframe.get(0);
            w = w.contentWindow || w.contentDocument || w;
            el = w.document || w.contentDocument || w;

            //启动打印
            el.open();
            el.write(content);
            el.close();

            //动态获取所有页数据并生成
            if(options.pagination){
                $(el).find("table").datagrid({
                    collapsible:false,
                    url:options.pagination.url,
                    method:'get',
                    rownumbers:true,
                    width: 700
                });
            }

            setTimeout(function(){
            	w.focus();
            	w.print();
            	setTimeout(function() {
                    // 修复IE下内存泄露的问题
                    $iframe.remove();
                }, 100);
            }, 250);
        }catch(e){
        	w = window.open();
            w.document.write(content);
            w.document.close();
            w.focus();
            w.print();
            w.close();	
        }

        return this;
	};

	function getjQueryObject(string) {
        var jqObj = $("");
        try {
            jqObj = $(string).clone();
        } catch(e) {
            jqObj = $("<span />").html(string);
        }
        return jqObj;
    }
})(jQuery);