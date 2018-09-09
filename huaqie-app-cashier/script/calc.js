/**
 * Author： www.mybry.com:dunizb
 * Date：2016/7/14 0014.
 */

/**
 * APP配置信息
 */
var appConfig = {
	version: "3.1.0",
	buildId: ".1510",
	appUrl:"",
};

window.onload = function(){
    //点击功能
    clickFunc();
    //移动端滑动功能,历史记录
    //swiperHistory();
};

function clickFunc(){
	var container = document.getElementById("container");
    var calc = document.getElementById("calc"),
        //spans = document.getElementById("win-tool").getElementsByTagName("span"),
        equals = document.getElementById("equals"),     //等于号
        remove = document.getElementById("remove");     //删除符号

    /*** 三个小按钮 ***/
   // var close = document.getElementById("close"),       //关闭按钮
        //max = document.getElementById("max"),           //最大化按钮
     //   resize = document.getElementById("resize");         //最小化按钮

    var resultDiv = document.getElementById("result");  //结果区域

    /*** 历史记录 ***/
    var historyBox = document.getElementById("historyBox"),
        delBtn = historyBox.querySelector(".remove a");
    var historyUl = historyBox.querySelector("ul");

    /***********鼠标划过三个小按钮显示功能图标***********/
    //max.onmouseover = close.onmouseover = function(){
    //	this.innerHTML = this.dataset.ico;
    //};
    //max.onmouseout = close.onmouseout = function(){
    //	this.innerHTML = "&nbsp;";
    //};

    /***********关闭按钮***********/
    /*close.onclick = function(e){
        var h = calc.offsetHeight + 15;
        calc.style.webkitTransform = "translateY("+ h+"px)";
        calc.style.transform = "translateY("+ h+"px)";
        e.stopPropagation();
    };*/
    /***********切换大小***********/
    /*
    resize.onclick = function(e){
    	e = e || window.event;
    	movePosition("left");
        e.stopPropagation();
    };
    */
    
    /***********最大化按钮***********/
    /*
    max.onclick = function(){
        maxCalc();
    };
    */
    function maxCalc(){
    	var that = this;
    	var spans = document.querySelectorAll("#bottom .row");
        if(container.classList.contains("flexbox")){        //缩小
            container.classList.remove("flexbox");
            calc.classList.remove("maxCalc");
            for(var i=0; i<spans.length; i++){
            	spans[i].classList.remove("mb");
            }
            document.getElementsByTagName("html")[0].classList.remove("maxhtml");
            that.dataset["ico"] = "口";
            that.title = "最大化";
        }else{          //放大
            container.classList.add("flexbox");
            calc.classList.add("maxCalc");
            for(var i=0; i<spans.length; i++){
            	spans[i].classList.add("mb");
            }
            document.getElementsByTagName("html")[0].classList.add("maxhtml");
            that.dataset["ico"] = "※";
            that.title = "恢复大小";
        }
        isResOverflow("max");
    }

    /***********点击键盘***********/
    var keyBorders = document.querySelectorAll("#bottom span"),
        express = document.getElementById("express"),//计算表达式
        res =  document.getElementById("res"),  //输出结果
        keyBorde = null;        //键盘
    var preKey = "",            //上一次按的键盘
        isFromHistory = false;  //是否来自历史记录
    //符号
    var symbol = {"+":"+","-":"-","×":"*","÷":"/","%":"%","=":"="};

    /***********键盘按钮***********/
    for(var j=0; j <keyBorders.length; j++){
        keyBorde = keyBorders[j];

        keyBorde.onclick = function() {
            var number = this.dataset["number"];
            clickNumber(number);
        };
    }
    
    /**
     * 点击键盘进行输入
     * @param {string} number 输入的内容
     * */
    function clickNumber(number){
        //read(number)
    	var resVal = res.innerHTML;		//结果
        var exp = express.innerHTML;	//表达式
        //表达式最后一位的符号
        var expressEndSymbol = exp.substring(exp.length-1,exp.length);
        //点击的不是删除键和复位键时才能进行输入
        if(number !== "←" || number !== "C"){
        	//是否已经存在点了，如果存在那么不能接着输入点号了,且上一个字符不是符号字符
        	var hasPoint = (resVal.indexOf('.') !== -1)?true:false;
        	if(hasPoint && number === '.'){
        		//上一个字符如果是符号，变成0.xxx形式
        		if(symbol[preKey]){
        			res.innerHTML = "0";
        		}else{
        			return false;
        		}
        	}
            //转换显示符号
            if(isNaN(number)){
                number = number.replace(/\*/g,"×").replace(/\//g,"÷");
            }
            //如果输入的都是数字，那么当输入达到固定长度时不能再输入了
            if(!symbol[number] && isResOverflow(resVal.length+1)){
                return false;
            }
            /*
            if(resVal.split('.').length > 1 && resVal.split('.')[1].length > 1 && !isNaN(number) && !isNaN(expressEndSymbol)){
                return false
            }
            */
            //点击的是符号
            //计算上一次的结果
            if(symbol[number]){
            	//上一次点击的是不是符号键
                console.log('NUMBER', number, 'EXPRESS', express.innerHTML, res.innerHTML)
                if(preKey !== "=" && symbol[preKey]){

                    express.innerHTML = exp.slice(0,-1) + number;
                }else{
                    if(exp == ""){
                        express.innerHTML = resVal + number;
                    }else{
                        express.innerHTML += resVal + number;
                    }
                    if(symbol[expressEndSymbol]){
                        exp = express.innerHTML.replace(/×/g,"*").replace(/÷/,"/");
                        res.innerHTML = Number(eval(exp.slice(0,-1)).toFixed(2));
                    }
                }                  
            }else{
                //如果首位是符号，0
                if((symbol[number] || symbol[preKey] || resVal=="0") && number !== '.'){
                    res.innerHTML = "";
                }
                res.innerHTML += number;
            }
            preKey = number;
        }
    }

    /***********相等，计算结果***********/
    equals.onclick = function(){
        calcEques();
    };
    
    function calcEques(){console.log('==========')
    	var expVal = express.innerHTML, val = "";
        var resVal = res.innerHTML;
        //表达式最后一位的符号
        if(expVal){
          
            var expressEndSymbol = expVal.substring(expVal.length-1,expVal.length);
            try{
                var temp = expVal+resVal
                if(symbol[expressEndSymbol] && resVal){
                    temp = temp.replace(/×/g,"*").replace(/÷/g,"/")
                    //temp = temp.slice(0, -1)
                }else{
                    temp = temp.replace(/×/g,"*").replace(/÷/g,"/")  
                }
                console.log('temp', temp)
                val = eval(temp)
                /*
                if(!isFromHistory){
                    var temp = "";
                    if(symbol[expressEndSymbol] && resVal){
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                        temp = eval(temp.slice(0,-1)) + symbol[expressEndSymbol] + resVal;
                    }else{
                        temp = expVal.replace(/×/g,"*").replace(/÷/,"/");
                    }
                    val = eval(temp);
                }else{
                    val = resVal;
                }
                */
            }catch(error){
                val = "<span style='font-size:1em;color:red'>Erro：计算出错！</span>";
            }finally{
                express.innerHTML = "";
                res.innerHTML = Number(val).toFixed(2);
                preKey = "=";
                saveCalcHistory(expVal+resVal+"="+val);
                isResOverflow(resVal.length);
                isFromHistory = false;
                
            }
        }
    }
	
	

    /***********复位操作***********/
   	var resetBtn = document.getElementById("reset");       //复位按钮
    resetBtn.onclick = function(){
        res.innerHTML = "0";
        express.innerHTML = "";
    };

    /***********减位操作***********/
    remove.onclick = function(){
        var tempRes = res.innerHTML;
        if(tempRes.length>1){
            tempRes = tempRes.slice(0,-1);
            res.innerHTML = tempRes;
        }else{
            res.innerHTML = 0;
        }
    };

    /***********历史功能***********/
    var history = document.getElementById("history"),
        historyBox = document.getElementById("historyBox");
   

    window.onclick = function(e){
        var e = e || window.event;
        var target = e.target.className || e.target.nodeName;
        //如果点击的是历史记录DIV和删除按钮DIV就不隐藏
        var notTarget =  {"con":"con","remove":"remove","UL":"UL","P":"P"};
        if(!notTarget[target]){
            //如果设置了最小化
            var ts = historyBox.style.transform || historyBox.style.webkitTransform;
            if(ts && ts == "none"){
                historyBox.style.webkitTransform = "translateY(102%)";
                historyBox.style.transform = "translateY(102%)";
            }
        }
        //恢复显示删除按钮
        //historyBox.children[1].children[0].className = "icon_del";
    };

    //点击头部恢复大小
//  var topDiv = document.getElementById("top");
//  topDiv.onclick = function(){
//      resetMini();
//  };
    //移动端Tap事件
//  $(topDiv).on("tap",function(){
//  	console.log("tap事件");
//  	resetMini();
//  });
//  function resetMini(){
//  	var ts = calc.style.transform || calc.style.webkitTransform;
//      if(ts && ts != "none"){
//          calc.style.transform = 'none';
//      }
//  }

   

    /**
     * 保存计算历史记录
     * @param val 要记录的表达式
     */
    function saveCalcHistory(val){
        var key = Mybry.wdb.constant.TABLE_NAME + Mybry.wdb.constant.SEPARATE + Mybry.wdb.getId();
        window.localStorage.setItem(key,val);
    }

    /**********自动设置文字大小************/
    function isResOverflow(leng){
        var calc = document.getElementById("calc");
        var w = calc.style.width || getComputedStyle(calc).width || calc.currentStyle.width;
            w = parseInt(w);

        //判断是否是移动端
        if((Mybry.browser.versions.android || Mybry.browser.versions.iPhone || Mybry.browser.versions.iPad) && !symbol[preKey]) {
            if(leng > 10){
                return true;
            }
        }else{
            if(leng > 10){
                if(w == 300) {
                    maxCalc();
                }else{
                    if(leng > 16){
                        return true;
                    }
                }
            }
        }
        return false;
    }
    
    //单手模式
    //singleModel();
}



/** 单手模式 */
function singleModel(){
	var calc = document.getElementById("calc");
	var startX = 0,moveX = 0,distanceX = 0;
    var distance = 100;   
    var width = calc.offsetWidth;
    //滑动事件
    calc.addEventListener("touchstart",function(e){
        startX = e.touches[0].clientX;
    });
    calc.addEventListener("touchmove",function(e){
        moveX = e.touches[0].clientX;
        distanceX = moveX - startX;
        isMove = true;
    });
    window.addEventListener("touchend",function(e){
        if(Math.abs(distanceX) > width/3 && isMove){
        	if( distanceX > 0 ){
        		positionFun("right");
        	}else{
        		positionFun("left");
        	}
        }
        startY = moveY = 0;
        isMove = false;
    });    
}

/**
 * 切换单手模式
 * @param {String} postion 左滑还是右滑，取值：left,right
 */
function movePosition( posi ){
    return
	var telPhone = document.getElementById("telPhone");
	var flag = telPhone.dataset.flag;
	var styles = calc.getAttribute("style");
	
	if(flag){
		if(styles){
			var w = styles.split(";")[0].split(":")[1];
			if(w == "80%"){
				calc.setAttribute("style","width: 100%; height: 100%; position: absolute;left: 0px; bottom: 0px;");
			}
		}
		if(posi === "left"){
			calc.setAttribute("style","width: 100%; height: 100%; position: absolute;left: 0px; bottom: 0px;");
		}else{
			calc.setAttribute("style","width: 80%; height: 70%; position: absolute;right: 0px; bottom: 0px;");
		}
		//计算表达式区域高度
    	document.getElementById("result").style.minHeight = "90px";
    	//计算表达式字体大小
    	document.getElementById("res").style.fontSize = "4.5rem";
        telPhone.dataset.flag = "";
	}else{
		positionFun(posi);
	}
}

function positionFun(postion){
	if(postion === "left"){
		calc.setAttribute("style","width: 80%; height: 70%; position: absolute;left: 0px; bottom: 0px;");
	}else{
		calc.setAttribute("style","width: 80%; height: 70%; position: absolute;right: 0px; bottom: 0px;");
	}
	//计算表达式区域高度
	document.getElementById("result").style.minHeight = "0";
	//计算表达式字体大小
	document.getElementById("res").style.fontSize = "3.5rem";
	telPhone.dataset.flag = "yes";
}


//function swiperHistory(){
//  /**
//   * 1.历史记录向下滑动
//   * 2.滑动到一定距离隐藏历史记录
//   * 3.滑动少于某个距离吸附回去
//   */
//  var historyBox = document.getElementById("historyBox");
//  var startY = 0,
//      moveY = 0,
//      distanceY = 0,
//      isMove = false;
//  //缓冲的距离
//  var distance = 100;
//  //加过渡
//  var addTransition = function(){
//      historyBox.style.webkitTransition = 'all 0.3s';/*兼容性*/
//      historyBox.style.transition = 'all 0.3s';
//  }
//  //清除过渡
//  var removeTransition = function(){
//      historyBox.style.webkitTransition = 'none';
//      historyBox.style.transition = 'none';
//  };
//  //定位
//  var setTranslateY = function(translateY){
//      historyBox.style.webkitTransform = 'translateY('+translateY+')';
//      historyBox.style.transform = 'translateY('+translateY+')';
//  }
//
//  //滑动事件
//  historyBox.addEventListener("touchstart",function(e){
//      startY = e.touches[0].clientY;
//  });
//  historyBox.addEventListener("touchmove",function(e){
//      moveY = e.touches[0].clientY;
//      distanceY = moveY - startY;
//      removeTransition();
//      setTranslateY(distanceY+"px");
//      isMove = true;
//  });
//  historyBox.addEventListener("touchend",function(e){
//      if(distanceY > distance){
//          addTransition();
//          setTranslateY("102%");
//      }else{
//          addTransition();
//          historyBox.style.webkitTransform = 'none';
//          historyBox.style.transform = 'none';
//      }
//      startY = moveY = distanceY = 0;
//      isMove = false;
//  });
//
//}