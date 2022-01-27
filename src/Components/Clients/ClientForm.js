import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react' 
 import { useTranslation } from 'react-i18next'
import { useState_ } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import Style from '../../Style'

export const ClientForm = props => {
  const classes = Style()
  const { t } = useTranslation()

  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()

  const [CurrentClient, setCurrentClient] = useState(props.CurrentClient)
  function handleInputClient (e) {
    setCurrentClient({ ...CurrentClient, [e.target.name]: e.target.value })
  }
  useEffect(() => {
    setCurrentClient(props.CurrentClient)
  }, [props.CurrentClient])

  function closeModal () {
    setIsOpen(false)
  }

  function editClient (e) {
    e.preventDefault()
    if (CurrentClient.hasOwnProperty('id')) {
      FirebaseServices.update('Clients', CurrentClient).then(x => {
        setIsOpen(false)
        setState_(true)
      })
    } else {
      FirebaseServices.create('Clients', CurrentClient).then(x => {
        setIsOpen(false)
        setState_(true)
      })
    }
  }

  if (CurrentClient === undefined || CurrentClient === {}) return <></>

  return (
    <Modal
      open={modalIsOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.Panel}>
        <form onSubmit={editClient}>
          <TextField
            id='name'
            label={t('Name.label')}
            variant='standard'
            name='name'
            style={{ width: '100%' }}
            defaultValue={CurrentClient.name}
            onChange={handleInputClient}
            autoComplete='off'
          />
          <TextField
            id='address'
            label={t('Address.label')}
            variant='standard'
            name='address'
            style={{ width: '100%' }}
            defaultValue={CurrentClient.address}
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
