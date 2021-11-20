import { Checkbox, FormControlLabel } from '@mui/material'
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
import { useData } from '../Context/DataContext'
import { ProductsForm } from './Forms/ProductsForm'
import Style from '../Style'

const Products = () => {
  const classes = Style()

  const { Products } = useData()
  const [modalIsOpen, setIsOpen] = useState(false)
  const [showAll, setshowAll] = useState(false)
  const [CurrentItem, setCurrentItem] = useState({})

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
      <FormControlLabel
        control={
          <Checkbox
            id='UseCredit'
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
          <TableBody>
            {Products.filter(x => showAll || x.Stock > 0).map((row, index) => (
              <TableRow
                sx={{
                  '& > *': {
                    borderBottom: 'unset',
                    backgroundColor: row.Stock === 0 ? 'red' : 'white'
                  }
                }}
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
                <TableCell style={{ width: '5%' }}>{row.Value}</TableCell>
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
