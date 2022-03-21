import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import React, { useEffect, useState } from 'react' 
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { connect } from 'react-redux'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import * as actions from '../../store/actions'

const EntriesForm = props => {
  const classes = Style()

  const { modalIsOpen, setIsOpen } = props

  const { Clients } = props
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
      FirebaseServices.update('Entries', CurrentItem).then(x => {
        props.dispatch(actions.updateEntry({...CurrentItem}))

        setIsOpen(false)
      })
    } else {
      FirebaseServices.create('Entries', CurrentItem).then(x => {
        setIsOpen(false)
        props.dispatch(actions.addEntry({...CurrentItem,id:x.id}))
      })
    }
  }
  useEffect(() => {
    let item_ = { ...props.CurrentItem }
    if (props.CurrentItem['Client'] || modalIsOpen) {
      let Cli = props.CurrentItem['Client']
        ? Clients.find(y => y.id === props.CurrentItem['Client'].id)
        : 0
      item_['Client'] = { value: Cli.id, label: Cli.name }
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
          <Dropdown
            options={Clients.map(x => ({ value: x.id, label: x.name }))}
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
export default connect(state => ({ Clients: state.thriftStore.Clients }))(EntriesForm)
