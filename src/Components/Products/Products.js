import { Checkbox, FormControlLabel } from '@mui/material'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useEffect, useState } from 'react'
import { useData } from '../../Context/DataContext'
import Style from '../../Style'
import { Product } from './Product'
const Products = (props ) => {
  const classes = Style()
  const { Products,setProducts } = useData()
  const [showAll, setshowAll] = useState(false)
  useEffect(() => {
    if (props.Products){
      setProducts(props.Products)
    }
  }, [])

  return (
    <div className='Products' >

      <FormControlLabel
        control={
          <Checkbox
            id='UseCredit'
            data-testid ='Checkbox-ShowAll'
            variant='standard'
            name='UseCredit'
            onChange={e => setshowAll(!showAll)}
          />
        }
        label='Mostrar todos?'
      />
      <div className={classes.List}>
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Id</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody data-testid = 'table-products'>
            {Products.filter(x => showAll || x.Stock > 0).map((row, index) => (
              <Product key={index} Product={row}/>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default Products
