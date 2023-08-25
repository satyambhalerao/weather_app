import express from 'express'
import axios from 'axios'
import bodyParser from 'body-parser'

const app = express()
const port = '3000'
const APIkey = '30cfcd9e6fbf43d6bed135831232408'

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.post("/getWeather",(req, res)=>{
    const locations = req.body.location;
    const finalresult = {"weather": {}};

// Define a function to fetch weather data for a location
async function fetchWeatherData(loc) {
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${loc}`);
    const result = response.data;
    return result;
}

// Loop through locations and fetch weather data
Promise.all(locations.map(async (loc) => {
    const result = await fetchWeatherData(loc);
    console.log(result.location.name + " " + result.current.temp_c + "\u2103");
    
    // Add data to finalresult JSON
    finalresult.weather[result.location.name] = {
        temperature: result.current.temp_c + "\u2103"
    };
}))
.then(() => {
    res.json(finalresult)
})
.catch(error => {
    console.error("An error occurred:", error);
});
})

app.get("/",(req, res)=>{

    res.render("index.ejs")
})

app.post("/",async(req, res)=>{
    const location = req.body.country
    const response = await axios.get(`http://api.weatherapi.com/v1/current.json?key=${APIkey}&q=${location}`);
    const result = response.data;
    const img = "https:"+result.current.condition.icon
    res.render("index.ejs",{
        data:result,
        img:img
    })
})

app.listen(port,(err)=>{
    if(!err)
    {
        console.log(`Server live on ${port}`)
    }
    else
    {
        console.log(err.message)
    }
})
