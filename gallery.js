function setLogout() {
	document.getElementById("logout").value = "logout";
	updateForm();
}

function setLogin() {
	document.getElementById("login").value = "login";
	updateForm();
}

function downloadAll() {
	
} // downloadAll

function updateForm() {
	document.getElementById("form").submit();
}

function setGlobals() {
	currentImage = "";
	currentNum = -1;
	currentApproval = true;
	lightboxset = false;
	searchtext = "";
	imagesDisplayed = [];
	approvals = [];
	isEditor = document.getElementById('editorphp').value;
} // setGlobals

function notifyResize() {
	
	var viewportwidth;
	var viewportheight;
	  
	// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
	  
	if (typeof window.innerWidth != 'undefined') { 
		viewportwidth = window.innerWidth,
		viewportheight = window.innerHeight
	} else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
		viewportwidth = document.documentElement.clientWidth,
		viewportheight = document.documentElement.clientHeight
	} else {
		viewportwidth = document.getElementsByTagName('body')[0].clientWidth,
		viewportheight = document.getElementsByTagName('body')[0].clientHeight
	} // if else
	
	document.getElementById("searchbox").size = viewportwidth/82;
	
	var myNode = document.getElementById("lightbox");
	
	while (myNode.firstChild) {
		myNode.removeChild(myNode.firstChild);
	} // while
	
	if (lightboxset) {
		showLightbox(currentImage, currentNum, currentApproval);
	} // if

} // notifyResize

var xmlhttp = new XMLHttpRequest();
var url = "galleryinfo.json";

xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
        var arr = JSON.parse(this.responseText);
        myFunction(arr);
    } // if
}; // onstatechange function
xmlhttp.open("POST", url, true);
xmlhttp.send(); 	

