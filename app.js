const express = require('express');
const path = require('path');
const hbs = require('hbs');
const requests = require('requests');

const app = express();
const port = process.env.PORT || 80;

myFilePath = path.join(__dirname, 'public');
partialsPath = path.join(__dirname, 'partials');
viewsPath = path.join(__dirname, 'views');
imgPath = path.join(__dirname,'public/img');

app.use(express.static(imgPath));

hbs.registerPartials(partialsPath);
app.use(express.urlencoded());

app.set('view engine', 'hbs');
app.set('views', viewsPath);

app.get('/', (req, res) => {
    res.render('index');
})

let temp = '';
let nameOfCity = '';
let headData = 'For weather, Please Enter The City Name';
app.get('/weather', (req, res) => {
    res.render('weather', {
        tempreture: temp,
        city: nameOfCity,
        head: headData
    });
})

app.post('/weather', (req, res) => {
    let cityName = req.body.city;
    if (cityName == '') {
        headData = "Can't get weather without City Name";
        temp = '';
        nameOfCity = '';
        res.redirect('back');
    }
    else {
        let request = requests(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=050b52254619a8be8ca57dcc75a423d1`);
        request.on('data', (chunk) => {
            let arr = [JSON.parse(chunk)];
            // console.log(arr[0].main.temp)
            tempData = arr[0].main.temp;
            temp = Math.round(tempData - 273.15) + '°C';
            nameOfCity = "Today's Weather of " + arr[0].name;
            headData = '';
            // Location.reload();
            res.redirect('back');
        });
        request.on('end', () => {
            res.send();
        })
        request.on('error', (error) => {
            console.log(error);
        })
    }
});

app.get('*', (req, res) => {
    res.render('error',{
        path: imgPath
    });
})

app.listen(port, () => {
    console.log('The Server Start');
})