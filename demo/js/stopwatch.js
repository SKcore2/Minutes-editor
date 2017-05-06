myButton = 0;	// [Start]/[Stop]のフラグ


function myCheck(){
if (myButton==0){	// Startボタンを押した
myStart=new Date();	// スタート時間を退避
myButton = 1;
$("#watch-btn").text("Stop");
myInterval=setInterval("myDisp()",1);
}else{	// Stopボタンを押した
myDisp();
myButton = 0;
$("#watch-btn").text("start");
clearInterval( myInterval );
}
}
function myDisp(){
myStop=new Date();	// 経過時間を退避
myTime = myStop.getTime() - myStart.getTime();	// 通算ミリ秒計算
myH = Math.floor(myTime/(60*60*1000));	// '時間'取得
myTime = myTime-(myH*60*60*1000);
myM = Math.floor(myTime/(60*1000));	// '分'取得
myTime = myTime-(myM*60*1000);
myS = Math.floor(myTime/1000);	// '秒'取得
myMS = myTime%1000;	// 'ミリ秒'取得
document.myForm.myFormTime.value = myH+":"+myM+":"+myS+":"+myMS;
}
