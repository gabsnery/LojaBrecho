import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Radio from '@mui/material/Radio'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react'
import { useData, useState_ } from '../Context/DataContext'
import { ProductsForm } from './Forms/ProductsForm'
import Style from '../Style'

const Products = () => {
  const classes = Style()

  const { Products } = useData()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [CurrentItem, setCurrentItem] = useState({})
  const { setState_ } = useState_()

  function openProdEditModal (Cli) {
    setCurrentItem(Cli)
    setIsOpen(true)
  }

  return (
    <div className='Products'>
      <ProductsForm
        CurrentProduct={CurrentItem}
        modalIsOpen={modalIsOpen}
        setIsOpen={setIsOpen}
      />
      <div
        style={{ margin: '0 50px', backgroundColor: 'white', color: '#0A1929' }}
      >
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Id</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Products.map((row, index) => (
              <TableRow
                sx={{ '& > *': { borderBottom: 'unset' } }}
                key={row.id}
              >
                <TableCell style={{ width: '5%' }} padding='checkbox'>
                  <Radio
                    value={row.Nome}
                    name='radio-buttons'
                    inputProps={{ 'aria-label': 'A' }}
                  />
                </TableCell>
                <TableCell style={{ width: '10%' }} component='th' scope='row'>
                  {row.id}
                </TableCell>
                <TableCell style={{ width: '75%' }}>{row.Nome}</TableCell>
                <TableCell style={{ width: '5%' }}>
                  <Button onClick={() => openProdEditModal(row)}>
                    <ModeEditOutlineOutlinedIcon />
                  </Button>
                </TableCell>
                <TableCell style={{ width: '5%' }}>
                  <IconButton aria-label='expand row' size='small'></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Products