function showLightbox(file, num, approved) {

	var imageIsSmall = false;
	lightboxset = true;
	currentNum = num;
	currentImage = file;
	currentApproval = approved;

	disableScroll(); // stop user scrolling
	console.log(num);
	var div = document.createElement("div");
	div.style.width = window.innerWidth + "px";
	div.style.height = window.innerHeight + "px";
	div.style.background = "black";
	div.style.opacity = "0.5";
	div.style.position = "fixed";
	div.style.top = "0px";
	div.style.left = "0px";
	
	document.getElementById("lightbox").appendChild(div);
	
	// add image to lightbox
	var img = document.createElement("img");
	img.src = file;
	img.onload = function() {
	
		var rightDist = (window.innerWidth - img.width) / 2;
		var topDist = (window.innerHeight - img.height) / 2;		
		img.style.position = "fixed";
		img.style.top = topDist + "px";
		img.style.left = rightDist + "px";
		
		if (img.height < 300 || img.width < 200) {
			imageIsSmall = true;
		}

		if (img.width/window.innerWidth > img.height/window.innerHeight) {
			if (img.width > window.innerWidth - 100) {
				var ratio = img.width/(window.innerWidth - 100);
				img.style.width = (window.innerWidth - 100) + "px";
				topDist = (window.innerHeight - img.height / ratio)/2;
				rightDist = (window.innerWidth - (window.innerWidth - 100))/2;
				img.style.top = topDist + "px";
				img.style.left = rightDist + "px";
			} // if
		} else {
			if (img.height > (window.innerHeight - 150)) {
				var ratio = img.height/(window.innerHeight - 150);
				img.style.height = (window.innerHeight - 150) + "px";
				topDist = (window.innerHeight - (window.innerHeight - 150))/2;
				rightDist = (window.innerWidth - img.width / ratio)/2;
				img.style.top = topDist + "px";
				img.style.left = rightDist + "px";
			} // if
		} // if else
		
		document.getElementById("lightbox").appendChild(img);
		
		var rightButton = null;
		
		if (num < counter) {
			rightButton = document.createElement("img");
			rightButton.src = 'assets/rightButton.png';
			rightButton.onload = function() {
				rightButton.style.position = "fixed";
				rightButton.style.top =  + (window.innerHeight - rightButton.height) / 2 + "px";
				rightButton.style.left = window.innerWidth - rightButton.width - 50 + "px";
			}; // rightButton onload
			
			rightButton.onclick = function () {
				div.parentElement.removeChild(div); // remove lightbox
				img.parentElement.removeChild(img);
				if (leftButton !== null) {
					leftButton.parentElement.removeChild(leftButton);
				} // if
				rightButton.parentElement.removeChild(rightButton);
				div2.parentElement.removeChild(div2);
				showLightbox("uploadedImages/" + imagesDisplayed[num], num+1, (approvals[num]=="yes"));
			}; // div onclick
			
			document.getElementById("lightbox").appendChild(rightButton);
		} // if 
		
		
		var leftButton = null;
		if (num != 1) {
			leftButton = document.createElement("img");
			leftButton.src = 'assets/leftButton.png';
			leftButton.onload = function() {
				leftButton.style.position = "fixed";
				leftButton.style.top = (window.innerHeight - leftButton.height) / 2 + "px";
				leftButton.style.left = "75px";
			};
		
			leftButton.onclick = function () {
				div.parentElement.removeChild(div); // remove lightbox
				img.parentElement.removeChild(img);
				div2.parentElement.removeChild(div2);
				if (rightButton !== null) {
					rightButton.parentElement.removeChild(rightButton);
				}
				leftButton.parentElement.removeChild(leftButton);
				showLightbox("uploadedImages/" + imagesDisplayed[num-2], num-1, (approvals[num-2]=="yes"));
			};
			
			document.getElementById("lightbox").appendChild(leftButton);
		} // if
		
		var div2 = document.createElement("div");
		if (isEditor != "") {
			div2.style.height = "129px";
		} else {
			div2.style.height = "93px";
		}
		div2.style.opacity = "1";
		div2.style.position = "fixed";
		div2.style.top = topDist + "px";
		div2.style.left = rightDist + "px";
		div2.style.backgroundColor = "black";
		div2.style.color = "white";
		div2.style.border = "thin solid black";
		
		if (imageIsSmall) {
			if (isEditor != "") {
				div2.style.top = topDist - 129 + "px";
			} else {
				div2.style.top = topDist - 93 + "px";
			}
		}

	
		var text = document.getElementById(num).name;
		var index = text.indexOf('Description:');
		var index2 = text.indexOf('Tags:');
		var part1 = text.substring(0, index);
		var part2 = text.substring(index, index2);
		var part3 = text.substring(index2, text.length);
		var para = document.createElement("pre");
		var node = document.createTextNode(' ' + part1);
		var para2 = document.createElement("pre");
		var node2 = document.createTextNode(' ' + part2);
		var para3 = document.createElement("pre");
		var node3 = document.createTextNode(' ' + part3);
				
		para.appendChild(node);
		para2.appendChild(node2);
		para3.appendChild(node3);
		
		document.getElementById("lightbox").appendChild(div2);
		div2.appendChild(para);
		div2.appendChild(para2);
		div2.appendChild(para3);
		
		var length = part1.length;
		if (part2.length > part1.length && part2.length > part3.length) {
			length = part2.length;
		} else if (part3.length > part1.length) {
			length = part3.length;
		} // if else

		div2.style.width = length * 8 + "px";
		
		if (isEditor != "") {
			if (length * 8 < 202) {
				div2.style.width = "202px";
			}
			
			var button = document.createElement("button");
			button.style.marginLeft = "7.5px";
			button.innerHTML = "Download";

			var a = document.createElement('a');
			a.href = file;
			a.download = part1.replace(" ", "");
			a.appendChild(button);
			
			var button2 = document.createElement("button");
			button2.style.marginLeft = "7.5px";
			button2.innerHTML = "Delete image";
			button2.name = "delete";
			button2.value = file;
			
			div2.appendChild(a);
			div2.appendChild(button2);
			
			
			button2.onclick = function() {
				document.getElementsByName("postvar")[0].value = this.value;
				updateForm();
			};
	
			if (!approved) {
				var button3 = document.createElement("button");
				button3.style.marginLeft = "7.5px";
				button3.innerHTML = "Approve image";
				button3.name = "approve";
				button3.value = file;
			
				if (length * 8 < 307) {
					div2.style.width = "307px";
				}
				div2.appendChild(button3);
		
				
				button3.onclick = function() {
					document.getElementsByName("imageToApprove")[0].value = this.value;
					updateForm();
				};
			} // if
			
			
			
		} // if
		
		
		
		// add onclick to the lightbox
		div.onclick = function () {
			lightboxset = false;
			this.parentElement.removeChild(this); // remove lightbox
			img.parentElement.removeChild(img);
			div2.parentElement.removeChild(div2);
			if (rightButton !== null) {
				rightButton.parentElement.removeChild(rightButton);
			}
			if (leftButton !== null) {
				leftButton.parentElement.removeChild(leftButton);
			}
			enableScroll(); // let user scroll
		}; // div onclick
		
		img.onclick = function () {
			lightboxset = false;
			this.parentElement.removeChild(this); // remove lightbox
			div.parentElement.removeChild(div);
			div2.parentElement.removeChild(div2);			
			if (rightButton !== null) {
				rightButton.parentElement.removeChild(rightButton);
			}
			if (leftButton !== null) {
				leftButton.parentElement.removeChild(leftButton);
			}
			enableScroll(); // let user scroll
		}; // img onclick
		
	}; // img onload
	
} // showLightbox


var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault) e.returnValue = false;  
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  document.addEventListener('wheel', preventDefault, {passive: false}); // Disable scrolling in Chrome
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    document.removeEventListener('wheel', preventDefault, {passive: false}); // Enable scrolling in Chrome
    window.onmousewheel = document.onmousewheel = null; 
    window.onwheel = null; 
    window.ontouchmove = null;  
    document.onkeydown = null;  
}




