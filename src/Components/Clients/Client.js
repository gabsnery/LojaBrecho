import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import React from 'react'
import { useData, useState_ } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import { ClientForm } from './ClientForm'

function Client (props) {
  const classes = Style()

  const { Client, index } = props
  const [open, setOpen] = React.useState(false)
  const { Entries, Products, Sales } = useData()
  const [removeModalIsOpen, setremoveIsOpen] = React.useState(false)
  const { setState_ } = useState_()
  const [EditIsOpen, setEditIsOpen] = React.useState(false)

  function removeClient () {
    let cli = FirebaseServices.remove('Clients', Client)
    let prod = Products.filter(p => p['Client'].id === Client.id).map(it =>
      FirebaseServices.remove('Products', it)
    )
    let entry = Entries.filter(p => p['Client'].id === Client.id).map(it_ =>
      FirebaseServices.remove('Entries', it_)
    )
    Promise.all([cli, prod, entry]).then(() => {
      //result is an array of all x values according to rows
      setremoveIsOpen(false)
      setState_(true)
    })
  }

  return (
    <React.Fragment>
      <Modal
        open={removeModalIsOpen}
        //onClose={closeModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className={classes.RemoveModal}>
          Remover?
          <Button variant='outlined' onClick={() => removeClient()}></Button>
        </Box>
      </Modal>
      <ClientForm
          modalIsOpen={EditIsOpen}
          CurrentClient={Client}
          setIsOpen={setEditIsOpen}
        />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>

        <TableCell style={{ width: '10%' }} component='th' scope='row'>
          {Client.id}
        </TableCell>
        <TableCell style={{ width: '75%' }}>{Client.Nome}</TableCell>
        <TableCell style={{ width: '75%' }}>
          {Products
            ? Products.filter(p => p['Client'] !== undefined)
                .filter(p => p['Client'].id === Client.id)
                .filter(p => p['Value'] !== undefined)
                .reduce((prev, next) => +prev + +next.Value, 0)
            : 0}
        </TableCell>
        <TableCell style={{ width: '75%' }}>
          {Entries.filter(p => p['Client'] !== undefined)
            .filter(p => p['Client'].id === Client.id)
            .map(y => ({ ...y, type: 'Entrada' }))
            .concat(
              Sales.filter(p => p['Client'] !== undefined)
                .filter(p => p['Client'].id === Client.id)
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
              setEditIsOpen(Client)
            }}
          >
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button
            className={classes.RemoveButton}
            variant='outlined'
            onClick={() => setremoveIsOpen(true)}
          >
            Remove
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
                      .filter(p => p['Client'].id === Client.id)
                      .map(y => ({ ...y, type: 'Entrada' }))
                      .concat(
                        Sales.filter(p => p['Client'] !== undefined)
                          .filter(p => p['Client'].id === Client.id)
                          .map(y => ({ ...y, type: 'Saida' }))
                      )
                      .map((subRow, index) => (
                        <TableRow key={`Client_Row_${Client.id}_${index}`}>
                          <TableCell>
                            {moment(
                              new Date(Client.Created.seconds * 1000)
                            ).format()}
                          </TableCell>
                          <TableCell>{subRow.type}</TableCell>
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
    </React.Fragment>
  )
}
export default Client
