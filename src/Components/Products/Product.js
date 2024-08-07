import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import TableCell from '@mui/material/TableCell'
import { Checkbox } from '@mui/material'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react' 
import  ProductForm  from './ProductForm'
export const Product = props => {
  const { Product,setSelectedProducts } = props;
  const [modalIsOpen, setIsOpen] = useState(false)

  function openProdEditModal () {
    setIsOpen(true)
  }

  return (
    <>
      <ProductForm
        CurrentProduct={Product}
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
      />
      <TableRow
        sx={{
          '& > *': {
            borderBottom: 'unset',
            backgroundColor: Product.stock === 0 ? '#ff000080' : 'white'
          }
        }}
        key={Product.id}
      >
    
        <TableCell style={{ width: '5%' }}>         <Checkbox
            id='UseCredit'
            data-testid ='Checkbox-ShowAll'
            variant='standard'
            name='UseCredit'
            onChange={e => setSelectedProducts(Product)}
          /></TableCell>
        <TableCell style={{ width: '75%' }}>{Product.name}</TableCell>
        <TableCell style={{ width: '5%' }}>{Product.value}</TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button onClick={() => openProdEditModal()}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
        </TableCell>
      </TableRow>
    </>
  )
}
