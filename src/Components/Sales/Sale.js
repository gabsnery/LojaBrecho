import DeleteIcon from '@mui/icons-material/Delete'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import { TableBody } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Typography from '@mui/material/Typography'
import moment from 'moment'
import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import FirebaseServices from '../../services/services'
import SalesForm from './SalesForm'

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

const Sale = props => {
  const { Sale, index, Products, Clients } = props
  const [removeModalIsOpen, setremoveIsOpen] = useState(false)
  const [EditModalIsOpen, setEditModalIsOpen] = useState(false)
  const { t } = useTranslation()

  const [ProductsOpen, setProductsOpen] = React.useState(false)
  function removeItem () {
    FirebaseServices.remove('Sales', Sale).then(x => {
      setremoveIsOpen(false)
    })
  }
  const handleClose = () => setremoveIsOpen(false)
  const removeSaleModal = () => {
    return (
      <Modal
        open={removeModalIsOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          {t('Remove.label')}?
          <Button variant='outlined' onClick={() => removeItem()}></Button>
        </Box>
      </Modal>
    )
  }
  return (
    <>
      {removeSaleModal()}
      <SalesForm
        EditModalIsOpen={EditModalIsOpen}
        CurrentItem={Sale}
        setEditModalIsOpen={setEditModalIsOpen}
      />
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell style={{ width: '10%' }}>
          {moment(new Date(Sale.created.seconds * 1000)).format(
            'MM/D/yyyy HH:mm'
          )}
        </TableCell>

        <TableCell style={{ width: '7%' }}>
          {Clients.find(x => x.id === Sale.Client.id)
            ? Clients.find(x => x.id === Sale.Client.id)['name']
            : ''}
        </TableCell>
        <TableCell style={{ width: '5%' }}>{Sale.Value || 0}</TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button onClick={() => setEditModalIsOpen(true)}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button disabled onClick={() => setremoveIsOpen(true)}>
            <DeleteIcon />
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
                {t('Products.label')}
              </Typography>

              <Table size='small'>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Name.label')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Products ? (
                    Sale['Products'].map((historyRow, index2) => (
                      <TableRow key={`Collapsed_Sales_${index2}`}>
                        <TableCell>{historyRow.name}</TableCell>
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
export default connect(state => ({
  Products: state.thriftStore.Products,
  Clients: state.thriftStore.Clients
}))(Sale)
