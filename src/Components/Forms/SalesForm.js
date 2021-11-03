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
import FirebaseServices from '../../services/services'

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
      FirebaseServices.update('Sales', CurrentItem).then(x => {
        setIsOpen(false)
        setState_(true)
      })
    } else {
      FirebaseServices.create('Sales', CurrentItem).then(x => {
        setIsOpen(false)
        setState_(true)
      })
    }
  }
  useEffect(() => {
    let item_ = { ...props.CurrentItem }
    let Clients_ = [...Clients]
    if (props.CurrentItem['Client'] && modalIsOpen) {
      let Cli = props.CurrentItem['Client']
        ? Clients_.find(y => y.id === props.CurrentItem['Client'].id)
        : 0
      item_['Client'] = { value: Cli.id, label: Cli.Nome }
    }
    setCurrentItem(item_)
  }, [Clients, modalIsOpen, props.CurrentItem])

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
            defaultValue={CurrentItem.Nome}
            onChange={handleInputClient}
          />
          <Dropdown
            className={classes.input}
            options={Clients.map(x => ({ value: x.id, label: x.Nome }))}
            onChange={e => {
              let e_ = { target: { name: 'Client', value: e.value } }
              handleInputClient(e_)
            }}
            value={CurrentItem.Client}
            placeholder='Cliente'
          />
          <TextField
            label='Valor de venda'
            type='Number'
            value={CurrentItem.Value}
            onChange={e =>
              setCurrentItem({
                ...CurrentItem,
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
