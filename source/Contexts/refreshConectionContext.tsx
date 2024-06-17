import React, { useState, createContext} from 'react';

type contextType ={
    effectVar: boolean;
    setEffectVar: (effectVar:boolean) => void;
} 

interface Props {
    children: React.ReactNode;
  }

export const RefreshContext = createContext<contextType>({effectVar: true, setEffectVar:()=>null});

const RefreshContextProvider: React.FC<Props> = ({children}) =>{
	const [ effectVar, setEffectVar] = useState(true);
	
	return(
		<RefreshContext.Provider value={{effectVar, setEffectVar}} > 
		{children} 
		</RefreshContext.Provider>
	);
}
export default RefreshContextProvider;