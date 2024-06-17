import react from "react-native"
import { Page, Container, Title, InstrucText, Connect, ConnectText, IDinput } from "./style"
import { useState, useContext } from "react"
import { Image } from "react-native"
import api from "../../services/api"
import { Alert } from "react-native"
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RefreshContext } from "../../Contexts/refreshConectionContext"

const ConnectPage = ()=>{

    const [devID, setDevId] = useState<string>('');
    const {effectVar, setEffectVar} = useContext(RefreshContext);

    const handleConnect = async ()=>{
        console.log(devID);
        api.get("/"+devID +  "/connect").
        then( async (response) =>{
            if(response.status == 200){
                //Salvo o ID do device no AsyncStorage para persistir a conexão
                try{
                    await AsyncStorage.setItem("@devID", devID).then(()=>{setEffectVar(!effectVar)});
                    Alert.alert("Conectado!", "O dispositivo de ID " + devID + " foi conectado com sucesso!");
                    console.log(response.data);
                    
                }catch (e){
                    console.log(e);
                }
                
            }else{
                Alert.alert("Erro", "Não foi possível conectar. Verifique se o ID do dispositivo foi digitado corretamente.");
                console.log(response.status);
            }
        }).catch((error:any)=>{
            Alert.alert("Erro", "Não foi possível conectar. Verifique se o ID do dispositivo foi digitado corretamente e se ele está ligado.");
                console.log(error);
        });
    }



    return(
        <Page>
            <Container>
                <Image 
                    source = {require("../../../Public/Logo.png")}
                    style = {{width: "70%", height:"12%", margin:8 }}
                />
                <Title>Conecte seu dispositivo Meaw</Title>
                <InstrucText>1. No menu inicial de seu dispositivo, selecione a opção "APP".</InstrucText>
                <InstrucText>2. Insira o ID exibido pelo dispositivo no campo abaixo.</InstrucText>
                <IDinput 
                    placeholder="Insira o ID do dispositivo"
                    value={devID}
                    onChangeText={(ID)=>{setDevId(ID)}}></IDinput>
                <InstrucText>3. Clique no botão "Conectar" abaxo. O dispositivo retornará ao menu inicial caso a conexão seja bem sucedida.</InstrucText>
                
                <Connect onPress={()=> {handleConnect()}}
                ><ConnectText>CONECTAR</ConnectText></Connect>
            </Container>
        </Page>
    )
}

export default ConnectPage;
