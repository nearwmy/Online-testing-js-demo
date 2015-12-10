$(function(){
	var answers=["common","results","consequently","basis","detection","monitor","symbols","average","dramatically","symptoms","reason","distributed","including","developing","shared"];
	var curAnswer=[],k='';
	var wordCon=$('.m-td');

	//初始化页面
	$('.a-as-btns img').css('display','none');
	$('.a-as-btns span').eq(0).addClass('activeBtn').find('img').css('display','inline');
	 //对数组重新排序输出
	 function sortArr(inputArr){
	 	for(k in inputArr){
		if (inputArr.hasOwnProperty(k)) {
        	curAnswer.push(inputArr[k]);
      		}
   		 }

    	curAnswer.sort(function () {
      		return 0.5 - Math.random();
   		 });
    	return curAnswer;  //返回当前数组
	 }
		sortArr(answers);

		//将当前数组的值依次添加到td中
			for(var i=0;i<curAnswer.length;i++){
				var that=curAnswer[i];
				wordCon.eq(i).text(that);
			}
			
		//文档输入框激活状态
		function textActive(obj,index){
			var tobj=$(obj);
			if(index==undefined){
				tobj.addClass('active').siblings('.select').removeClass('active');
			}else{
				tobj.eq(index).addClass('active').siblings('.select').removeClass('active');

			}
		}

		//按钮激活状态
		function btnActive(obj,index){
			var bobj=$(obj);
			if(index==undefined){
				bobj.addClass('activeBtn').find('img').css('display','inline').parent('span').siblings('span').removeClass('activeBtn').find('img').css('display','none');
			}else{
				bobj.eq(index).addClass('activeBtn').find('img').css('display','inline').parent('span').siblings('span').removeClass('activeBtn').find('img').css('display','none');
			}
		}

		function getArray(arr2,arr1){   //比较两个字符串，取出不同的值
			var arr3 = [],obj = {};
		 	for(var i=0,len=arr1.length; i<len; i++){
		 		obj[arr1[i]] = 1;
		 	}
		 	for(var j=0,jlen=arr2.length; j<jlen; j++){
		 		if(obj[arr2[j]]){//存在则置为2
		 			obj[arr2[j]] = 2;
		 		}
		 	}
		 	for(var key in obj){
		 		if(obj[key] == 1){
		 			arr3.push(key.toString());
		 		}
		 	}
		 	return arr3;
		}

		function compareStr($dom1,$dom2){  //根据不同的值，在重新选择时，之前的选择状态去掉
			var textList=[],wordList=[],tempStr=[];
			
			for(var i=0;i<$dom1.length;i++){
				wordList.push($dom1[i].innerHTML);
			}
			for(var i=0;i<$dom2.length;i++){
				textList.push($dom2[i].innerHTML);
			}

			tempStr = getArray(textList,wordList);
			$.each($dom1,function(k,d){
				if($(d).text() === tempStr[0]){
					$(d).removeClass("checked");
				}
			})
		}
		
		
		//点击操作
		function active(textObj,btnObj,words){
			textObj.click(function(){
				var index=$(this).index();
				textActive(this);
				btnActive(btnObj,index);
				if($(this).hasClass('disabled active')){
					$(this).removeClass('disabled');
				}
			})
			btnObj.click(function(){
				var index=$(this).index(),curText=$(textObj);
				btnActive(this);
				textActive(textObj,index);
				if(curText.eq(index).hasClass('disabled active')){
					curText.eq(index).removeClass('disabled');
				}
			})
			words.mouseover(function(){
				if(textObj.hasClass('active')){
					$('.active').text($(this).text());
				}
			}).click(function(){
				$('.active').text($(this).text());
				if(textObj.hasClass('active')){
					$(this).addClass('checked');

					textObj.each(function(){
						if($(this).hasClass('active')){
							$(this).removeClass('active').addClass('disabled');
						}
					})
					compareStr($('.checked'),$('.disabled'));
				}
			})
		}

		//根据答案测试
		function test(textObj,score,url){
					$.ajax({
						url:url,
						type:"post",
						datatype:"json",
						success:function(data){
							$.each(textObj,function(k,d){
								var index=$(d).index()+1;
								if(index=data.quesNum&&$(d).text()==data.answer){
									score+=10;
									return score;
									console.log($(d).text());
								}
							})
						},
						error:function(data){
							console.log("为取到数据");
						}
					})
				}

		//测试成绩公布，提交按钮操作
		function complete(overBtn,textObj,url){
			var score=0;
			overBtn.click(function(){

				if($('.disabled').length==textObj.length){
					test(textObj);
					alert('正确率'+score+'%');
					return false;
				}else{
					alert('题目还没有做完，亲！');
					return false;
				}
			})
		}

		//清除按钮操作
		function clear(clearBtn,textObj){
			clearBtn.click(function(){
					$.each(textObj,function(k,d){
						$(d).empty();
					})
					$.each($('.checked'),function(k,d){
						$(d).removeClass('checked');
					})
				})
		}

		//整个函数的入口，提供变量参数
		function submit(textObj,overBtn,clearBtn,url,words,btnObj){
			active(textObj,btnObj,words);
			clear(clearBtn,textObj);
			complete(overBtn,textObj);
		}

		submit($('.select'),$('.complete'),$('.clear'),"js/answer.js",$('.a-as-options td'),$('.a-as-btns span'));

})