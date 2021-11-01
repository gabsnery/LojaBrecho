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
import React, { useState } from 'react'
import { useData } from '../Context/DataContext'
import firebase from '../firebase.config'
import Style from '../Style'
import { ClientForm } from './Forms/ClientForm'
import { ProductsForm } from './Forms/ProductsForm'

const Clients = () => {
  const classes = Style()

  const { Clients, setClients } = useData()
  const { Products } = useData()

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
    firebase
      .firestore()
      .collection('Clients')
      .doc(CurrentClient.id)
      .delete()
      .then(f => {
        setremoveIsOpen(false)
        let newClients = [...Clients]
        setClients(newClients.filter(y => y !== CurrentClient))
        setremoveIsOpen(false)
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
        <Box>
          Remover?
          <Button variant='outlined' onClick={() => removeClient()}></Button>
        </Box>
      </Modal>
      <div
        style={{ margin: '0 50px', backgroundColor: 'white', color: '#0A1929' }}
      >
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
            {Clients.map((row, index) => (
              <Row
                key={row.id}
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
        {/* <DataGrid
                    style={{ color: '#0A1929' }}
                    checkboxSelection
                    rows={Clients} columns={columns}
                    onSelectionModelChange={(params, event) => {
                        openRemoveModal(params)
                    }}
                    onCellDoubleClick={(params, event) => {
                        openEditModal(params.row)
                        if (!event.ctrlKey) {
                            event.defaultMuiPrevented = true;
                        }
                    }}

                /> */}
      </div>
    </div>
  )
}

function Row (props) {
  const {
    row,
    openRemoveModal,
    Products,
    openEditModal,
    index,
    SelectedRow
  } = props
  const [open, setOpen] = React.useState(false)
  const [removeModalIsOpen, setremoveModalIsOpen] = React.useState(false)
  const [modalIsOpen, setModalIsOpen] = React.useState(false)
  const [CurrentProduct, setCurrentProduct] = useState({})

  function openProdEditModal (Cli) {
    setCurrentProduct(Cli)
    setModalIsOpen(true)
  }
  function openProdremoveModal (Cli) {
    setCurrentProduct(Cli)
    setModalIsOpen(true)
  }
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

      <ProductsForm
        modalIsOpen={modalIsOpen}
        CurrentClient={row}
        CurrentProduct={CurrentProduct}
        setIsOpen={setModalIsOpen}
      />

      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={row.id}>
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
      <TableRow key={`Collapsed${index}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
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
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Products ? (
                    Products.filter(p => p['Client'].id === row.id).map(
                      historyRow => (
                        <TableRow key={historyRow.date}>
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
                  )}
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
