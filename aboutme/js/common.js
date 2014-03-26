//Init Impress
impress().init();

var con1 = document.querySelector(".mod_con1");
con1.addEventListener("click", function(){
	document.querySelector(".fl").classList.add("pic2");
}, false);