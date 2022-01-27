import { Checkbox, FormControlLabel } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableSortLabel from '@mui/material/TableSortLabel'
import React, { useEffect, useState } from 'react' 
 import { useTranslation } from 'react-i18next'
import { useData } from '../../Context/DataContext'
import Style from '../../Style'
import { Product } from './Product'

const Products = props => {
  const classes = Style()
  const { Products, setProducts } = useData()
  const [OrderedProducts, setOrderedProducts] = useState([])
  const [showAll, setshowAll] = useState(false)
  const [Order, setOrder] = useState({ order: 'asc', field: 'name' })
  const { t } = useTranslation()

  useEffect(() => {
    if (props.Products) {
      setProducts(props.Products)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
  useEffect(() => {
    if (Order.order === 'asc') {
      let temp = Products.sort((a, b) =>
        a[Order.field] < b[Order.field] ? -1 : 1
      )
      setOrderedProducts(temp)
    } else {
      let temp = Products.sort((a, b) =>
        a[Order.field] > b[Order.field] ? -1 : 1
      )
      setOrderedProducts(temp)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Order])

  return (
    <div className='Products'>
      <FormControlLabel
        control={
          <Checkbox
            id='UseCredit'
            data-testid='Checkbox-ShowAll'
            variant='standard'
            name='UseCredit'
            onChange={e => setshowAll(!showAll)}
          />
        }
        label={t('ShowAll.label')}
      />
      <div className={classes.List}>
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  onClick={() =>
                    setOrder({
                      order: Order.order === 'asc' ? 'desc' : 'asc',
                      field: 'name'
                    })
                  }
                  active
                  direction={Order.order}
                >
                  {t('Name.label')}
                </TableSortLabel>
              </TableCell>
              <TableCell><TableSortLabel
                  onClick={() =>
                    setOrder({
                      order: Order.order === 'asc' ? 'desc' : 'asc',
                      field: 'value'
                    })
                  }
                  active
                  direction={Order.order}
                >
                  {t('Value.label')}
                </TableSortLabel></TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody data-testid='table-products'>
            {OrderedProducts.filter(x => showAll || x.stock > 0).map(
              (row, index) => (
                <Product key={index} Product={row} />
              )
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default Products
