import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useState_, useData } from '../../Context/DataContext'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import NumberFormat from 'react-number-format'
import PropTypes from 'prop-types'

export const ProductsForm = props => {
  const classes = Style()
  const NumberFormatCustom = React.forwardRef(function NumberFormatCustom (
    props,
    ref
  ) {
    const { onChange, ...other } = props

    return (
      <NumberFormat
        {...other}
        getInputRef={ref}
        onValueChange={values => {
          onChange({
            target: {
              name: props.name,
              value: values.value
            }
          })
        }}
        thousandSeparator
        isNumericString
        prefix='$'
      />
    )
  })
  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const [Client] = useState(props.Client)
  const { updateTotalValue } = useData()
  const [Entry] = useState(props.Entry)
  const [CurrentProduct, setCurrentProduct] = useState(props.CurrentProduct)
  function handleInputClient (e) {
    e.preventDefault()

    setCurrentProduct({
      ...CurrentProduct,
      [e.target.name]:
        e.target.name === 'Value' ? +e.target.value : e.target.value
    })
  }

  function closeModal () {
    setIsOpen(false)
  }

  function editProduct (e) {
    e.preventDefault()
    if (Client) {
      let ClientRef = firebase
        .firestore()
        .collection('Clients')
        .doc(Client.id)
      CurrentProduct['Client'] = ClientRef
    }
    if (Entry) {
      let EntryRef = firebase
        .firestore()
        .collection('Entries')
        .doc(Entry.id)
      CurrentProduct['Entry'] = EntryRef
    }

    if (CurrentProduct.hasOwnProperty('id')) {
      FirebaseServices.update('Products', CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
          updateTotalValue(CurrentProduct)
      })
    } else {
      FirebaseServices.create('Products', CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
          updateTotalValue(CurrentProduct)
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
      <Box className={classes.Panel}>
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
          <TextField
            label='Valor de venda'
            type='Number'
            value={CurrentProduct.Value}
            onChange={e =>
              setCurrentProduct({
                ...CurrentProduct,
                [e.target.name]:
                  e.target.name === 'Value' ? +e.target.value : e.target.value
              })
            }
            name='Value'
            id='formatted-numberformat-input'
            variant='standard'
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
