import react from "react-native"
import { useState, useEffect, useContext } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import ConnectPage from "../DeviceConnect"
import TimesPage from "../Times"
import { RefreshContext } from "../../Contexts/refreshConectionContext"

const Home = ()=>{
    const [devID, setDevID] = useState<string|null>(null);
    const {effectVar, setEffectVar} = useContext(RefreshContext);

    const getData = async () =>{
        try{
        await AsyncStorage.getItem("@devID").then((data)=>{setDevID(data);});
        
        }catch (e){
        console.log(e);
        setDevID(null);
        }

    
  }

  useEffect(()=>{
  getData()}, [effectVar])



  if(devID == null){
  return(
    <ConnectPage></ConnectPage>
  )
}else{
  return(
    <TimesPage></TimesPage>
  )
}
   
}

export default Home;