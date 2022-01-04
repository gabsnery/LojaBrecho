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
import { useData, useState_ } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import { EntriesForm } from './EntriesForm'
import { ProductsForm } from '../Products/ProductsForm'

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
const Entries = () => {
  const classes = Style()

  const [CurrentEntry, setCurrentEntry] = useState({})
  const [modalIsOpen, setIsOpen] = useState(false)

  const [removeModalIsOpen, setremoveIsOpen] = useState(false)
  const { Entries } = useData()
  const { setState_ } = useState_()
  function removeItem () {
    FirebaseServices.remove('Entries', CurrentEntry).then(x => {
      setremoveIsOpen(false)
      setState_(true)
    })
  }
  function openEditModal (Cli) {
    setCurrentEntry(Cli)
    setIsOpen(true)
  }
  const handleClose = () => setremoveIsOpen(false)
  return (
    <div className='Entries'>
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
      <div className={classes.List}>
        <EntriesForm
          modalIsOpen={modalIsOpen}
          CurrentItem={CurrentEntry}
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
              <TableCell style={{ width: '50%' }}>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Nº de produtos</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Crédito</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Entries.map((row, index) => (
              <Row
                key={`Entries_Row_${index}`}
                row={row}
                index={index}
                openEditModal={openEditModal}
                setCurrentEntry={setCurrentEntry}
                CurrentEntry={CurrentEntry}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
function Row (props) {
  const { row, openEditModal, index, setCurrentEntry, CurrentEntry } = props
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
      <ProductsForm
        modalIsOpen={modalIsOpen}
        Entry={row}
        Client={Clients.find(x => x.id === row.Client.id)}
        CurrentProduct={CurrentProduct}
        setIsOpen={setModalIsOpen}
      />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={row.id}>
        <TableCell style={{ width: '5%' }} padding='checkbox'>
          <Radio
            checked={row === CurrentEntry}
            onChange={() => {
              setCurrentEntry(row)
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
        <TableCell style={{ width: '30%' }}>
          {moment(new Date(row.Created.seconds * 1000)).format()}
        </TableCell>
        <TableCell style={{ width: '20%' }}>
          {Products
            ? Products.filter(p => p['Entry'] !== undefined).filter(
                p => p['Entry'].id === row.id
              ).length
            : 0}
        </TableCell>
        <TableCell style={{ width: '20%' }}>
          {Products
            ? Products.filter(p => p['Entry'] !== undefined)
                .filter(p => p['Entry'].id === row.id)
                .map(item => item.Value)
                .reduce((prev, next) => prev + next, 0) || 0
            : 0}
        </TableCell>
        <TableCell style={{ width: '5%' }}>{row.Credit}</TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button onClick={() => openEditModal(row)}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
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
              <Button
                variant='outlined'
                onClick={() => openProdEditModal({ Nome: '' })}
              >
                Novo produto
              </Button>
              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Products ? (
                    Products.filter(p => p['Entry'] !== undefined)
                      .filter(p => p['Entry'].id === row.id)
                      .map(historyRow => (
                        <TableRow key={`Collapsed__Entries_Row_${index}`}>
                          <TableCell>{historyRow.Nome}</TableCell>
                          <TableCell style={{ float: 'right', width: '5%' }}>
                            <Button>
                              <DeleteIcon />
                            </Button>
                          </TableCell>
                          <TableCell style={{ float: 'right', width: '5%' }}>
                            <Button
                              onClick={() => openProdEditModal(historyRow)}
                            >
                              <ModeEditOutlineOutlinedIcon />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
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
export default Entries
