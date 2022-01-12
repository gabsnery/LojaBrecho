import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react'
import { useData, useState_ } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import { EntriesForm } from './EntriesForm'
import { Entry } from './Entry'

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
const Entries = () => {
  const classes = Style()

  const [CurrentEntry, setCurrentEntry] = useState({})
  const [modalIsOpen, setIsOpen] = useState(false)

  const [removeModalIsOpen, setremoveIsOpen] = useState(false)
  const { Entries } = useData()
  const { setState_ } = useState_()
  function removeItem () {
    FirebaseServices.remove('Entries', CurrentEntry).then(x => {
      setremoveIsOpen(false)
      setState_(true)
    })
  }
  function openEditModal (Cli) {
    setCurrentEntry(Cli)
    setIsOpen(true)
  }
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
          Remover?
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
          Novo item
        </Button>
        <Button
          className={classes.RemoveButton}
          variant='outlined'
          onClick={() => setremoveIsOpen(true)}
        >
          Remove
        </Button>
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell style={{ width: '50%' }}>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Nº de produtos</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell>Crédito</TableCell>
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
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Entries
