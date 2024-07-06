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
import TableRow from '@mui/material/TableRow'
import TextField from '@mui/material/TextField'
import React, { useEffect } from 'react' 
 import { useTranslation } from 'react-i18next'
import Style from '../../Style'
import ClientForm from './ClientForm'
import ClientHistory from './ClientHistory'
import * as APIUtils from '../common/APIUtils'

function Client (props) {
  const classes = Style()

  const { Client, index } = props
  const [open, setOpen] = React.useState(false)
  const [
    CurrentAvailablebleCredit,
    setCurrentAvailablebleCredit
  ] = React.useState(0)
  const [WithdrawalCredit, setWithdrawaCredit] = React.useState(0)

  const [WithdrawalModalIsOpen, setWithdrawalModalIsOpen] = React.useState(
    false
  )
  const [EditIsOpen, setEditIsOpen] = React.useState(false)
  const { t } = useTranslation()

  useEffect(() => {
    setCurrentAvailablebleCredit(CalculateCurrentCredit(Client))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])

  const CalculateCurrentCredit = Client_ => {
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
            label={t("Value.label")}
            type='Number'
            value={WithdrawalCredit}
            onChange={e => setWithdrawaCredit(e.target.value)}
            name='Discount'
            id='formatted-numberformat-input'
            variant='standard'
          />
          <Button
            variant='outlined'
            style={{
              float: 'right',
              right: 0,
              bottom: 0,
              margin: '1em 1em',
              display: 'flex',
              position: 'fixed'
            }}
            onClick={() => {
              APIUtils.handleCredit(
                -WithdrawalCredit,
                Client.id,
                [],
                'WithdrawalCredit'
              ).then(() => {
                setWithdrawalModalIsOpen(false)
              })
            }}
          >{t('Withdrawal')}</Button>
        </Box>
      </Modal>
      <ClientForm
        modalIsOpen={EditIsOpen}
        CurrentClient={Client}
        setIsOpen={setEditIsOpen}
      />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
 
        <TableCell style={{ width: '75%' }}>
          {Client.name}
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
              {t('WithdrawalCredit.label')}
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
            {open ? <KeyboardArrowUpIcon sx={{color:'red'}}/> : <KeyboardArrowDownIcon sx={{color:'red'}}/>}
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
