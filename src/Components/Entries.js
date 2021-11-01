import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import moment from 'moment'
import React, { useState } from 'react'
import { useData, useState_ } from '../Context/DataContext'
import Style from '../Style'
import FirebaseServices from '../services/services'
import { EntriesForm } from './Forms/EntriesForm'

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
  const { Clients } = useData()

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
      <div
        style={{ margin: '0 50px', backgroundColor: 'white', color: '#0A1929' }}
      >
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
        <Table aria-label='collapsible table'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Entries.map((row, index) => (
              <TableRow
                sx={{ '& > *': { borderBottom: 'unset' } }}
                key={row.id}
              >
                <TableCell style={{ width: '5%' }} padding='checkbox'>
                  <Radio
                    checked={row === CurrentEntry}
                    onChange={() => {
                      setCurrentEntry(row)
                    }}
                    value={row.Nome}
                    name='radio-buttons'
                    inputProps={{ 'aria-label': 'A' }}
                  />
                </TableCell>
                <TableCell style={{ width: '10%' }} component='th' scope='row'>
                  {Clients.find(x => x.id === row.Client.id)
                    ? Clients.find(x => x.id === row.Client.id)['Nome']
                    : ''}
                </TableCell>
                <TableCell style={{ width: '75%' }}>
                  {moment(new Date(row.Created.seconds * 1000)).format()}
                </TableCell>
                <TableCell style={{ width: '5%' }}>
                  <Button onClick={() => openEditModal(row)}>
                    <ModeEditOutlineOutlinedIcon />
                  </Button>
                </TableCell>
                <TableCell style={{ width: '5%' }}>
                  <IconButton aria-label='expand row' size='small'></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export default Entries
