var url = "https://cors.abdullahoguk.workers.dev/?https://covid19.saglik.gov.tr/covid19api?getir=liste";
var today = {};
var allData;
var canvas = document.querySelector("#canvas");

fetch(url)
	.then(res => {
		return res.json();
	})
	.then(handleData);

function handleData(result) {
	allData = result;
  today = allData[0];
	render();
	document.querySelector(".content.loading").classList.remove("loading");
}


let labels = {
		toplam_test: "Test Edilen",
		toplam_vaka: "Vaka",
		toplam_vefat: "Vefat",
		hastalarda_zaturre_oran: "Zaturre Oranı",
		agir_hasta_sayisi: "Ağır Hasta",
		toplam_iyilesen: "İyileşen",
		gunluk_test: "Test Edilen",
		gunluk_vaka: "Vaka",
		gunluk_vefat: "Vefat",
		gunluk_iyilesen: "İyileşen"
};

async function render(){
	document.querySelector(".date").innerHTML = await today.tarih
	await renderDataCards(today);
  //render chart
  //renderChart(allData)
}

function renderDataCards(data){
    
		var elements = document.querySelectorAll(`*[data-key]`)
		
		elements.forEach(function(item){
			var key = item.dataset.key;
			if(item.classList.contains("dataCard")){
				item.querySelector("span.label").innerHTML = labels[key];
				item.querySelector("span.value").innerHTML = data[key];
			}
			else{
				item.innerHTML=data[key];
				item.setAttribute("label", labels[key])
			}
		})
	}
