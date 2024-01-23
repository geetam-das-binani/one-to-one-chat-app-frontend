import { createContext, useContext, useReducer, useState } from "react";
const StateContext = createContext();

const StateProvider = ({  children }) => {
    const [user,setUser]=useState(JSON.parse(localStorage.getItem("googleauthuser")) || "");
	return (
		<StateContext.Provider value={{user,setUser}}>
			{children}
		</StateContext.Provider>
	);
};
const useStateValue = () => useContext(StateContext);
export { StateProvider, useStateValue };