// search images
function myFunction(arr) {
    var searchresults = []; 	
	var orderedResults = [];
	var temp = [];
	imagesDisplayed = [];
	approvals = [];
    var out = "";
    var i;
	var search = document.getElementById('searchphp').value;
	var privacy = document.getElementById('privacyphp').value;
	var sort = document.getElementById('sortphp').value;
	var approval = "yesno";

	isEditor = document.getElementById('editorphp').value;
	
	counter = 0;
	if (isEditor == "") {
		privacy = "public";
		approval = "yes";
	}

	if (search == "Akjldsaflkjbsafd890123840-") {
		search = "";
	}
	
    for(i = 0; i < arr.length; i++) {
         searchresults.push(arr[i]);
    }
	
	if (sort == "date") {
		for (i = 0; i < searchresults.length; i++) {
			var resultString = searchresults[i].first + ' ' + searchresults[i].last + ' ' + searchresults[i].description + ' ' + searchresults[i].tags;
			if (resultString.includes(search) && privacy.includes(searchresults[i].privacy) && approval.includes(searchresults[i].approved)) {
				counter ++;
				imagesDisplayed.push(searchresults[i].imageFile);
				var method = 'onclick="showLightbox(\'uploadedImages/' + searchresults[i].imageFile + '\', ' + counter + ',' + (searchresults[i].approved == "yes") + ');"';
				var style = 'style="padding-left:15px;padding-top:12px;"';
				var description = "'" + 'Submitted by: ' + searchresults[i].first + ' ' + searchresults[i].last + ' Description: ' + searchresults[i].description + ' Tags: ' + searchresults[i].tags + "'";
				var id = '"' + counter + '"';
				out += '<img name=' + description + 'id=' + id + 'src="thumbs/' + searchresults[i].imageFile + '"' + method + style + '>';
				approvals.push(searchresults[i].approved);
			} // if
		} // for
	} else {
		for (i = 0; i < searchresults.length; i++) {
			if (sort == "first") {
				orderedResults[i] = (searchresults[i].first + ' ' + searchresults[i].last + ' ' + searchresults[i].description + ' ' + searchresults[i].tags).replace(" ", "");
			} else {
				orderedResults[i] = (searchresults[i].last + ' ' + searchresults[i].first + ' ' + searchresults[i].description + ' ' + searchresults[i].tags).replace(" ", "");
			} // if else
		} // for
		
		orderedResults.sort();
		
		if (sort == "first") {
			for (x = 0; x < searchresults.length; x++) {
				for (y = 0; y < searchresults.length; y++) {
					if ((searchresults[y].first + ' ' + searchresults[y].last + ' ' + searchresults[y].description + ' ' + searchresults[y].tags).replace(" ", "") == orderedResults[x]) {
						var resultString = searchresults[y].first + ' ' + searchresults[y].last + ' ' + searchresults[y].description + ' ' + searchresults[y].tags;
						console.log(method);
							if (resultString.includes(search) && privacy.includes(searchresults[y].privacy) && approval.includes(searchresults[y].approved)) {
								counter ++;
								imagesDisplayed.push(searchresults[y].imageFile);
								var method = 'onclick="showLightbox(\'uploadedImages/' + searchresults[y].imageFile + '\', ' + counter + ',' + (searchresults[y].approved == "yes") + ');"';
								var style = 'style="padding-left:15px;padding-top:12px;"';
								var description = "'" + 'Submitted by: ' + searchresults[y].first + ' ' + searchresults[y].last + ' Description: ' + searchresults[y].description + ' Tags: ' + searchresults[y].tags + "'";
								var id = '"' + counter + '"';
								out += '<img name=' + description + 'id=' + id + 'src="thumbs/' + searchresults[y].imageFile + '"' + method + style + '>';
								approvals.push(searchresults[y].approved);
						} // inner if
					} // outer if
				} // for
			} // for
		} else {
			for (x = 0; x < searchresults.length; x++) {
				for (y = 0; y < searchresults.length; y++) {
					if ((searchresults[y].last + ' ' + searchresults[y].first + ' ' + searchresults[y].description + ' ' + searchresults[y].tags).replace(" ", "") == orderedResults[x]) {
						var resultString = searchresults[y].first + ' ' + searchresults[y].last + ' ' + searchresults[y].description + ' ' + searchresults[y].tags;
						console.log(method);
						if (resultString.includes(search) && privacy.includes(searchresults[y].privacy) && approval.includes(searchresults[y].approved)) {
							counter ++;
							imagesDisplayed.push(searchresults[y].imageFile);
							var method = 'onclick="showLightbox(\'uploadedImages/' + searchresults[y].imageFile + '\', ' + counter + ',' + (searchresults[y].approved == "yes") + ');"';
							var style = 'style="padding-left:15px;padding-top:12px;"';
							var description = "'" + 'Submitted by: ' + searchresults[y].first + ' ' + searchresults[y].last + ' Description: ' + searchresults[y].description + ' Tags: ' + searchresults[y].tags + "'";
							var id = '"' + counter + '"';
							out += '<img name=' + description + 'id=' + id + 'src="thumbs/' + searchresults[y].imageFile + '"' + method + style + '>';
							approvals.push(searchresults[y].approved);
						} // inner if
					} // outer if
				} // for
			} // for
		} // if else
	} // if else
		
	
   
   document.getElementById("id01").innerHTML = out;
} // myFunction