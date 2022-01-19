import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
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
import React, { useEffect, useState } from 'react'
import { useData } from '../Context/DataContext'
import Style from '../Style'
import { useTranslation } from 'react-i18next'

const PedingCredit = () => {
  const { Clients } = useData()
  const { Products } = useData()
  const [ClientswCredit, setClientswCredit] = useState([])
  const { t, i18n } = useTranslation()

  useEffect(() => {
    const calculateCredits = () => {
      let _temp = Clients.map(({ Products, ...keepAttrs }) => keepAttrs)
      Products.filter(
        p =>
          p['Client'] !== undefined &&
          p['sold'] !== undefined &&
          p['releasedCredit'] !== undefined
      )
        .filter(p1 => p1['sold'] === true && p1['releasedCredit'] === false)
        .map(it => {
          let Index = _temp.findIndex(x => x.id === it['Client'].id)
          if (!_temp[Index].hasOwnProperty('Products')) {
            _temp[Index]['Products'] = []
          }

          _temp[Index]['Products'].push(it)
          return {}
        })
      setClientswCredit(_temp.filter(x => x.Products !== undefined))
    }
    calculateCredits()
  }, [Clients, Products])
  const classes = Style()

  return (
    <div>
      <div className={classes.List}>
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>{t('Name.label')}</TableCell>
              <TableCell>{t('Credit.label')}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {ClientswCredit.map((row, index) => (
              <Row key={`PedingCredits_${index}`} row={row} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function Row (props) {
  const { t, i18n } = useTranslation()

  const { row } = props
  const [open, setOpen] = React.useState(false)
  const [
    releasaCreditModalIsOpen,
    setreleasaCreditModalIsOpen
  ] = React.useState(false)
  const { handleCredit } = useData()
  const classes = Style()

  function closeModal () {
    setreleasaCreditModalIsOpen(false)
  }
  const approveCredit = () => {
    let CreditValue = row['Products'].reduce((prev, next) => {
      return prev + next['value']
    }, 0)
    handleCredit(CreditValue * 0.3, row.id, row.Products, 'ReleasedCredit')
    setreleasaCreditModalIsOpen(false)
  }
  return (
    <React.Fragment>
      <Modal
        open={releasaCreditModalIsOpen}
        onClose={closeModal}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box className={classes.RemoveModal}>
          Está ação criará um valor de ___ de crédito disponivel para o cliente XXX
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
            onClick={() => approveCredit()}
          >
            Liberar
          </Button>
        </Box>
      </Modal>

      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={row.id}>
        <TableCell style={{ width: '5%' }} padding='checkbox'>
          <Radio name='radio-buttons' inputProps={{ 'aria-label': 'A' }} />
        </TableCell>

        <TableCell style={{ width: '75%' }}>{row.name}</TableCell>
        <TableCell style={{ width: '5%' }}>
          {row['Products']
            ? row['Products'].reduce((prev, next) => {
                return prev + next['value']
              }, 0) * 0.3 || 0
            : 0}
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button
            variant='outlined'
            onClick={() => setreleasaCreditModalIsOpen(true)}
          >
            {t('Release.label')}
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
      <TableRow key={`Collapsed-CLI-${row.id}`}>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography gutterBottom component='div'>
                {t('Account.label')}
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Name.label')}</TableCell>
                    <TableCell>{t('Value.label')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row['Products'].map((item, index) => (
                    <TableRow key={`Collapsed_PedingCredits_${index}`}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.value || 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
export default PedingCredit
