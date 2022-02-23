import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react' 
import FirebaseServices from '../../services/services'
import ProductForm from '../Products/ProductForm'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
import { connect } from 'react-redux'
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
const Product = props => {
  const { Product, Entry, index,Clients } = props
  const [RemoveModalIsOpen, setRemoveModalIsOpen] = useState(false)
  const [EditmodalIsOpen, setEditModalIsOpen] = useState(false)
  function openProdEditModal () {
    setEditModalIsOpen(true)
  }
  function removeItem () {
    FirebaseServices.remove('Product', Product).then(x => {
      setRemoveModalIsOpen(false)
    })
  }
  const handleClose = () => setRemoveModalIsOpen(false)

  return (
    <>
      <Modal
        open={RemoveModalIsOpen}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Box sx={style}>
          Remover?
          <Button variant='outlined' onClick={() => removeItem()}></Button>
        </Box>
      </Modal>
      <ProductForm
        modalIsOpen={EditmodalIsOpen}
        Entry={Entry}
        Client={Clients.find(x => x.id === Entry.Client.id)}
        CurrentProduct={Product}
        setIsOpen={setEditModalIsOpen}
      />
      <TableRow key={`Collapsed__Entries_Entry_${index}`}>
        <TableCell style={{ width: '90%' }}>{Product.name}</TableCell>
        <TableCell style={{ width: '5%', padding: '0px' }}>
          <Button onClick={() => openProdEditModal(Product)}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%', padding: '0px' }}>
          <Button>
            <DeleteIcon onClick={() => setRemoveModalIsOpen(Product)} />
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
export default connect(state => ({ Products: state.thriftStore.Products  ,Clients:state.thriftStore.Clients}))(Product)
