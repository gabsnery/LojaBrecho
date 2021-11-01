import React from "react";
import Clients from './Components/Clients'
import Products from './Components/Products'
import Entries from './Components/Entries'
import Sales from './Components/Sales'
import DataProvider from "./Context/DataContext";
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Box } from '@mui/system';
import {
  ThemeProvider,
  createTheme,
  StyledEngineProvider
} from "@mui/material/styles";
const theme = createTheme();
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}
function App() {
    const [value, setValue] = React.useState(0);
 const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <DataProvider>
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
    <Tab  label="Clientes"  style={{color:'white'}} {...a11yProps(0)} />
    <Tab label="Produtos" style={{color:'white'}}  {...a11yProps(1)} />
    <Tab label="Entradas" style={{color:'white'}}  {...a11yProps(2)} />
    <Tab label="Saidas/Vendas" style={{color:'white'}}  {...a11yProps(3)} />
  </Tabs>
</Box>
<TabPanel value={value} index={0}>
     <Clients>
    </Clients>
    </TabPanel>
<TabPanel value={value} index={1}>
<Products>
    </Products>
</TabPanel>
<TabPanel value={value} index={2}>
<Entries>
    </Entries>
</TabPanel>
<TabPanel value={value} index={3}>
<Sales>
    </Sales>
</TabPanel>


    </DataProvider>
  );
}

export default App;