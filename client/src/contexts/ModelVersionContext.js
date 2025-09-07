// src/contexts/ModelVersionContext.js
import { createContext, useContext, useState } from "react";

const ModelVersionContext = createContext();

export const ModelVersionProvider = ({ children }) => {
    const [version, setVersion] = useState("random");
    return (
        <ModelVersionContext.Provider value={{ version, setVersion }}>
            {children}
        </ModelVersionContext.Provider>
    );
};

export const useModelVersion = () => useContext(ModelVersionContext);
