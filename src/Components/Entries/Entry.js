import { connect } from 'react-redux'
import DeleteIcon from '@mui/icons-material/Delete'
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
import React, { useState,useEffect } from 'react' 
 import { useTranslation } from 'react-i18next'
import { useData, useState_ } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import ProductForm from '../Products/ProductForm'
import { EntriesForm } from './EntriesForm'
import { Product } from './Product'

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
const Entry = props => {
  const { Entry,Products,EntryProducts,index} = props
  const { Clients } = useData()
  const [removeModalIsOpen, setremoveIsOpen] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const [newProductIsOpen, setnewProductIsOpen] = useState(false)
  const { setState_ } = useState_()
  const handleClose = () => setremoveIsOpen(false)
  const { t } = useTranslation()

  const [ProductsOpen, setProductsOpen] = React.useState(false)
  useEffect(() => {
   console.log('props',props);
  }, [props])
  function openEditModal (Cli) {
    setModalIsOpen(true)
  }
  function removeItem () {
    FirebaseServices.remove('Entries', Entry).then(x => {
      setremoveIsOpen(false)
      setState_(true)
    })
  }
  return (
    <>
      <EntriesForm
        modalIsOpen={modalIsOpen}
        CurrentItem={Entry}
        setIsOpen={setModalIsOpen}
      />

      <ProductForm
        modalIsOpen={newProductIsOpen}
        Entry={Entry}
        Client={Clients.find(x => x.id === Entry.Client.id)}
        CurrentProduct={({ name: '' })}
        setIsOpen={setnewProductIsOpen}
      />
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
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }} key={Entry.id}>

        <TableCell style={{ width: '10%' }} component='th' scope='Entry'>
          {Clients.find(x => x.id === Entry.Client.id)
            ? Clients.find(x => x.id === Entry.Client.id)['name']
            : ''}
        </TableCell>
        <TableCell style={{ width: '30%' }}>
          {moment(new Date(Entry.created.seconds * 1000)).format('MM/D/yyyy HH:mm')}
        </TableCell>
        <TableCell style={{ width: '20%' }}>
          {EntryProducts
            ? EntryProducts.length
            : 0}
        </TableCell>
        <TableCell style={{ width: '20%' }}>
          {EntryProducts
            ? EntryProducts.map(item => item.value)
                .reduce((prev, next) => prev + next, 0) || 0
            : 0}
        </TableCell>
        <TableCell style={{ width: '5%' }}>{Entry.Credit}</TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button onClick={() => openEditModal(Entry)}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <Button onClick={() => setremoveIsOpen(true)}>
            <DeleteIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%' }}>
          <IconButton
            aria-label='expand Entry'
            size='small'
            onClick={() => setProductsOpen(!ProductsOpen)}
          >
            {ProductsOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
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
              <Button
                variant='outlined'
                style={{float:'left'}}
                onClick={() => setnewProductIsOpen(true)}
              >
                {t('NewItem.label')}
              </Button>
              <Table size='small' >
                <TableHead>
                  <TableRow>
                    <TableCell>{t('Name.label')}</TableCell>
                    <TableCell />
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Products.filter(p => p['Entry'] !== undefined).filter(
                        p => p['Entry'].id === Entry.id
                      ).length>0 ? (
                        Products.filter(p => p['Entry'] !== undefined).filter(
                          p => p['Entry'].id === Entry.id
                        ).map((historyEntry,index) => (
                        <Product key={`Products_Row_${index}`}  Product={historyEntry} Entry={Entry} index={index}/>
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

export default connect(state => ({ Products: state.Products }))(Entry)
