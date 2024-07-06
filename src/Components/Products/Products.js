import { Button, Checkbox, FormControlLabel } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { connect } from "react-redux";
import Style from "../../Style";
import { Product } from "./Product";
import { ProductsTags } from "./ProductsTags";

const Products = (props) => {
  const classes = Style();
  const [OrderedProducts, setOrderedProducts] = useState([]);
  const [SelectedProducts, setSelectedProducts] = useState([]);
  const [printTagsModal, setprintTagsModal] = useState(false);
  const [showAll, setshowAll] = useState(false);
  const [Order, setOrder] = useState({ order: "asc", field: "name" });
  const { t } = useTranslation();
  const { Products } = props;

  useEffect(() => {
    if (Order.order === "asc") {
      let temp = Products.sort((a, b) =>
        a[Order.field] < b[Order.field] ? -1 : 1
      );
      setOrderedProducts(temp);
    } else {
      let temp = Products.sort((a, b) =>
        a[Order.field] > b[Order.field] ? -1 : 1
      );
      setOrderedProducts(temp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Order, Products]);

  return (
    <div className="Products">
      <FormControlLabel
        control={
          <Checkbox
            id="UseCredit"
            data-testid="Checkbox-ShowAll"
            variant="standard"
            name="UseCredit"
            onChange={(e) => setshowAll(!showAll)}
          />
        }
        label={t("ShowAll.label")}
      />
      {/* <Button
        disabled={SelectedProducts.length === 0}
        onClick={() => setprintTagsModal(true)}
      >
        Imprimir
      </Button> */}
      <ProductsTags
        SelectedProducts={SelectedProducts}
        printTagsModal={printTagsModal}
        setprintTagsModal={setprintTagsModal}
      />
      <div className={classes.List}>
        <Table aria-label="collapsible table" size="small">
          <TableHead>
            <TableRow sx={{ backgroundColor: "#2E2E2E",color: "white"  }}>
              <TableCell></TableCell>
              <TableCell sx={{ color: "white" }}>
              
                  {t("Name.label")}
              </TableCell>
              <TableCell sx={{ color: "white" }}>
                  {t("Value.label")}
              </TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody data-testid="table-products">
            {OrderedProducts.filter((x) => showAll || x.stock > 0).map(
              (row, index) => (
                <Product
                  key={index}
                  Product={row}
                  setprintTagsModal={(e) => setprintTagsModal(e)}
                  setSelectedProducts={(e) => {
                    setSelectedProducts([...SelectedProducts, e]);
                  }}
                />
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
export default connect((state) => ({ Products: state.thriftStore.Products }))(
  Products
);
