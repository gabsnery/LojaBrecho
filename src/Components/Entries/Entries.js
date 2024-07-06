import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useState,useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import EntriesForm from './EntriesForm'
import Entry from './Entry'

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
const Entries = props => {
  const classes = Style()
  const [CurrentEntry, setCurrentEntry] = useState({})
  const [modalIsOpen, setIsOpen] = useState(false)
  const [removeModalIsOpen, setremoveIsOpen] = useState(false)
  const { Entries, Products, Clients } = props
  const { t } = useTranslation()

  function removeItem () {
    FirebaseServices.remove('Entries', CurrentEntry).then(x => {
      setremoveIsOpen(false)
    })
  }
  function openEditModal (Cli) {
    setCurrentEntry(Cli)
    setIsOpen(true)
  }  
  useEffect(() => {
    console.log('Products',props)
  }, [props])
  const handleClose = () => setremoveIsOpen(false)
  return (
    <div className='Entries'>
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
      <div className={classes.List}>
        <EntriesForm
          modalIsOpen={modalIsOpen}
          CurrentItem={CurrentEntry}
          setIsOpen={setIsOpen}
        />

        <Button
          className={classes.AddButton}
          variant='outlined'
          onClick={() => openEditModal({ Nome: '' })}
        >
          <AddCircleOutlineOutlinedIcon />
          {t('NewItem.label')}
        </Button>
        <Button
          className={classes.RemoveButton}
          variant='outlined'
          onClick={() => setremoveIsOpen(true)}
        >
          {t('Remove.label')}
        </Button>
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow sx={{backgroundColor:'#2E2E2E'}}>
              <TableCell style={{ width: '50%',color:'white' }}>
                {t('Client.label')}
              </TableCell>
              <TableCell sx={{color:'white'}}>{t('Date.label')}</TableCell>
              <TableCell sx={{color:'white'}}>{t('ProductsCount.label')}</TableCell>
              <TableCell sx={{color:'white'}}>{t('Value.label')}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Entries.map((row, index) => (
              <Entry
                key={`Entries_Row_${index}`}
                Entry={row}
                index={index}
                Products={Products}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default connect(state => ({
  Products: state.thriftStore.Products,
  Entries: state.thriftStore.Entries,
  Clients: state.thriftStore.Clients
}))(Entries)
