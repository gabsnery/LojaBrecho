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
import { Checkbox, FormControlLabel } from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

export const SalesForm = props => {
  const classes = Style()

  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const { Clients, reduceStock, updateSalesProducts } = useData()

  const { Products } = useData()
  const [CurrentItem, setCurrentItem] = useState(props.CurrentItem)
  const [OrderProducts, setOrderProducts] = useState([])

  function handleInputClient (e) {
    setCurrentItem({ ...CurrentItem, [e.target.name]: e.target.value })
  }

  function closeModal () {
    setIsOpen(false)
  }
  useEffect(() => {
    if (OrderProducts.length > 0) {
      let total= OrderProducts.reduce((a, b) => {
        return a + b.Value
      }, 0);
      let discont = CurrentItem.Discount?CurrentItem.Discount:0;
      setCurrentItem({
        ...CurrentItem,
        ValueProducts: total,Value:
        total -
        total * (+discont / 100)
      })
    }
  }, [OrderProducts])

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
      let SaleRef = firebase
        .firestore()
        .collection('Sales')
        .doc(CurrentItem.id)
      FirebaseServices.update('Sales', CurrentItem).then(x => {
        updateSalesProducts(CurrentItem, OrderProducts)
        OrderProducts.map(item => {
          firebase
            .firestore()
            .collection('Products')
            .doc(item.id)
            .collection('Sales')
            .add({ Sale: SaleRef })
        })
        reduceStock(OrderProducts)
        setIsOpen(false)
        setState_(true)
      })
    } else {
      FirebaseServices.create('Sales', CurrentItem).then(x => {
        updateSalesProducts(x, OrderProducts)
        OrderProducts.map(item => {
          firebase
            .firestore()
            .collection('Products')
            .doc(item.id)
            .collection('Sales')
            .add({ Sale: x })
        })
        reduceStock(OrderProducts)
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
    let Items_ = []
    if (props.CurrentItem.hasOwnProperty('id')) {
      firebase
        .firestore()
        .collection('Sales')
        .doc(props.CurrentItem.id)
        .collection('Products')
        .get()
        .then(data => {
          let List = data.docs
          for (let index = 0; index < List.length; index++) {
            let item = List[index].data()

            Items_.push(Products.find(x => x.id === item['Product'].id))
          }
          setOrderProducts(Items_)
        })
    } else {
      setOrderProducts([])
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
      <Box className={classes.Panel}>
        <form onSubmit={editProduct}>
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
          <FormControlLabel
            control={
              <Checkbox
                disabled
                id='Site'
                checked={CurrentItem.Site}
                variant='standard'
                name='Site'
                label='Site'
                onChange={e =>
                  setCurrentItem({
                    ...CurrentItem,
                    [e.target.name]: e.target.checked
                  })
                }
              />
            }
            label='Site?'
          />
          <FormControlLabel
            control={
              <Checkbox
                id='UseCredit'
                checked={CurrentItem.UseCredit}
                variant='standard'
                name='UseCredit'
                onChange={e =>
                  setCurrentItem({
                    ...CurrentItem,
                    [e.target.name]: e.target.checked
                  })
                }
              />
            }
            label='Usar crédito?'
          />
          <Dropdown
            options={Products.filter(x => x['Stock'] !== null)
              .filter(x => x.Stock > 0 && !x.Site)
              .map(x => ({ value: x.id, label: x.Nome }))}
            onChange={e => {
              let prod = Products.find(x => x.id === e.value)
              setOrderProducts([...OrderProducts, prod])
            }}
            style={{ marginTop: '20px', width: '100%' }}
            placeholder='Select an option'
          />
          <ProductsList OrderProducts={OrderProducts} />
          <TextField
            label='Valor de venda'
            type='Number'
            value={CurrentItem.ValueProducts}
            disabled={true}
            onChange={e =>
              setCurrentItem({
                ...CurrentItem,
                [e.target.name]:
                  e.target.name === 'ValueProducts'
                    ? +e.target.value
                    : e.target.value
              })
            }
            name='ValueProducts'
            id='formatted-numberformat-input'
            variant='standard'
          />
          <TextField
            label='Desconto(%)'
            type='Number'
            value={CurrentItem.Discount}
            onChange={e =>
              setCurrentItem({
                ...CurrentItem,
                [e.target.name]:
                  e.target.name === 'Discount'
                    ? +e.target.value
                    : e.target.value,
                Value:
                  CurrentItem.ValueProducts -
                  CurrentItem.ValueProducts * (+e.target.value / 100)
              })
            }
            name='Discount'
            id='formatted-numberformat-input'
            variant='standard'
          />
          <h1>Valor total: {CurrentItem.Value}</h1>
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

const columns = [
  {
    field: 'Nome',
    headerName: 'Nome',
    width: 150,
    editable: true
  },
  {
    field: 'Value',
    headerName: 'Value',
    width: 150,
    editable: true
  }
]

function ProductsList (props) {
  const { OrderProducts } = props

  return (
    <div style={{ height: 400, marginTop: '20px', width: '100%' }}>
      <DataGrid
        rows={OrderProducts}
        rowHeight={38}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
      />
    </div>
  )
}
