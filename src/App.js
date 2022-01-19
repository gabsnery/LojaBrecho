import { Button } from '@mui/material'
import Tab from '@mui/material/Tab'
import Tabs from '@mui/material/Tabs'
import { Box } from '@mui/system'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Clients from './Components/Clients/Clients'
import Entries from './Components/Entries/Entries'
import Login from './Components/Login'
import PedingCredit from './Components/PedingCredit'
import Products from './Components/Products/Products'
import Sales from './Components/Sales/Sales'
import DataProvider, { useState_ } from './Context/DataContext'
import firebase from './firebase.config'


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
  const { t, i18n } = useTranslation()
  
  return (
    <DataProvider>
      <Login
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
        />
      <div style ={{width: 'fit-content',
    display: 'inline'}}>
    
        <Button onClick={()=>i18n.changeLanguage('pt')}>Português</Button>
        <Button onClick={()=>i18n.changeLanguage('en')}>English</Button>
      </div>
      <LoggedArea
        authenticated={authenticated}
        setAuthenticated={setAuthenticated}
      />
    </DataProvider>
  )
}
function LoggedArea (props) {
  const [value, setValue] = React.useState(0)
  const { authenticated, setAuthenticated } = props
  const { setState_ } = useState_()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    setState_(true)
  }, [authenticated, setState_])
  useEffect(() => {
    function waitAuth () {
      setTimeout(() => {
        if (firebase.auth().currentUser) {
          setAuthenticated(true)
        }
      }, 1000)
    }
    waitAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label='basic tabs example'
        >
          <Tab label={t('Clients.label')} style={{ color: 'white' }} {...a11yProps(0)} />
          <Tab label={t('Products.label')} style={{ color: 'white' }} {...a11yProps(1)} />
          <Tab
            label={t('Entries.label')}
            style={{ color: 'white' }}
            {...a11yProps(2)}
          />
          <Tab
            label={t('Sales.label')}
            style={{ color: 'white' }}
            {...a11yProps(3)}
          />
          <Tab
            label={t('CreditsToRelease.label')}
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
