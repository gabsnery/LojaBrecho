import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useState_ } from '../../Context/DataContext'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import Style from '../../Style'

const customStyles = {
  position: 'fixed',
  top: '0',
  height: '100%',
  right: '0px',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4
}
export const ProductsForm = props => {
  const classes = Style()

  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const [CurrentClient, setCurrentClient] = useState(props.CurrentClient)
  const [CurrentProduct, setCurrentProduct] = useState(props.CurrentProduct)
  function handleInputClient (e) {
    setCurrentProduct({ ...CurrentProduct, [e.target.name]: e.target.value })
  }

  function closeModal () {
    setIsOpen(false)
  }

  function editProduct (e) {
    e.preventDefault()
    if (CurrentClient) {
      let ClientRef = firebase
        .firestore()
        .collection('Clients')
        .doc(CurrentClient.id)
      CurrentProduct['Client'] = ClientRef
    }
    if (CurrentProduct.hasOwnProperty('id')) {
      FirebaseServices.update('Products', CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
      })
    } else {
      FirebaseServices.create('Products', CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
      })
    }
  }
  useEffect(() => {
    setCurrentProduct(props.CurrentProduct)
  }, [props.CurrentProduct])

  if (CurrentProduct === undefined) return <></>

  return (
    <Modal
      open={modalIsOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box sx={customStyles}>
        <form onSubmit={editProduct}>
          <TextField
            id='Nome'
            label='Nome'
            variant='standard'
            name='Nome'
            style={{ width: '100%' }}
            defaultValue={CurrentProduct.Nome}
            onChange={handleInputClient}
          />
          <Button
            type='submit'
            className={classes.SubmitButton}
            value='Submit'
            variant='outlined'
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
