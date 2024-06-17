import react, { TouchableOpacity, View } from "react-native"
import { Page, Container, Title, InstrucText, Connect, ConnectText, IDinput, TimeCard, TimeText, EraseButton, Refresh } from "./style"
import { Image } from "react-native"
import api from "../../services/api"
import { Alert } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useContext, useState, useEffect } from "react"
import { RefreshContext } from "../../Contexts/refreshConectionContext"
import { Text, Platform } from "react-native"
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { reloadAppAsync } from "expo"


interface TimeObj {
    hour: number;
    minute: number;
    ID: number;
}

interface LevelObj{
    level: number;
}


const TimesPage = ()=>{
    const [devID, setDevID] = useState<string|null>(null);
    const {effectVar, setEffectVar} = useContext(RefreshContext);
    const [timesList, setTimesList] = useState<TimeObj[]|null[]>([]);
    const [levelLow, setLevelLow] =  useState<boolean>(false);

    const [time, setTime] = useState(new Date());
    const [show, setShow] = useState(false);

    const getData = async () => {
        try {
            const deviceID = await AsyncStorage.getItem("@devID");
            setDevID(deviceID); // Assuming you want to set the deviceID state
    
            // Make request to API to fetch times
            const response = await api.get(`/${deviceID}/getTimes`);
            const data: TimeObj[] = response.data;

            // Update state with fetched data
            setTimesList(data);

            const response2 = await api.get(`/${deviceID}/getLevel`);
            const level: LevelObj[] = response2.data;

            setLevelLow(!(level[0].level));

        } catch (error) {
            console.error(error);
            setDevID(null);
        }
    }

    useEffect(()=>{
        getData(); 
     // Set up interval to fetch data every 15 seconds
     const intervalId = setInterval(() => {
        getData();
      }, 15000); // 15000ms = 15s
  
      // Clean up interval on component unmount or effectVar change
      return () => clearInterval(intervalId);}, [effectVar])

    const handleDisconnect = async ()=>{
        try{
            await AsyncStorage.removeItem("@devID").then(()=>{
                setEffectVar(!effectVar);
                console.log("apagado");
            });
            
        }catch (e){
            console.log(e);
        } 
    }

    const handleServeNow = async() =>{
        try {
           
            const response = await api.post(`/${devID}/serveNow`);

        } catch (error) {
            console.error(error);
            setDevID(null);
        }
    }

    const handleDeleteTime = async (id: number | undefined, H: number | undefined, M: number | undefined) => {
    
    
        Alert.alert(
            "Confirmar remoção",
            "Tem certeza que deseja remover o horário?",
            [
                {
                    text: "Cancelar",
                    onPress: () => console.log("Deletion cancelled"),
                    style: "cancel"
                },
                {
                    text: "Remover",
                    onPress: async () => {
                        try {
                            const response = await api.post(`/${devID}/delete?id=${id}`);
                            // Handle successful response here, e.g., refresh the list or show a success message
                            console.log('Time deleted successfully:', response.data);
                            setEffectVar(!effectVar);
                        } catch (error) {
                            console.error('Error deleting time:', error);
                        }
                    }
                }
            ]
        );
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?:Date) => {
        const currentDate = selectedDate || time;
        setShow(Platform.OS === 'ios');
        setTime(currentDate);
    };

    const showTimePicker = () => {
        setShow(true);
    };

    const handleConfirm = () => {
        Alert.alert(
            "Confirmar adição",
            `Deseja adicionar o horário ${time.getHours().toString().padStart(2, '0')}:${time.getMinutes().toString().padStart(2, '0')}?`,
            [
                {
                    text: "Cancelar",
                    onPress: () => {console.log("Time setting cancelled");setShow(false);},
                    style: "cancel"
                },
                {
                    text: "SIM",
                    onPress: async () => {
                        try {
                            const formattedTime = {
                                hour: time.getHours(),
                                minute: time.getMinutes()
                            };
                            const response = await api.post(`/1234/addTime?hour=${formattedTime.hour}&minute=${formattedTime.minute}`);
                            console.log('Time set successfully:', response.data);
                            setShow(false);
                            setEffectVar(!effectVar);
                        } catch (error) {
                            console.error('Error setting time:', error);
                        }
                    }
                }
            ]
        );
    };



    
    return(
        <Page>
            <Container>
                <Image 
                    source = {require("../../../Public/Logo.png")}
                    style = {{width: "70%", height:"12%", margin:8 }}
                />
                <Title>Horários Programados:</Title>
                
                {levelLow && (<Text style={ {fontSize: 24, color: "#dd0000"}} >⚠️ Nível de ração baixo! ⚠️</Text>)}
               
                {timesList.map((time) => (
                    <TimeCard>
                    <TimeText key={time?.ID}>{time?.hour.toString().padStart(2, '0')}:{time?.minute.toString().padStart(2, '0')}</TimeText>
                    <EraseButton onPress={()=> handleDeleteTime(time?.ID, time?.hour, time?.minute)}>
                    <Image 
                        source = {require("../../../Public/delete.png")}
                        style = {{width: "100%", height: "100%", margin:0 }}
                    
                    />
                    </EraseButton>
                    
                    </TimeCard>
                ))}

                <View style={{display: "flex", flexDirection: "row"}}>
                    <Refresh onPress={()=>{setEffectVar(!effectVar)}}>
                    <Image 
                        source = {require("../../../Public/refresh.png")}
                        style = {{width: "70%", height: "70%", margin:0 }}
                    
                    />
                    </Refresh>

                    <Refresh onPress={()=>{setShow(!show)}}>
                    <Image 
                    source = {require("../../../Public/add.png")}
                    style = {{width: "70%", height: "70%", margin:0, transform: [{ rotate: show ? '45deg':'0deg' }]}}
                    
                    />
                    </Refresh>
                </View>

                {show && (
                <View style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <TouchableOpacity onPress={()=>handleConfirm()}>
                    <Text style={{fontSize:20, margin:4, fontWeight:700}}>SALVAR</Text>
                    </TouchableOpacity>
                    
                <DateTimePicker
                    testID="dateTimePicker"
                    value={time}
                    mode="time"
                    is24Hour={true}
                    display="spinner"
                    onChange={onChange}
                />
                
                </View>)}

               
                
                

                
                
                <Connect onPress={()=> {handleDisconnect()}}
                ><ConnectText>DESCONECTAR</ConnectText></Connect>

                <Connect onPress={()=> {handleServeNow()}}
                ><ConnectText>SERVIR</ConnectText></Connect>

                <Text style={ {fontSize: 16}} >Conectado a: {devID}</Text>
                
                
                
            </Container>
        </Page>
    )
}

export default TimesPage;