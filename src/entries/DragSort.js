import React from "react";

export const DragSort = React.createClass({
    getDefaultProps : function () {
        return {
            clickElement:null,
            dragElement:null,
            ///collideElement:null,
            dragOver:null,
            time:500,
            moveStop:null,
            type:"ease-out",
            className:"",
            style:{}
        };
    },
    getInitialState: function() {
        return {
            childrenNode:[],
            zIndex: 1,
            aPos:[],
            //position:"absolute"
        };
    },
    //time,fn		--	>optional
    move:function(obj,json){ 
        let optional = {};
        optional.time = this.props.time;
        optional.moveStop = this.props.moveStop;
        optional.type = this.props.type;
        
        var start={};
        var dis={};
        for(var key in json){
            start[key]=parseFloat(this.getStyle(obj,key));
            dis[key]=json[key]-start[key];
        }
        
        var count=Math.round(optional.time/30);
        var n=0;
        
        clearInterval(obj.timer);
        obj.timer=setInterval(function(){
            n++;
            //办事
            for(var key in json){
                
                switch(optional.type){//计算运动到哪
                    case 'linear'://匀速
                        var cur=start[key]+n*dis[key]/count;
                        break;	
                    case 'ease-in'://加速
                        var a=n/count;
                        var cur=start[key]+dis[key]*(a*a*a);	//加速
                        break;	
                    case 'ease-out'://减速
                        var a=1-n/count;
                        var cur=start[key]+dis[key]*(1-a*a*a);	//减速
                        break;	
                }
                if(key=='opacity'){
                    obj.style.opacity=cur;
                    obj.style.filter='alpha(opacity:'+cur*100+')';
                }else{
                    obj.style[key]=cur+'px';
                }
            }
            if(n==count){//停止条件
                clearInterval(obj.timer);
                optional.moveStop  && optional.moveStop();
            }
        },30);
    },
    getStyle:function(obj,attr){
	    return obj.currentStyle?obj.currentStyle[attr]:getComputedStyle(obj,false)[attr];	
    },
    collTest:function(obj1,obj2){
		var l1 = obj1.offsetLeft;
		var t1 = obj1.offsetTop;
		var r1 = l1 + obj1.offsetWidth;
		var b1 = t1 + obj1.offsetHeight;
		
		//var l2 = aPos[obj2.index].left;
		//var t2 = aPos[obj2.index].top;
        //console.log(this.state.aPos,obj2.index);
        var l2 = this.state.aPos[obj2.index].left;
        var t2 = this.state.aPos[obj2.index].top;
		var r2 = l2 + obj2.offsetWidth;
		var b2 = t2 + obj2.offsetHeight;
		
		if(r1 < l2 || b1 < t2 || l1 > r2 || t1 > b2){//没碰到的情况
			return false;
		}

        // let optional = {};
        // optional.collideElement = this.props.collideElement || null;
        // optional.collideElement && optional.collideElement(obj1);

		return true;
		
	},
	getDis:function(obj1,obj2){
		var a = obj1.offsetLeft - this.state.aPos[obj2.index].left;
		var b = obj1.offsetTop - this.state.aPos[obj2.index].top;
		return Math.sqrt(a*a + b*b);
	},
	
	//查询最近的 obj  接触到的话，返回接触到的 aLi【i】，没接触到的话返回null
	findNearest:function(obj){
		var iMin = 99999999999999;
		var iMinIndex = -1;

        const aLi = this.state.childrenNode;
       
		for(var i = 0; i < aLi.length; i++){
			//if(obj == aLi[i]) continue;
			if(this.collTest(obj,aLi[i])){
				//如果碰撞到了，计算 与碰撞aLi[i]之间的  直线 距离
				var dis = this.getDis(obj,aLi[i]);
				if(iMin > dis){
					iMin = dis;
					iMinIndex = i;
				}
			}
		}
		
		if(iMinIndex == -1){
			return null;
		}
		return aLi[iMinIndex];
	},
    drag:function(obj){
        //console.log(obj,parent);
        const _this = this;
        let optional = {};
		//var zIndex = 1;
		obj.onmousedown = function(ev){
            
            optional.clickElement = _this.props.clickElement || null;
            optional.clickElement && optional.clickElement(obj);
            // optional.time = this.props.time || 300;
            // optional.moveStop = this.props.moveStop || null;
            // optional.type = this.props.type||'ease-out';
			var oEvent = ev || event;
			var disX = oEvent.clientX - obj.offsetLeft;
			var disY = oEvent.clientY - obj.offsetTop;
			//obj.style.zIndex = zIndex++;
            //console.log(_this.setState);
            //console.log(this);
             _this.setState({zIndex:_this.state.zIndex+1});
             //console.log(_this.state.zIndex);
             obj.style.zIndex =_this.state.zIndex;
			clearInterval(obj.timer);

			document.onmousemove = function(ev){
				var oEvent = ev || event;
				obj.style.left = oEvent.clientX - disX + "px";
				obj.style.top  = oEvent.clientY - disY + "px";
			
                // 拖拽过程的api
                //console.log(_this);
                optional.dragElement = _this.props.dragElement || null;
                optional.dragElement && optional.dragElement(obj);

                //  查找最近并碰撞 如果碰撞到了，返回被碰撞元素 
                //console.log(_this.state.aPos);
				var oNear = _this.findNearest(obj);
                //console.log("oNear找到啦",oNear);
				if(oNear && obj!= oNear){

					var n = obj.index;
					var m = oNear.index;
					//console.log(n,m);
					let aLi = _this.state.childrenNode;

					if(n<m){
						for(var i = 0; i < aLi.length; i++){
							// n < m  [n+1,m]--
							if(aLi[i].index >= n+1 && aLi[i].index<=m){
								aLi[i].index--;
								//console.log(n, "<", m ,"--",aLi[i].index);
								_this.move(aLi[i],_this.state.aPos[aLi[i].index]);
							}
						}
					} else if(n>m){
						for(var i = 0; i < aLi.length; i++){
							// n > m  [m,n-1]++
							if(aLi[i].index>=m && aLi[i].index <=n-1){
								aLi[i].index++;
								_this.move(aLi[i],_this.state.aPos[aLi[i].index]);
							}
						}
					}
					
					obj.index = m;
				}
			};
			
			document.onmouseup = function(){
                //drag 结束 的 api
                optional.dragOver = _this.props.dragOver || null;
                optional.dragOver && optional.dragOver(obj); 

				document.onmousemove = null;
				document.onmouseup = null;
				obj.releaseCapture && obj.releaseCapture();
				//console.log("up",obj.index);
				_this.move(obj,_this.state.aPos[obj.index]);
			};
			
			obj.setCapture && obj.setCapture();
			return false;	
		};
	},
    componentWillMount:function(){  
        //console.log('componentWillMount',parent);
    },
    componentDidMount:function(){
        
        //console.log(this.props.width)
        const parent = this.refs.father;
        //parent.style.width = this.props.width + "px";
        var aLi = parent.children;
        var aPos = [];
        //布局转换 把他转化为 浮动 元素 
        for(var i=0;i<aLi.length;i++){
            aPos.push({left:aLi[i].offsetLeft,top:aLi[i].offsetTop});	
            aLi[i].style.left=aPos[i].left+'px';
            aLi[i].style.top=aPos[i].top+'px';
        }
        for(var i=0;i<aLi.length;i++){
            aLi[i].style.position='absolute';	
            aLi[i].style.margin=0;
            aLi[i].index=i;
        }
        //2.批量拖拽
        for(var i=0;i<aLi.length;i++){
            this.drag(aLi[i]);	
        }
        //console.log(this.state.aPos)
        this.setState({
            childrenNode:aLi,
            aPos
        });
        //parent.style.width = this.props.width + "px";      
    },
    componentWillReceiveProps:function(nextProps){
        console.log(nextProps);
    },
    render:function(){
        //this._children = []
        const {style,className} = this.props;
        style.display = "flex";
        style.flexWrap = "wrap";
        //console.log( ...style );
        return <div ref="father"  style={style} className={className}   >
           {/* 不需要麻烦的这步
            {
               React.Children.map(this.props.children,child => {
                   return child
               })
            }
        */}
            {this.props.children}
        </div>
    }
});

//  
