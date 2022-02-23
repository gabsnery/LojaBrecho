import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import FirebaseServices from '../../services/services'
import * as actions from '../../store/actions'
import Style from '../../Style'

const ClientForm = props => {
  const classes = Style()
  const { t } = useTranslation()

  const { modalIsOpen, setIsOpen } = props

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
        props.dispatch(actions.updateClient(CurrentClient))
      })
    } else {
      FirebaseServices.create('Clients', CurrentClient).then(x => {
        setIsOpen(false)
        props.dispatch(actions.addClient({...CurrentClient,id:x.id}))
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
      <Box className={classes.ClientPanel}>
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
          <Box
            sx={{
              margin: '30px 0',
              padding: '30px 10px',
              border: '1px dashed grey'
            }}
          >
            <div>
              <span style={{ display: 'inline-block' }}> Dados de contato</span>
              <br />
              <TextField
                id='email'
                label={t('Email.label')}
                variant='standard'
                name='email'
                style={{ width: '100%' }}
                defaultValue={CurrentClient.email}
                onChange={handleInputClient}
              />
              <br />
              <TextField
                id='phone'
                label={t('Phone.label')}
                variant='standard'
                name='phone'
                style={{ width: '50%' }}
                defaultValue={CurrentClient.phone}
                onChange={handleInputClient}
              />
              <TextField
                id='cellphone'
                label={t('CellPhone.label')}
                variant='standard'
                name='cellphone'
                style={{ width: 'calc(50% - 10px)', marginLeft: '10px' }}
                defaultValue={CurrentClient.cellphone}
                onChange={handleInputClient}
              />
              <br />
              <TextField
                id='zipCode'
                label={t('ZipCode.label')}
                variant='standard'
                name='zipCode'
                style={{ width: '50%' }}
                defaultValue={CurrentClient.zipCode}
                onChange={handleInputClient}
              />
              <TextField
                id='district'
                label={t('District.label')}
                variant='standard'
                name='district'
                style={{ width: 'calc(50% - 10px)', marginLeft: '10px' }}
                defaultValue={CurrentClient.district}
                onChange={handleInputClient}
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

              <TextField
                id='city'
                label={t('City.label')}
                variant='standard'
                name='city'
                style={{ width: '50%' }}
                defaultValue={CurrentClient.city}
                onChange={handleInputClient}
              />
              <TextField
                id='state'
                label={t('State.label')}
                variant='standard'
                name='state'
                style={{ width: 'calc(25% - 10px)', marginLeft: '10px' }}
                defaultValue={CurrentClient.state}
                onChange={handleInputClient}
              />
              <TextField
                id='country'
                label={t('Country.label')}
                variant='standard'
                name='country'
                style={{ width: 'calc(25% - 10px)', marginLeft: '10px' }}
                defaultValue={
                  CurrentClient.country ? CurrentClient.country : 'Brasil'
                }
                onChange={handleInputClient}
              />
            </div>
          </Box>
          <Box
            sx={{
              margin: '30px 0',
              padding: '30px 10px',
              border: '1px dashed grey'
            }}
          >
            <div>
              <span style={{ display: 'inline-block' }}> Dados bancarios</span>
              <br />

              <TextField
                id='pix'
                label={t('PIX.label')}
                variant='standard'
                name='pix'
                style={{ width: '50%' }}
                defaultValue={CurrentClient.pix}
                onChange={handleInputClient}
              />
              <br />
              <TextField
                id='bank'
                label={t('Bank.label')}
                variant='standard'
                name='bank'
                style={{ width: '20%' }}
                defaultValue={CurrentClient.bank}
                onChange={handleInputClient}
              />
              <TextField
                id='agency'
                label={t('Agency.label')}
                variant='standard'
                name='agency'
                style={{ width: 'calc(40% - 10px)', marginLeft: '10px' }}
                defaultValue={CurrentClient.agency}
                onChange={handleInputClient}
              />
              <TextField
                id='bankAccount'
                label={t('BankAccount.label')}
                variant='standard'
                name='bankAccount'
                style={{ width: 'calc(40% - 10px)', marginLeft: '10px' }}
                defaultValue={CurrentClient.bankAccount}
                onChange={handleInputClient}
              />
            </div>
          </Box>
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
export default connect(state => ({
  Clients: state.thriftStore.Clients
}))(ClientForm)