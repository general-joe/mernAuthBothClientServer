import { createContext } from "react";
import React, { useState } from "react";

// Here, we have to create one app context
export const AppContext = createContext();

//We to add context provider
// We have to wrap our app with this provider
// We have to pass the value to the provider
// We have to use the value in the app
export const AppContextProvider = (props) => {
  //We are connecting backend url here
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // We should also provide a state variable here so that we can use it in our app
  const [isLoggedin, setIsLoggedin] = useState(false); //we should initialize it with false
  const [userData, setUserData] = useState(false); //we should initialize it with false

  const value = {
    //Now we can pass in this backendUrl in this object value so that we can access it in any components of our project
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
  };
  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};
