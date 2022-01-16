import DeleteIcon from '@mui/icons-material/Delete'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react'
import { useData, useState_ } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import { ProductForm } from '../Products/ProductForm'

export const Product = props => {
  const { Product, Entry, index } = props
  const { Clients } = useData()
  const [removeModalIsOpen, setremoveIsOpen] = useState(false)
  const [modalIsOpen, setModalIsOpen] = useState(false)
  const { setState_ } = useState_()
  function openProdEditModal (Cli) {
    setModalIsOpen(true)
  }
  function removeItem () {
    FirebaseServices.remove('Product', Product).then(x => {
      setremoveIsOpen(false)
      setState_(true)
    })
  }
  return (
    <>
      <ProductForm
        modalIsOpen={modalIsOpen}
        Entry={Entry}
        Client={Clients.find(x => x.id === Entry.Client.id)}
        CurrentProduct={Product}
        setIsOpen={setModalIsOpen}
      />
      <TableRow key={`Collapsed__Entries_Entry_${index}`}>
        <TableCell style={{ width: '90%' }}>{Product.Nome}</TableCell>
        <TableCell style={{  width: '5%',padding:'0px' }}>
          <Button onClick={() => openProdEditModal(Product)}>
            <ModeEditOutlineOutlinedIcon />
          </Button>
        </TableCell>
        <TableCell style={{ width: '5%',padding:'0px' }}>
          <Button>
            <DeleteIcon />
          </Button>
        </TableCell>
      </TableRow>
    </>
  )
}
