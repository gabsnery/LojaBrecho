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

const PedingCredit = () => {
  const { Clients } = useData()
  const { Products } = useData()
  const [ClientswCredit, setClientswCredit] = useState([])


  useEffect(() => {
    const calculateCredits = () => {
      let _temp = Clients.map(({ Products, ...keepAttrs }) => keepAttrs)
      Products.filter(
        p =>
          p['Client'] !== undefined &&
          p['Sold'] !== undefined &&
          p['ReleasedCredit'] !== undefined
      )
        .filter(p1 => p1['Sold'] === true && p1['ReleasedCredit'] === false)
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
    calculateCredits();
  }, [Clients, Products])
  const classes = Style()

  return (
    <div>
      <div className={classes.List}>
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
  const { row } = props
  const [open, setOpen] = React.useState(false)
  const [
    releasaCreditModalIsOpen,
    setreleasaCreditModalIsOpen
  ] = React.useState(false)
  const { ReleasedCredit } = useData()
  const classes = Style()

  function closeModal () {
    setreleasaCreditModalIsOpen(false)
  }
  const _ReleasedCredit = () => {
    let CreditValue = row['Products'].reduce((prev, next) => {
      return prev + next['Value']
    }, 0)
    ReleasedCredit(CreditValue*0.3, row.id, row.Products,'CreditUsed')
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
          Remover?
          <Button variant='outlined' onClick={() => _ReleasedCredit()}>
            Vai
          </Button>
        </Box>
      </Modal>

      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={row.id}>
        <TableCell style={{ width: '5%' }} padding='checkbox'>
          <Radio name='radio-buttons' inputProps={{ 'aria-label': 'A' }} />
        </TableCell>
        <TableCell style={{ width: '10%' }} component='th' scope='row'>
          {row.id}
        </TableCell>
        <TableCell style={{ width: '75%' }}>{row.Nome}</TableCell>
        <TableCell style={{ width: '5%' }}>
          {row['Products']
            ? row['Products'].reduce((prev, next) => {
                return prev + next['Value']
              }, 0)*0.3 || 0
            : 0}
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button
            variant='outlined'
            onClick={() => setreleasaCreditModalIsOpen(true)}
          >
            Liberar
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
                Conta
              </Typography>
              <Table size='small' aria-label='purchases'>
                <TableHead>
                  <TableRow>
                    <TableCell>Nome</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row['Products'].map((item,index) => (
                    <TableRow key={`Collapsed_PedingCredits_${index}`}>
                      <TableCell>{item.Nome}</TableCell>
                      <TableCell>{item.Value || 0}</TableCell>
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
