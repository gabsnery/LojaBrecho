import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import React, { useState } from 'react'

import { useData, useState_ } from '../Context/DataContext'
import FirebaseServices from '../services/services'
import Style from '../Style'
import { ProductsForm } from './Forms/ProductsForm'
import { SalesForm } from './Forms/SalesForm'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

const Sales = () => {
  const classes = Style()

  const [CurrentItem, setCurrentItem] = useState({})
  const [modalIsOpen, setIsOpen] = useState(false)
  const [removeModalIsOpen, setremoveIsOpen] = useState(false)

  const { Sales } = useData()
  const { setState_ } = useState_()
  const { Clients } = useData()

  function openEditModal (Cli) {
    setCurrentItem(Cli)
    setIsOpen(true)
  }
  function removeItem () {
    FirebaseServices.remove('Sales', CurrentItem).then(x => {
      setremoveIsOpen(false)
      setState_(true)
    })
  }
  const handleClose = () => setremoveIsOpen(false)

  return (
    <div className='Sales'>
      <Modal
        open={removeModalIsOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          Remover?
          <Button variant='outlined' onClick={() => removeItem()}></Button>
        </Box>
      </Modal>
      <div
        className={classes.List}
        >
        <SalesForm
          modalIsOpen={modalIsOpen}
          CurrentItem={CurrentItem}
          setIsOpen={setIsOpen}
        />
        <Button
          className={classes.AddButton}
          variant='outlined'
          onClick={() => openEditModal({ Nome: '' })}
        >
          <AddCircleOutlineOutlinedIcon />
          Novo item
        </Button>
        <Button
          className={classes.RemoveButton}
          variant='outlined'
          onClick={() => setremoveIsOpen(true)}
        >
          Remove
        </Button>
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell style={{width:'50%'}}>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Sales.map((row, index) => (
              <Row
              row={row}
              index={index}
              openEditModal={openEditModal}
              setCurrentItem={setCurrentItem}
              CurrentItem={CurrentItem}
            />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
function Row (props) {
  const { row, openEditModal, index, setCurrentItem, CurrentItem } = props
  const { Clients } = useData()
  const { Products } = useData()

  const [ProductsOpen, setProductsOpen] = React.useState(false)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [CurrentProduct, setCurrentProduct] = useState({})
  function openProdEditModal (Cli) {
    setCurrentProduct(Cli)
    setModalIsOpen(true)
  }
  return (
    <>


      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={row.id}>
      <TableCell style={{ width: '5%' }} padding='checkbox'>
                  <Radio
                    checked={row === CurrentItem}
                    onChange={() => {
                      setCurrentItem(row)
                    }}
                    value={row.Nome}
                    name='radio-buttons'
                    inputProps={{ 'aria-label': 'A' }}
                  />
                </TableCell>
                <TableCell style={{ width: '10%' }} component='th' scope='row'>
                  {Clients.find(x => x.id === row.Client.id)
                    ? Clients.find(x => x.id === row.Client.id)['Nome']
                    : ''}
                </TableCell>
                <TableCell style={{ width: '70%' }}>
                  {moment(new Date(row.Created.seconds * 1000)).format()}
                </TableCell>
                <TableCell style={{ width: '5%' }}>
                {row.Value}
                </TableCell>
                <TableCell style={{ width: '5%' }}>
                  <Button onClick={() => openEditModal(row)}>
                    <ModeEditOutlineOutlinedIcon />
                  </Button>
                </TableCell>
                <TableCell style={{ width: '5%' }}>
                  <IconButton aria-label='expand row' size='small'></IconButton>
                </TableCell>


        <TableCell style={{ width: '5%' }}>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setProductsOpen(!ProductsOpen)}
          >
            {ProductsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>


      <TableRow key={`Collapsed${index}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={ProductsOpen} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant='h6' gutterBottom component='div'>
                Products
              </Typography>
         
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Products ? (
                    Products.filter(p => p['Sale'] !== undefined).filter(p => p['Sale'].id === row.id).map(
                      historyRow => (
                        <TableRow key={`Collapsed_${index}`}>
                          <TableCell>{historyRow.Nome}</TableCell>
                          
                        </TableRow>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  )
}
export default Sales
