import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import Clients from './Components/Clients/Clients'
import Entries from './Components/Entries/Entries'
import Login from './Components/Login'
import Products from './Components/Products/Products'
import Sales from './Components/Sales/Sales'
import PedingCredit from './Components/PedingCredit'
import DataProvider, { useState_ } from './Context/DataContext'
import firebase from './firebase.config'
import FirebaseServices from './services/services'

function a11yProps (index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`
  }
}

function TabPanel (props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}
function App () {
  const [authenticated, setAuthenticated] = React.useState(false)

  return (
    <DataProvider>
      <Login authenticated={authenticated}
        setAuthenticated={setAuthenticated}/>
      <LoggedArea
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
      />
    </DataProvider>
  )
}
function LoggedArea (props) {
  const [value, setValue] = React.useState(0)
  const { authenticated,setAuthenticated } = props
  const { setState_ } = useState_()
  
  useEffect(() => {
    setState_(true)

  }, [authenticated, setState_])
  useEffect(() => {
    function waitAuth(){
      setTimeout(() => {
        if(firebase.auth().currentUser){
          setAuthenticated(true)
        }
      }, 1000);
    } 
    waitAuth();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const truncateFirebase = () =>{
    FirebaseServices.truncate()

  }
  return (
        <>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <button onClick={truncateFirebase}>clear all</button>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              <Tab
                label='Clientes'
                style={{ color: 'white' }}
                {...a11yProps(0)}
              />
              <Tab
                label='Produtos'
                style={{ color: 'white' }}
                {...a11yProps(1)}
              />
              <Tab
                label='Entradas brechó'
                style={{ color: 'white' }}
                {...a11yProps(2)}
              />
              <Tab
                label='Saidas/Vendas'
                style={{ color: 'white' }}
                {...a11yProps(3)}
              />
              <Tab
                label='Créditos a liberar'
                style={{ color: 'white' }}
                {...a11yProps(4)}
              />
        
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <Clients></Clients>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Products></Products>
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Entries></Entries>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Sales></Sales>
          </TabPanel>
          <TabPanel value={value} index={4}>
            <PedingCredit key={4}></PedingCredit>
          </TabPanel>
    </>
  )
}
export default App
