import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Pressable, Switch } from 'react-native';
import { useEffect, useState } from 'react';
import * as Location from "expo-location";



export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [weatherData, setWeatherData] = useState({});
  async function getData() {
    const response = await fetch (
      "https://jsonplaceholder.typicode.com/posts"
    );
    const data = await response.json();
    console.log(data);
  }

  async function getWeatherDetails(longitude, latitude){
    console.log('📍longitude, laitude --->', longitude, latitude);
    try{
      const response = await fetch(
         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&APPID=d559bf39e3388e11e80b466216c0b7f5`
        
      );
      const data =  await response.json();
      setWeatherData(data);
      console.log("📍data --->", data);
    } catch(error) {
      console.log("❌Error --->", error);
    }
  }

  useEffect(() => {
    async function getCurrentLocation() {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if(status !== "granted"){
        setErrorMsg("Permission to acces location was denied");
        return;
      }
      let location =  await Location.getCurrentPositionAsync({});
      console.log("📍location --->", location.coords.latitude);
      console.log("📍location --->", location.coords.longitude);
      setLocation(location.coords);
    }
    getCurrentLocation();
  },[]);

  const isDayTime = weatherData?.dt && weatherData?.sys && weatherData?.dt < weatherData?.sys?.sunset;


  return (
    <View style={styles.container} >
      {/* <Text>Open up App.js to start working on your app!</Text> */}
      <Pressable style={styles.btn} onPress={() => {
        if(location) {
        getWeatherDetails(location.longitude, location.latitude)
        } else {
          console.log("Location is not yet available")
        }
      }} >
        <Text style={styles.btnText} > Hello weather </Text>
        {weatherData.name && (
    <View style={styles.info}>
      <Text>📍 City: {weatherData.name}</Text>
      <Text>🌡️ Temperature: {weatherData.main?.temp} °C</Text>
      <Text>💧 Humidity: {weatherData.main?.humidity}%</Text>
      <Text>🌤️ Condition: {weatherData.weather?.[0]?.description}</Text>
    </View>
  )}
      </Pressable>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  btn:{
    paddingVertical:10,
    paddingHorizontal: 20,
    borderRadius: 10,
    borderWidth:1,
    borderColor: '#007AFF',
    backgroundColor: '#E6F0FF',
    marginBottom: 20,
  },
  btnText:{
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '500',
  },
  info:{
    alignItems:'center',
  },

});
