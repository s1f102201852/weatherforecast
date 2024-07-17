const API_KEY_WEATHER = '7cb7d912c2c7c357d4ff6ea53f7e63c8';
const URL = "https://api.openweathermap.org/data/2.5/forecast?lat=";

window.onload = async function () {
    try {
        const position = await getCurrentPosition();
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        const url = `${URL}${latitude}&lon=${longitude}&units=metric&appid=${API_KEY_WEATHER}`;
        const res = await fetch(url);
        const weathers = await res.json();

        const weatherIconsContainer = document.getElementById('weather-icons');
        let count = 0;
        for (let i = 0; i < weathers.list.length; i++) {
            const weather = weathers.list[i].weather[0].main;
            const icon = weathers.list[i].weather[0].icon;
            const utctime = weathers.list[i].dt_txt;
            const time = convertUTCtoJST(utctime);
            const hours = time.getHours();
            if ((hours === 9 || hours === 12 || hours === 15 || hours === 18) && count < 4) {
                const imageURL = `https://openweathermap.org/img/wn/${icon}@2x.png`;
                const imageElement = document.createElement('img');
                imageElement.src = imageURL;
                imageElement.alt = weather;
                weatherIconsContainer.appendChild(imageElement);
                count++;
            }
        }
    } catch (error) {
        console.error('An error occurred:', error);
    }
};

async function getCurrentPosition() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

function convertUTCtoJST(utcDateTime) {
    const utcDate = new Date(utcDateTime);
    const jstOffset = 9 * 60; 
    const jstTimestamp = utcDate.getTime() + (jstOffset * 60 * 1000);
    const jstDate = new Date(jstTimestamp);
    return jstDate;
}