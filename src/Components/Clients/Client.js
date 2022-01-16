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
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React, { useEffect } from 'react'
import { useData } from '../../Context/DataContext'
import Style from '../../Style'
import { ClientForm } from './ClientForm'
import ClientHistory from './ClientHistory'

function Client (props) {
  const classes = Style()

  const { Client, index } = props
  const [open, setOpen] = React.useState(false)
  const [
    CurrentAvailablebleCredit,
    setCurrentAvailablebleCredit
  ] = React.useState(0)
  const [WithdrawaCredit, setWithdrawaCredit] = React.useState(0)
  const { ReleasedCredit } = useData()
  const [WithdrawalModalIsOpen, setWithdrawalModalIsOpen] = React.useState(
    false
  )
  const [EditIsOpen, setEditIsOpen] = React.useState(false)

  useEffect(() => {
    setCurrentAvailablebleCredit(CalculateCurrentCredit(Client))
  }, [props])

  const CalculateCurrentCredit = Client_ => {
    console.log('Client_.Credit', Client_['Credits'])
    let temp = Client_.Credits
      ? Client_.Credits.reduce((a, b) => {
          return +a + b.Value
        }, 0)
      : 0
    return temp
  }
  return (
    <React.Fragment>
      <Modal
        open={WithdrawalModalIsOpen}
        //onClose={closeModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className={classes.RemoveModal}>
          <TextField
            label='Desconto(%)'
            type='Number'
            value={CurrentAvailablebleCredit}
            onChange={e => setWithdrawaCredit(e.target.value)}
            name='Discount'
            id='formatted-numberformat-input'
            variant='standard'
          />
          <Button
            variant='outlined'
            onClick={() => {
              ReleasedCredit(
                -WithdrawaCredit,
                Client.id,
                [],
                'WithdrawaCredit'
              ).then(() => {
                setWithdrawalModalIsOpen(false)
              })
            }}
          ></Button>
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
        <TableCell style={{ width: '75%' }}>
          {Client.Nome}
        </TableCell>
        <TableCell style={{ width: '75%' }}>
          {CurrentAvailablebleCredit}
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
          {CurrentAvailablebleCredit > 0 ? (
            <Button
              onClick={() => {
                setWithdrawaCredit(CurrentAvailablebleCredit)
                setWithdrawalModalIsOpen(Client)
              }}
            >
              Retirar
            </Button>
          ) : (
            <></>
          )}
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
              <Table size='small' aria-label='purchases'>
                <TableBody>
                  <ClientHistory Client={Client} />
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
