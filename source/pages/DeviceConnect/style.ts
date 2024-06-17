import styled from "styled-components/native";


export const Page = styled.View`
    background-color: white;
    height: 100%;
`

export const Container = styled.View`
    background-color: #f4b083;
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    padding: 10% 5%;
    align-items: center;
`

export const Title = styled.Text`
    font-size: 32px;
    font-weight: 700;
    text-align: center;
    margin: 32px 0 16px 0;
    color: #333;
`

export const InstrucText = styled.Text`
    font-size: 20px;
    font-weight: 300;
    text-align: left;
    margin: 16px;
    color: #333;
`

export const Connect = styled.TouchableOpacity`
    width: 50%;
    height: 7%;
    background-color: #c55a11;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

export const ConnectText = styled.Text`
    color: white;
    font-size:24px;
    font-weight: 700;
`

export const IDinput =  styled.TextInput`
    width: 70%;
    height: 5%;
    background-color: white;
    margin: 32px;
    color: #333;
    border-radius: 16px;
    padding: 0 16px;
    font-size: 18px;
`