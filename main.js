var url = 	"https://cors.abdullahoguk.workers.dev/?https://covid19.saglik.gov.tr";
var covidData = {};
var canvas = document.querySelector("#canvas");

fetch(url)
	.then(res => {
		return res.text();
	})
	.then(handleCorsresult);

function handleCorsresult(result) {
	covidData = scrape(result);
	//render
	render();
	document.querySelector(".content.loading").classList.remove("loading");
}

function scrape(html) {
	var parser = new DOMParser();
	var doc = parser.parseFromString(html, "text/html");

	let data = { total: {}, today: {}, date: {}, history: {} };

	let rawDate = [...doc.querySelectorAll(".takvim p")].map(item =>
		item.innerHTML.trim()
	);
	data.date = { gun: rawDate[0], ay: rawDate[1], yil: rawDate[2] };

    var rawTotalValues = [...doc.querySelectorAll("ul.list-group")[0].querySelectorAll("li span:nth-child(2)")]
        .map(item => item.innerHTML.trim());
	setValues("total", rawTotalValues);

	var rawNewValues = [
		...doc.querySelectorAll("ul.list-group")[1].querySelectorAll("li span:nth-child(2)")
	].map(item => item.innerHTML.trim());
	setValues("today", rawNewValues);

	function setValues(parent, arr) {
		arr.forEach(function(item, index) {
			data[parent][Object.keys(labels[parent])[index]] = item;
		});
    }

    let rawScript = doc.querySelectorAll("script")[2].innerHTML;
    
    var a = eval(rawScript)();
    
    /*
	const regex = /(?<=config:[\s\S])[\s\S]*(?=};)/gim;
	let rawHistory = [...doc.querySelectorAll("script")]
		.slice(-1)[0]
		.innerHTML.trim();
	rawHistory = regex.exec(rawHistory);
	//eval(`rawHistory = \{${rawHistory}`)
	console.log(rawHistory);
*/
	return data;
}

let labels = {
	total: {
		test: "Test Edilen",
		vaka: "Vaka",
		vefat: "Vefat",
		yogun: "Yoğ.Bak.",
		entube: "Entube",
		iyilesen: "İyileşen"
	},
	today: {
		test: "Test Edilen",
		vaka: "Vaka",
		vefat: "Vefat",
		iyilesen: "İyileşen"
	}
};

async function render(){
	document.querySelector(".date").innerHTML = await Object.values(covidData.date).join(" ");
	await renderDataCards("total");
	await renderDataCards("today");

	function renderDataCards(parent){
		var elements = document.querySelectorAll(`.${parent} *[data-key]`)
		var data = covidData[parent];
		elements.forEach(function(item){
			var key = item.dataset.key;
			if(item.classList.contains("dataCard")){
				item.querySelector("span.label").innerHTML = labels[parent][key];
				item.querySelector("span.value").innerHTML = data[key];
			}
			else{
				item.innerHTML=data[key];
				item.setAttribute("label", labels[parent][key])
			}
		})
	}
}
