import React, { createContext, useState, useEffect, useContext } from "react";
import firebase from '../firebase.config';

const DataContext = createContext();

export default function DataProvider({ children }) {
  const [State_, setState_] = useState(true);
  const [Clients, setClients] = useState([]);
  const [Products, setProducts] = useState([]);
  const [Entries, setEntries] = useState([]);
  const [Sales, setSales] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      setClients(await getData("Clients","Nome"));
      setProducts(await getData("Products","Nome"));
      setEntries(await getData("Entries","Nome"));
      setSales(await getData("Sales","Nome"));
    }
  
    if (State_) {
      fetchData();
      setState_(false)
    }
  }, [State_]);

  async function getData(collection,sort){
    const response = firebase.firestore().collection(collection);
    const data = await (await response.get());
    let Items_ = [];
    let List = data.docs;
    for (let index = 0; index < List.length; index++) {
      let item = List[index].data();
      item["id"] = List[index].id;
      Items_.push(item);
    }
    Items_.sort((a, b) => (a[sort] > b[sort]) ? 1 : ((b[sort] > a[sort]) ? -1 : 0))
    console.log('Items_',Items_)
    return Items_
  }



  return (
    <DataContext.Provider
      value={{
        Clients,setClients,
        Products, setProducts,
         State_,setState_,
         Entries,setEntries,
         Sales,setSales
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  const { Clients, setClients,Products, setProducts ,Entries,setEntries,
    Sales,setSales } = context;
  return { Clients, setClients,Products, setProducts,Entries,setEntries,
    Sales,setSales  };
}

export function useState_() {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be used within a DataProvider");
  const { State_, setState_ } = context;
  return { State_, setState_ };
}