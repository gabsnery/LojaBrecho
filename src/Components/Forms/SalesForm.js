import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { useData, useState_ } from '../../Context/DataContext'
import firebase from '../../firebase.config'
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
export const SalesForm = props => {
  const classes = Style()

  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const { Clients } = useData()
  const [CurrentItem, setCurrentItem] = useState(props.CurrentItem)

  function handleInputClient (e) {
    setCurrentItem({ ...CurrentItem, [e.target.name]: e.target.value })
  }

  function closeModal () {
    setIsOpen(false)
  }

  function editProduct (e) {
    e.preventDefault()
    let ClientRef = firebase
      .firestore()
      .collection('Clients')
      .doc(
        typeof CurrentItem.Client == 'string'
          ? CurrentItem.Client
          : CurrentItem['Client'].value
      )
    CurrentItem['Client'] = ClientRef
    if (CurrentItem.hasOwnProperty('id')) {
      CurrentItem['Modified'] = new Date()
      firebase
        .firestore()
        .collection('Sales')
        .doc(CurrentItem.id)
        .update(CurrentItem)
        .then(x => {
          setIsOpen(false)
          setState_(true)
        })
    } else {
      CurrentItem['Created'] = new Date()
      firebase
        .firestore()
        .collection('Sales')
        .add(CurrentItem)
        .then(x => {
          setIsOpen(false)
          setState_(true)
        })
    }
  }
  useEffect(() => {
    let item_ = { ...props.CurrentItem }
    let Clients_ = [...Clients]
    if (props.CurrentItem['Client']) {
      let Cli = props.CurrentItem['Client']
        ? Clients_.find(y => y.id === props.CurrentItem['Client'].id)
        : 0
      item_['Client'] = { value: Cli.id, label: Cli.Nome }
    }
    setCurrentItem(item_)
  }, [props.CurrentItem])

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
            defaultValue={CurrentItem.Nome}
            onChange={handleInputClient}
          />

          <Dropdown
            options={Clients.map(x => ({ value: x.id, label: x.Nome }))}
            onChange={e => {
              let e_ = { target: { name: 'Client', value: e.value } }
              handleInputClient(e_)
            }}
            value={CurrentItem.Client}
            placeholder='Select an option'
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
