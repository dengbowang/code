var fgm = {
  on: function(element,type,handler){
    return element.addEventListener ? element.addEventListener(type,handler) : element.attachEvent('on' + type,handler);
  },
  bind: function(obj,handler){
    return function(){
      return handler.apply(obj,arguments);
    }
  },
  un: function(element,type,handler){
    return element.removeEventListener ? element.removeEventListener(type,handler) : element.detachEvent('on' + type,handler);
  },
  randomRange: function(lower,upper){
    return Math.floor(Math.random() * (upper - lower + 1) + lower);//获取给定范围内的整数
  },
  getRanColor: function(){
    var str = this.randomRange(0,0xffffff).toString(16);//把随机数转换成表示颜色的十六进制数
    while(str.length<6) str = '0'+ str;
    return '#' + str;
  }
};
//初始化对象
function FireWorks(){
  this.type = 0;
  this.timer = null;
  this.FnManual = fgm.bind(this,this.manual);
}
FireWorks.prototype = {
  init: function(){
    clearTimeout(this.timer);
    fgm.un(document,'click',this.fnManual);
    switch(this.type){
      case 1:
        fgm.on(document,'click',this.fnManual);
        break;
      case 2:
        this.auto();
        break;
    };
  },
  manual: function(e){
    e = e || window.event;
    this.__create__({
      x: e.clientX,
      y: e.clientY
    })
  },
 auto: function ()
	{
		var that = this;
		that.timer = setTimeout(function() {			
			that.__create__({
				x: fgm.randomRange(50, document.documentElement.clientWidth - 50),
				y: fgm.randomRange(50, document.documentElement.clientHeight - 150)
			})	
			that.auto();
		}, fgm.randomRange(900, 1100))
	},

  
  __create__: function(param){
    var that = this,
        oEntity = null,
        oChip = null,
        aChip = [],
        timer = null,
        oFrag = document.createDocumentFragment();
    
    oEntity = document.createElement('div');
    with(oEntity.style){
      position = 'absolute';
      top = document.documentElement.clientHeight + 'px';
      left = param.x + 'px';
      width = '4px';
      height = '30px';
      borderRadius = '4px';
      background = fgm.getRanColor();
    };
    document.body.appendChild(oEntity);
    oEntity.timer = setInterval(function(){
      oEntity.style.top = oEntity.offsetTop - 20 + 'px';
      if(oEntity.offsetTop <= param.y){
        clearInterval(oEntity.timer);
        document.body.removeChild(oEntity);
        (function(){
         //在50-100之间随机生成碎片
			//由于IE浏览器处理效率低, 随机范围缩小至20-30
			//自动放烟花时, 随机范围缩小至20-30
          var len = (/msie/i.test(navigator.userAgent) || that.type === 2) ? fgm.randomRange(20,30) :
          fgm.randomRange(50,100);
          
          for(i = 0;i < len;i++){
            oChip = document.createElement('div');
            with(oChip.style){
              position = 'absolute';
              top = param.y + 'px';
              left = param.x + 'px';
              width = '4px';
              height = '4px';
              overflow = 'hidden';
              borderRadius = '4px';
              background = fgm.getRanColor();
            };
            oChip.speedX = fgm.randomRange(-20,20);
            oChip.speedY = fgm.randomRange(-20,20);
            oFrag.appendChild(oChip);
            aChip[i] = oChip;
          }
          document.body.appendChild(oFrag);
          timer = setInterval(function(){
            for(i = 0;i< aChip.length; i++){
              var obj = aChip[i];
              with(obj.style){
                top = obj.offsetTop + obj.speedY + 'px';
                left = obj.offsetLeft + obj.speedX + 'px';
              };
              obj.speedY++;
              (obj.offsetTop < 0 || obj.offsetLeft < 0 || obj.offsetTop > document.documentElement.clientHeight 
              || obj.offsetLeft > document.documentElement.cientWidth) && (document.body.removeChild(obj),aChip.splice(i,1));
              
            }
            !aChip[0] && clearInterval(timer);
          },30)
        })();
      }
    },30)
    console.log(navigator.userAgent);
  }
};

fgm.on(window,'load',function(){
  var oTips = document.getElementById('tips');
  var aBtn = oTips.getElementsByTagName('a');
  var oFireWorks = new FireWorks();
  
  fgm.on(oTips,'click',function(e){
    var e = e || window.event;
    var oTarget = e.target || e.srcElement;
    var i=0;
    if(oTarget.tagName.toUpperCase() == 'A'){
      for(i=0;i< aBtn.length;i++){
        aBtn[i].className = '';
      }
      switch(oTarget.id){
          case 'manual':
            oFireWorks.type = 1;
            break;
          case 'auto':
            oFireWorks.type = 2;
            break;
          case 'stop':
            oFireWorks.type = 0;
            break;
      }
      oFireWorks.init();
      oTarget.className = 'active';
      e.stopPropagation ? e.stopPropagation() : e.cancelBubble = true;
    }
  })
})
//console.log(FireWorks.prototype);