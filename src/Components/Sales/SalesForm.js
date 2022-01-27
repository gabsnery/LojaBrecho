import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react' 
 import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  const { EditModalIsOpen, setEditModalIsOpen } = props
  const { setState_ } = useState_()
  const {
    Clients,
    handleCredit,
    reduceStock,
    updateSalesProducts
  } = useData()

  const { Products } = useData()
  const [CurrentItem, setCurrentItem] = useState(props.CurrentItem)
  const [OrderProducts, setOrderProducts] = useState([])
  const [AvalibleCredit, setAvalibleCredit] = useState(0)

  function handleInputClient (e) {
    setCurrentItem({ ...CurrentItem, [e.target.name]: e.target.value })
  }

  function closeModal () {
    setEditModalIsOpen(false)
  }
  useEffect(() => {
    if (OrderProducts.length > 0) {
      let total = OrderProducts.reduce((a, b) => {
        return a + b.value
      }, 0)
      let Credit = CurrentItem.Credit ? CurrentItem.Credit : 0

      setCurrentItem({
        ...CurrentItem,
        ValueProducts: total,
        Value: total - Credit
      })
    }
  }, [OrderProducts, CurrentItem])

  function editProduct (e) {
    e.preventDefault()
    let ClientRef = firebase
      .firestore()
      .collection('Clients')
      .doc(
        typeof CurrentItem.Client == 'string'
          ? CurrentItem.Client
          : CurrentItem['Client'].Value
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
          return null
        })
        reduceStock(OrderProducts)
        if (CurrentItem.Credit > 0) {
          handleCredit(
            -CurrentItem.Credit,
            CurrentItem['Client'].id,
            OrderProducts,
            'CreditUsed'
          )
        }

        setEditModalIsOpen(false)
        setState_(true)
      })
    } else {
      FirebaseServices.create('Sales', CurrentItem).then(x => {
        updateSalesProducts(x, OrderProducts)
        if (CurrentItem.Credit > 0) {
          handleCredit(
            -CurrentItem.Credit,
            CurrentItem['Client'].id,
            OrderProducts,
            'CreditUsed'
          )
        }
        OrderProducts.map(item => {
          firebase
            .firestore()
            .collection('Products')
            .doc(item.id)
            .collection('Sales')
            .add({ Sale: x })
          return null
        })
        reduceStock(OrderProducts)

        setEditModalIsOpen(false)
        setState_(true)
      })
    }
  }
  const CalcularCredit = Client => {
    let Cli = Client ? Clients.find(y => y.id === Client.id) : 0
    let credit = Clients.find(y => y.id === Cli.id)
      ? Clients.find(y => y.id === Cli.id)['Credits'].reduce((prev, next) => {
          return +prev + +next.Value
        }, 0)
      : 0
    setAvalibleCredit(credit)
    return Cli
  }
  useEffect(() => {
    let item_ = { ...props.CurrentItem }
    console.log('props',props)
    console.log('item_',item_)
    if (props.EditModalIsOpen) {
      debugger;
      if (props.CurrentItem['Client'] && props.EditModalIsOpen) {
        let Cli = CalcularCredit(props.CurrentItem['Client'])

        item_['Client'] = { value: Cli.id, label: Cli.name }
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
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props])
  return (
    <Modal
      open={EditModalIsOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.Panel}>
        <form onSubmit={editProduct}>
          <Dropdown
            className={classes.input}
            options={Clients.map(x => ({ value: x.id, label: x.name }))}
            onChange={e => {
              let e_ = { target: { name: 'Client', value: e.value } }
              let credit = Clients.find(y => y.id === e.value)
                ? Clients.find(y => y.id === e.value)['Credits'].reduce(
                    (prev, next) => {
                      return +prev + +next.Value
                    },
                    0
                  )
                : 0
              setAvalibleCredit(credit)

              handleInputClient(e_)
            }}
            value={CurrentItem.Client}
            placeholder={t('Client.label')}
          />
          <FormControlLabel
            control={
              <Checkbox
                disabled
                id='Site'
                checked={CurrentItem.Site}
                variant='standard'
                name='Site'
                label={t('Site.label')}
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
                value={CurrentItem.UseCredit || false}
                variant='standard'
                name='UseCredit'
                onChange={e => {
                  setCurrentItem({
                    ...CurrentItem,
                    [e.target.name]: e.target.checked,
                    Value: CurrentItem.ValueProducts,
                    Credit: 0
                  })
                }}
              />
            }
            label={t('UseCredit.label')}
          />
          <span style={{ color: 'grey' }}>{AvalibleCredit}</span>
          {CurrentItem.UseCredit ? (
            <TextField
              label={t('Credit.label')}
              type='Number'
              value={CurrentItem.Credit}
              onChange={e =>
                setCurrentItem({
                  ...CurrentItem,
                  [e.target.name]:
                    e.target.name === 'Credit'
                      ? +e.target.value
                      : e.target.value,
                  Value: CurrentItem.ValueProducts - +e.target.value
                })
              }
              name='Credit'
              id='formatted-numberformat-input'
              variant='standard'
            />
          ) : (
            <></>
          )}
          <Dropdown
            options={Products.filter(x => x['stock'] !== null)
              .filter(x => x.stock > 0 && !x.Site)
              .map(x => ({ value: x.id, label: x.name }))}
            onChange={e => {
              let prod = Products.find(x => x.id === e.value)
              setOrderProducts([...OrderProducts, prod])
            }}
            style={{ marginTop: '20px', width: '100%' }}
            placeholder={t('SelectOption.label')}
          />
          <ProductsList OrderProducts={OrderProducts} />
          <TextField
            label={t('Value.label')}
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
            label={`${t('Discount.label')}?`}
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
            {t('Submit.label')}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}



function ProductsList (props) {
  const { OrderProducts } = props
  const { t } = useTranslation()

  const columns = [
    {
      field: 'name',
      headerName: t('Name.label'),
      width: 150,
      editable: true
    },
    {
      field: 'value',
      headerName: t('Value.label'),
      width: 150,
      editable: true
    }
  ]
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
