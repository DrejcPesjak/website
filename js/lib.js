function markBooks() {
	//console.log(event.target.className);
	var classA = event.target.className;
	var books = document.querySelectorAll("li");
	
	for(var b in books) {
		console.log(b, books[b]);
		if(books[b].className == classA)
			books[b].style.color = "blue";
		else
			books[b].style.color = "black";
	}

}
