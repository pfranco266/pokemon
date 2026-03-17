import React, { createContext, useContext, useRef, useCallback } from 'react';

const TypesCacheContext = createContext(null);

export function TypesCacheProvider({ children }) {
    const detailCacheRef = useRef(new Map());

    const fetchTypeDetail = useCallback(async (name) => {
        if (detailCacheRef.current.has(name)) return detailCacheRef.current.get(name);
        const res = await fetch(`https://pokeapi.co/api/v2/type/${name}`);
        if (!res.ok) throw new Error(`Type not found: ${name}`);
        const data = await res.json();
        detailCacheRef.current.set(name, data);
        return data;
    }, []);

    return (
        <TypesCacheContext.Provider value={{ fetchTypeDetail }}>
            {children}
        </TypesCacheContext.Provider>
    );
}

export function useTypesCache() {
    return useContext(TypesCacheContext);
}
