//所用技术：oop dom 事件
//1.绘制地图
//2.绘制食物
//3.绘制小蛇
//4.小蛇移动
//
//1.绘制地图
function Map(){
	//设置私有成员变量，方便维护
	var w = 640;
	var h = 400;

	this.showmap = function(){
		//创建div，设置css，追加给body
		var div1 = document.createElement('div');
		div1.style.width = w + 'px';
		div1.style.height = h + 'px';
		//设置背景图片
		div1.style.backgroundImage = 'url(./image/12.jpg)';
		document.body.appendChild(div1);
	}
}

//2.绘制食物
function Food(){
	//食物为一个正方形
	var len = 20;
	//便于外部访问
	this.xFood = 0;  
    this.yFood = 0;
    this.piece = null;
	this.showfood = function(){
		//创建div、设置样式、追加给body
                //保证页面只有一个食物的div存在
            if(this.piece===null){
                this.piece = document.createElement('div');
                this.piece.style.width = this.piece.style.height = len+"px";
                this.piece.style.backgroundColor = "green";
                //给食物设置“绝对定位 position/left/top”
                this.piece.style.position="absolute";
                document.body.appendChild(this.piece);
                }
		//食物随机
		//步进值每次移动最少20px
		//真实坐标=权值坐标*20  X轴640/2（0-32）Y轴(0-19)
		//食物需要放到“小格子”里边，不能压线
        //食物移动的最小距离是“步进值”，值为20
        //食物移动的距离称为"权",x轴有权坐标(0-39)，y轴也有权坐标(0-19)
        //食物移动的真实距离：步进值 * 权
        //食物的“随机”权坐标设置
		this.xFood = Math.floor(Math.random()*32); //0-32的随机数
	    this.yFood = Math.floor(Math.random()*20); //0-20的随机数
		this.piece.style.left = this.xFood*len+'px';
		this.piece.style.top = this.yFood*len+'px';
		
	}
}

		//3.绘制小蛇
function Snake(){
            var len = 20; //蛇节的边长
            //定义小蛇(二维数组)
            //每个蛇节：[x轴，y轴，颜色，蛇节div节点对象]
            this.snakebody = [[0,1,'white',null],[1,1,'white',null],[2,1,'white',null],[3,1,'black',null]];
            
            this.redirect = "right"; //默认移动方向

            //a.绘制小蛇
            this.showsnake = function(){
                //遍历snakebody创建4个div蛇节、设置样式、追加给body
                for(var i=0; i<this.snakebody.length; i++){
                    //以下创建的蛇节数量有限制，不能无限创建
                    //把创建好的蛇节给保存起来，以便后期进行对比
                    if(this.snakebody[i][3]===null){
                        this.snakebody[i][3] = document.createElement('div');
                        this.snakebody[i][3].style.width = this.snakebody[i][3].style.height = len+"px";
                        this.snakebody[i][3].style.backgroundColor = this.snakebody[i][2];//颜色
                        
                        //给蛇节设置“绝顶定位”
                        this.snakebody[i][3].style.position = "absolute";
                        document.body.appendChild(this.snakebody[i][3]);
                    }
                    this.snakebody[i][3].style.left = this.snakebody[i][0] * len+"px";
                    this.snakebody[i][3].style.top  = this.snakebody[i][1] * len+"px";
                }
            }

            //b. 移动小蛇
            this.movesnake = function(){
                //移动算法：当前蛇节的“新坐标”等于下个蛇节的“旧坐标”
                //非头部蛇节
                for(var n=0; n<this.snakebody.length-1; n++){
                    this.snakebody[n][0] = this.snakebody[n+1][0];
                    this.snakebody[n][1] = this.snakebody[n+1][1];
                }
                //头部蛇节
                if(this.redirect=="right"){
                    this.snakebody[this.snakebody.length-1][0] += 1;
                }
                if(this.redirect=="left"){
                    this.snakebody[this.snakebody.length-1][0] -= 1;
                }
                if(this.redirect=="down"){
                    this.snakebody[this.snakebody.length-1][1] += 1;
                }
                if(this.redirect=="up"){
                    this.snakebody[this.snakebody.length-1][1] -= 1;
                }

                //触碰食物
                //蛇头坐标
                var snakeX = this.snakebody[this.snakebody.length-1][0];
                var snakeY = this.snakebody[this.snakebody.length-1][1];
                //食物坐标 food.foodX/food.foodY
                if(snakeX==food.xFood && snakeY==food.yFood){
                    //增加蛇节：增加蛇节的坐标  等于 小蛇“尾部蛇节的旧坐标”
                    var newjie = [this.snakebody[0][0],this.snakebody[0][1],'white',null];
                    //unshift()给数组头部追加元素
                    this.snakebody.unshift(newjie);

                    //生成新食物
                    food.showfood();
                   

                    count+=1;
    				document.getElementById('count').innerHTML ="您吃到了"+count+"个食物";
                }

                //控制小蛇在指定范围内移动
                if(snakeX<0  ||  snakeX>31  || snakeY<0  || snakeY>19){
                    var c =confirm('game over,得分:'+count);
                    clearInterval(mytime);//清除间隔函数
                    if (c==true) {
                        	location.href = 'index.html';
                        }else{
                        	window.close();
                        }
                }
                //不能吃到自己(蛇头坐标 与 非蛇头蛇节坐标一致就是吃到自己)
                for(var k=0; k<this.snakebody.length-1; k++){//遍历非蛇头蛇节坐标
                    if(snakeX==this.snakebody[k][0] && snakeY==this.snakebody[k][1]){
                        var c =confirm('碰到了自己,得分:'+count);
                        clearInterval(mytime);
                        if (c==true) {
                        	location.href = 'index.html';
                        }else{
                        	window.close();
                        }

                    }
                }
                //根据新坐标重新绘制小蛇
                this.showsnake();
            }
        }



window.onload = function(){
	//显示地图
	var map = new Map();
	map.showmap();
	//显示食物
	food = new Food();
	food.showfood();
	//显示小蛇
	snake = new Snake(); //snake对象是全局的
    snake.showsnake(); //绘制小蛇
    //setInterval(全局变量信息，时间)

    count = 0;
    mytime = setInterval("snake.movesnake()",200); //移动小蛇
    
    //给document设置键盘事件，控制小蛇移动方向
            // document.onkeydown = function(evt){
            //     var num = evt.keyCode;
            //     if(num==40){
            //         snake.redirect = "down";
            //     }
            //     if(num==38){
            //         snake.redirect = "up";
            //     }
            //     if(num==37){
            //         snake.redirect = "left";
            //     }
            //     if(num==39){
            //         snake.redirect = "right";
            //     }

            // }
    document.getElementById('up').onclick = function(){
    	snake.redirect = "up";
    }
    document.getElementById('down').onclick = function(){
    	snake.redirect = "down";
    }
    document.getElementById('left').onclick = function(){
    	snake.redirect = "left";
    }
    document.getElementById('right').onclick = function(){
    	snake.redirect = "right";
    }
}
