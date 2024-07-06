import { Alert, Snackbar } from "@mui/material";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import Clients from "./Components/Clients/Clients";
import Entries from "./Components/Entries/Entries";
import PedingCredit from "./Components/PedingCredit";
import Products from "./Components/Products/Products";
import Sales from "./Components/Sales/Sales";
import FirebaseServices from "./services/services";
import * as actions from "./store/actions";

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
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
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function LoggedArea(props) {
  const [Loading, setLoading] = useState(false);
  const [value, setValue] = React.useState(0);
  const { t } = useTranslation();


  const handleChange = (event, newValue) => {
    setValue(newValue);
    getData();
  };
  async function getData() {
    let temp_Products = [];
    let i = [];
    i.push(
      FirebaseServices.getAll("Products").then((x) => {
        x.sort((a, b) =>
          a["name"] > b["name"] ? 1 : b["name"] > a["name"] ? -1 : 0
        );
        temp_Products = x;
        props.dispatch(actions.setProductos(x));
        return {};
      })
    );
    i.push(
      FirebaseServices.getAll("Entries").then((x) => {
        x.sort((a, b) =>
          a["name"] > b["name"] ? 1 : b["name"] > a["name"] ? -1 : 0
        );
        props.dispatch(actions.setEntries(x));
        return {};
      })
    );

    i.push(
      FirebaseServices.getAll("Clients").then(async (x) => {
        x.sort((a, b) =>
          a["name"] > b["name"] ? 1 : b["name"] > a["name"] ? -1 : 0
        );
        for (let p = 0; p < x.length; p++) {
          x[p]["Credits"] = await FirebaseServices.getSubCollection(
            "Clients",
            x[p],
            "Credits"
          );
        }
        props.dispatch(actions.setClients(x));
        return {};
      })
    );
    i.push(
      FirebaseServices.getAll("Sales").then(async (x) => {
        x.sort((a, b) =>
          a["name"] > b["name"] ? 1 : b["name"] > a["name"] ? -1 : 0
        );
        for (let p = 0; p < x.length; p++) {
          x[p]["Products"] = (
            await FirebaseServices.getSubCollection("Sales", x[p], "Products")
          ).map((y) => temp_Products.find((x) => x.id === y["Product"].id));
        }
        props.dispatch(actions.setSales(x));
        return {};
      })
    );
    Promise.all(i).then((values) => {
      setLoading(true);
    });
  }
  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      <Snackbar
        open={props.Snackbar?props.Snackbar.title!=='':false}
        autoHideDuration={6000}
        onClose={() => {
        }}
      >
        <Alert
          onClose={() => {
          }}
          severity="error"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {`${props.Snackbar?.title}`}
        </Alert>
      </Snackbar>
      <header className="header">
      <nav className="nav">
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab
            label={t("Clients.label")}
            style={{ color: "white" }}
            {...a11yProps(0)}
          />
          <Tab
            label={t("Products.label")}
            style={{ color: "white" }}
            {...a11yProps(1)}
          />
          <Tab
            label={t("Entries.label")}
            style={{ color: "white" }}
            {...a11yProps(2)}
          />
          <Tab
            label={t("Sales.label")}
            style={{ color: "white" }}
            {...a11yProps(3)}
          />
          <Tab
            label={t("CreditsToRelease.label")}
            style={{ color: "white" }}
            {...a11yProps(4)}
          />
        </Tabs>
      </nav>
    </header>
      {Loading ? (
        <>
          <TabPanel value={value} index={0}>
            <Clients key={1}></Clients>
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
      ) : (
        <></>
      )}
    </>
  );
}
export default connect((state) => ({
  Products: state.thriftStore.Products,
  Clients: state.thriftStore.Clients,
  Snackbar: state.snackBar,
}))(LoggedArea);
