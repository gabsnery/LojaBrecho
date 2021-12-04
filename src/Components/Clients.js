import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
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
import { ClientForm } from './Forms/ClientForm'

const Clients = () => {
  const classes = Style()

  const { Clients } = useData()
  const { Products } = useData()
  const { Entries } = useData()
  const { setState_ } = useState_()

  const [CurrentClient, setCurrentClient] = useState({})
  const [modalIsOpen, setIsOpen] = React.useState(false)
  const [removeModalIsOpen, setremoveIsOpen] = React.useState(false)
  function openRemoveModal (Cli) {
    setCurrentClient(Cli)
  }
  function openEditModal (Cli) {
    setCurrentClient(Cli)
    setIsOpen(true)
  }

  function closeModal () {
    setIsOpen(false)
  }

  function removeClient () {
    let cli = FirebaseServices.remove('Clients', CurrentClient)
    let prod = Products.filter(p => p['Client'].id === CurrentClient.id).map(
      it => FirebaseServices.remove('Products', it)
    )
    let entry = Entries.filter(p => p['Client'].id === CurrentClient.id).map(
      it_ => FirebaseServices.remove('Entries', it_)
    )
    Promise.all([cli, prod, entry]).then(() => {
      //result is an array of all x values according to rows
      setremoveIsOpen(false)
      setState_(true)
    })
  }

  return (
    <div>
      <Modal
        open={removeModalIsOpen}
        onClose={closeModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className={classes.RemoveModal}>
          Remover?
          <Button variant='outlined' onClick={() => removeClient()}></Button>
        </Box>
      </Modal>
      <div className={classes.List}>
        <ClientForm
          modalIsOpen={modalIsOpen}
          CurrentClient={CurrentClient}
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
              <TableCell>Id</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Crédito previsto</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Clients.map((row, index) => (
              <Row
                key={`Client_Row_${row.id}`}
                openEditModal={openEditModal}
                Products={Products}
                SelectedRow={CurrentClient}
                index={index}
                row={row}
                openRemoveModal={openRemoveModal}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function Row (props) {
  const { row, openRemoveModal, openEditModal, index, SelectedRow } = props
  const [open, setOpen] = React.useState(false)
  const [removeModalIsOpen] = React.useState(false)
  const { Entries, Products, Sales } = useData()
  function removeProduct () {}
 
  return (
    <React.Fragment>
      <Modal
        open={removeModalIsOpen}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box>
          Remover?
          <Button variant='outlined' onClick={() => removeProduct()}></Button>
        </Box>
      </Modal>

      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell style={{ width: '5%' }} padding='checkbox'>
          <Radio
            checked={row === SelectedRow}
            onChange={() => {
              openRemoveModal(row)
            }}
            value={row.Nome}
            name='radio-buttons'
            inputProps={{ 'aria-label': 'A' }}
          />
        </TableCell>
        <TableCell style={{ width: '10%' }} component='th' scope='row'>
          {row.id}
        </TableCell>
        <TableCell style={{ width: '75%' }}>{row.Nome}</TableCell>
        <TableCell style={{ width: '75%' }}>
          {Products
            ? Products.filter(p => p['Client'] !== undefined)
                .filter(p => p['Client'].id === row.id)
                .filter(p => p['Value'] !== undefined)
                .reduce((prev, next) => +prev + +next.Value, 0)
            : 0}
        </TableCell>
        <TableCell style={{ width: '75%' }}>
          {Entries.filter(p => p['Client'] !== undefined)
            .filter(p => p['Client'].id === row.id)
            .map(y => ({ ...y, type: 'Entrada' }))
            .concat(
              Sales.filter(p => p['Client'] !== undefined)
                .filter(p => p['Client'].id === row.id)
                .map(y => ({ ...y, type: 'Saida' }))
            )
            .reduce((a, b) => {
              if (b.type === 'Entrada') return +a + +b.Value
              else return +a - +b.Value
            }, 0) || 0}
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button
            onClick={() => {
              openEditModal(row)
            }}
          >
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow key={`Collapsed-CLI-${index}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component='div'>
                Conta
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Entries && Sales ? (
                    Entries.filter(p => p['Client'] !== undefined)
                      .filter(p => p['Client'].id === row.id)
                      .map(y => ({ ...y, type: 'Entrada' }))
                      .concat(
                        Sales.filter(p => p['Client'] !== undefined)
                          .filter(p => p['Client'].id === row.id)
                          .map(y => ({ ...y, type: 'Saida' }))
                      )
                      .map((subRow, index) => (
                        <TableRow key={`Client_Row_${row.id}_${index}`}>
                          <TableCell>
                            {moment(
                              new Date(row.Created.seconds * 1000)
                            ).format()}
                          </TableCell>
                          <TableCell>{subRow.type}</TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <></>
                  )}
                  {/*Products ? (
                    Products.filter(p => p['Client'] !== undefined).filter(p => p['Client'].id === row.id).map(
                      historyRow => (
                        <TableRow >
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
                      )
                    )
                  ) : (
                    <></>
                  )*/}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
export default Clients
