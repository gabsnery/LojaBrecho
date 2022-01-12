import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react'
import { ProductForm } from './ProductForm'
export const Product = props => {
  const { Product } = props;
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
            backgroundColor: Product.Stock === 0 ? 'red' : 'white'
          }
        }}
        key={Product.id}
      >
        <TableCell style={{ width: '10%' }} component='th' scope='row'>
          {Product.id}
        </TableCell>
        <TableCell style={{ width: '75%' }}>{Product.Nome}</TableCell>
        <TableCell style={{ width: '5%' }}>{Product.Value}</TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button onClick={() => openProdEditModal()}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <IconButton aria-label='expand row' size='small'></IconButton>
        </TableCell>
      </TableRow>
    </>
  )
}
