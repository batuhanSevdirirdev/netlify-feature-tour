let latitude = "";
let longitude = "";
/*
Json 
-> Veri yapısı :
(Dış kaynaktan veri çekme yapılmayacak.)
var data = 
{
    key value ilişkisiyle çalışır.
    kisiler : ["Batuhan","Esmer"],
    islem : "Get"
    iki nokta kullanılır arada
  {} -> Bir nesneyi temsil eder. Json içerisinde bir nesne tutuluyorsa {} ile gösterilir.  

} 

*/
// Konum bilgisi alındığında çalışacak fonksiyon
function onSuccess(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;
    initMap();

    const api_key = "6218abd95ab347c2acd03f14d6692829"; // OpenCageData API anahtarınız
    const url = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=${api_key}`;
    var data = fetch("https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=Museum%20of%20Contemporary%20Art%20Australia&inputtype=textquery&key=AIzaSyBXlKHnlcR1VJhbFyER3hWygDbHhfTJcGQ")
    .then(response => response.json());
    console.log(data);

    fetch(url)
        .then(response => response.json())
        .then(result => {
            if (result.results.length > 0) {
                let details = result.results[0].components;
                let { country, postcode, province } = details;
                document.getElementById("result").innerHTML = `
                    <p>Ülke: ${country}</p>
                    <p>Posta Kodu: ${postcode}</p>
                    <p>Şehir: ${province}</p>`;
            } else {
                document.getElementById("result").innerHTML = "<p>Konum bilgisi bulunamadı.</p>";
            }
        })
        .catch(error => {
            console.error('Hata:', error);
        });
}

// Konum bilgisi alınamadığında çalışacak fonksiyon
function onError(error) {
    if (error.code === 1) {
        alert("Kullanıcı erişim iznini reddetti.");
    } else if (error.code === 2) {
        alert("Konum alınamadı.");
    } else {
        alert("Bir hata oluştu.");
    }
}

// Haritayı başlatma fonksiyonu
async function initMap() {
    // Google Maps API'yi doğrudan kullanın
    const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat: latitude || 41.015137, lng: longitude || 28.979530 },
        zoom: 15, // Yakınlaştırma seviyesini artırabilirsiniz
    });

    new google.maps.Marker({
        position: { lat: latitude || 41.015137, lng: longitude || 28.979530 },
        map: map,
        title: "Mevcut Konum",
    });
}

// Konum bilgisi alındığında haritayı başlat
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
} else {
    alert("Tarayıcınız konum bilgisi alamıyor...");
}
