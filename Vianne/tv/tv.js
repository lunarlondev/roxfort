document.addEventListener("DOMContentLoaded",tv);
function tv() {
console.log("TV JS ELINDULT");
	var cnv = document.getElementById("static"),
		c = cnv.getContext("2d"),
		cw = cnv.width,
		ch = cnv.height,

		staticScrn = c.createImageData(cw,ch),
		staticFPS = 30,
		isStatic = false,
		staticTO,
		gifData = [
			{
				file: "https://astoldbylaura.wordpress.com/wp-content/uploads/2017/10/giphy2.gif",
				desc: "Deathly Hallows"
			},
			{
				file: "https://64.media.tumblr.com/ae9013e908dc1d63bd28359ff5ec22e6/tumblr_inline_nvl93yNCaY1qlgi1f_540.gif",
				desc: "Főzőműsor"
			},
			{
				file: "https://i.pinimg.com/originals/e0/22/2a/e0222a1ddbcb5af2a6d71acf499fb1ca.gif",
				desc: "Romantikus program"
			},
			{
				file: "https://i.pinimg.com/originals/67/e1/da/67e1daba60cba11fc267eb4f238b1edf.gif",
				desc: "Kviddics",
			},
			{
				file: "https://media3.giphy.com/media/v1.Y2lkPTc5MGI3NjExNnhpaTFibzRkaWJoM2puZWRybW1wZDk4Z3hidWpvbXpvb2NmaGZqdyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/xUA7aXOgbZTZvZZWlW/giphy.gif",
				desc: "Talk Show",
			},
			{
				file: "https://i.pinimg.com/originals/19/57/ac/1957ac0ce349954c86b3c86d676abd37.gif",
				desc: "Static",
			},
			{
				file: "https://64.media.tumblr.com/8b95c5385d6613c6ed01edca0b32c1d2/991d3a60a9d7309c-bc/s400x600/b82d239e82dfde775d6b00f73ec4793985d5b0a6.gif",
				desc: "Vi",
			}
		],
		gifs = [],
		channel = 0;

	for (let g = 0; g < gifData.length; g++) {
    gifs.push(new Image());
    gifs[g].src = gifData[g].file;
    gifs[g].alt = gifData[g].desc;
}

	/* Static */
	var runStatic = function() {
		isStatic = true;
		c.clearRect(0,0,cw,ch);

		for (var i = 0; i < staticScrn.data.length; i += 4) {
			let shade = 127 + Math.round(Math.random() * 128);
			staticScrn.data[0 + i] = shade;
			staticScrn.data[1 + i] = shade;
			staticScrn.data[2 + i] = shade;
			staticScrn.data[3 + i] = 255;
		}
		c.putImageData(staticScrn,0,0);

		staticTO = setTimeout(runStatic,1e3/staticFPS);
	};
	runStatic();

	/* Channels */
	var changeChannel = function() {
		var displayed = document.getElementById("displayed");

		++channel;
		if (channel > gifData.length)
			channel = 1;

		this.classList.remove("pristine");
		this.style.transform = `rotate(${channel * 360/(gifData.length + 1)}deg)`;

		cnv.classList.remove("hide");
		displayed.classList.add("hide");

		if (!isStatic)
			runStatic();

		setTimeout(function(){
			cnv.classList.add("hide");
			displayed.classList.remove("hide");

			displayed.src = gifs[channel - 1].src;
			displayed.alt = gifs[channel - 1].alt;

			isStatic = false;

			clearTimeout(staticTO);
		},300);
	};
	document.getElementById("channel").addEventListener("click",changeChannel);
}