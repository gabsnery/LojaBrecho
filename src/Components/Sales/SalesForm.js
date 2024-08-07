import { Checkbox, FormControlLabel } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { DataGrid,GridActionsCellItem} from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import Dropdown from 'react-dropdown'
import 'react-dropdown/style.css'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import * as actions from '../../store/actions'
import Style from '../../Style'
import * as APIUtils from '../common/APIUtils'
import DeleteIcon from '@mui/icons-material/DeleteOutlined';

const SalesForm = props => {
  const classes = Style()
  const { t } = useTranslation()
  const { EditModalIsOpen, setEditModalIsOpen } = props
  const { Products, Clients } = props
  const [CurrentItem, setCurrentItem] = useState(props.CurrentItem)
  const [SelectedClient, setSelectedClient] = useState({})
  const [SelectedProducts, setSelectedProducts] = useState([])
  const [AvalibleCredit, setAvalibleCredit] = useState(0)
  function handleInputClient (e) {
    setSelectedClient({ value: e.value, label: e.label })
  }
  function closeModal () {
    setEditModalIsOpen(false)
  }
  useEffect(() => {
    if (SelectedProducts.length > 0) {
      let total = SelectedProducts.reduce((a, b) => {
        return a + b.soldValue
      }, 0)
      let Credit = CurrentItem.Credit ? CurrentItem.Credit : 0

      setCurrentItem({
        ...CurrentItem,
        ValueProducts: total,
        Value: total - Credit
      })
    } else {
      setCurrentItem({
        ...CurrentItem,
        ValueProducts: 0,
        Value: 0
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SelectedProducts])

  function editProduct (e) {
    e.preventDefault()
    let ClientRef = firebase
      .firestore()
      .collection('Clients')
      .doc(SelectedClient.value)
    CurrentItem['Client'] = ClientRef

    if (CurrentItem.hasOwnProperty('id')) {
      FirebaseServices.update('Sales', CurrentItem).then(x => {
        APIUtils.updateSalesProducts(CurrentItem, SelectedProducts)
        props.dispatch(actions.updateSale({ ...CurrentItem }, SelectedProducts))

        if (CurrentItem.Credit > 0) {
          APIUtils.handleCredit(
            -CurrentItem.Credit,
            CurrentItem['Client'].id,
            SelectedProducts,
            'CreditUsed'
          )
        }
        setEditModalIsOpen(false)
      })
    } else {
      FirebaseServices.create('Sales', CurrentItem).then(x => {
        props.dispatch(
          actions.addSale({ ...CurrentItem, id: x.id }, SelectedProducts)
        )
        APIUtils.updateSalesProducts(x, SelectedProducts)
        if (CurrentItem.Credit > 0) {
          APIUtils.handleCredit(
            -CurrentItem.Credit,
            CurrentItem['Client'].id,
            SelectedProducts,
            'CreditUsed'
          )
        }
        setEditModalIsOpen(false)
      })
    }
  }
  const CalcularCredit = Client => {
    let credit = Clients.find(y => y.id === Client.id)
      ? Clients.find(y => y.id === Client.id)['Credits'].reduce(
          (prev, next) => {
            return +prev + +next.Value
          },
          0
        )
      : 0
    setAvalibleCredit(credit)
    return Client
  }
  const getThings = async () => {
    if (props.CurrentItem['Client'] && props.EditModalIsOpen) {
      CalcularCredit(props.CurrentItem['Client'])
    }
    if (props.CurrentItem.hasOwnProperty('id')) {
      setSelectedClient({
        value: props.CurrentItem['Client'].id,
        label: Clients.find(x => x.id === props.CurrentItem['Client'].id)[
          'name'
        ]
      })
      setSelectedProducts(props.CurrentItem['Products'])
      setCurrentItem(props.CurrentItem)
    }
  }
  useEffect(() => {
    if (props.EditModalIsOpen) {
      getThings()
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
              let credit = Clients.find(y => y.id === e.value)
                ? Clients.find(y => y.id === e.value)['Credits'].reduce(
                    (prev, next) => {
                      return +prev + +next.Value
                    },
                    0
                  )
                : 0
              setAvalibleCredit(credit)
              handleInputClient(e)
            }}
            value={SelectedClient}
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
              .filter(
                x =>
                  x.stock -
                    SelectedProducts.filter(o => o['id'] === x['id']).length >
                    0 && !x.Site
              )
              .map(x => ({ value: x.id, label: x.name }))}
            onChange={e => {
              let prod = Products.find(x => x.id === e.value)
              setSelectedProducts([...SelectedProducts, {...prod,soldValue:prod['value'],percDiscount:0}])
            }}
            style={{ marginTop: '20px', width: '100%' }}
            placeholder={t('SelectOption.label')}
          />
          <ProductsList
            SelectedProducts={SelectedProducts}
            setSelectedProducts={setSelectedProducts}
          />
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
            disabled={CurrentItem.hasOwnProperty('id')} //temporary - so i can think how to edit a sale and products that were removed (stock and stuff)
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
  const { SelectedProducts, setSelectedProducts } = props
  const { t } = useTranslation()

  const columns = [
    {
      field: 'name',
      headerName: t('Name.label'),
      width: 200,
      editable: false
    },
    {
      field: 'value',
      headerName: t('Value.label'),
      width: 100,
      editable: false
    },
    {
      field: 'percDiscount',
      headerName: 'Desconto(%)',
      width: 110,
      editable: true
    },
    {
      field: 'soldValue',
      headerName: 'Valor final',
      width: 110,
      editable: false
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 100,
      cellClassName: 'actions',
      getActions: ({ id }) => {
        return [

          <GridActionsCellItem
            icon={<DeleteIcon />}
            label='Cancel'
            className='textPrimary'
            onClick={(e) =>
              {
                setSelectedProducts(SelectedProducts.filter(x => x['id'] !==id))}
            }
            color='inherit'
          />
        ]
      }
    }
  ]
  return (
    <div style={{ height: 400, marginTop: '20px', width: '100%' }}>
      <DataGrid rows={SelectedProducts} rowHeight={38} columns={columns} onCellEditStop={(e,j)=>{
        if (j.target.value)
        switch (e.field) {
          case "percDiscount":
            let newArr = [...SelectedProducts]; 
            newArr.find(x=>x.id === e.id)['soldValue'] = ((+j.target.value)/100)*e.row.value; 
            newArr.find(x=>x.id === e.id)['percDiscount'] = +j.target.value; 
            setSelectedProducts(newArr)
             
            break;
          default:
            break;
        }
      }} />
    </div>
  )
}
export default connect(state => ({
  Products: state.thriftStore.Products,
  Clients: state.thriftStore.Clients
}))(SalesForm)
