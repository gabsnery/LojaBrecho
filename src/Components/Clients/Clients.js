import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import FirebaseServices from '../../services/services'
import * as actions from '../../store/actions'
import Style from '../../Style'
import Client from './Client'
import ClientForm from './ClientForm'

const Clients = props => {
  const { t } = useTranslation()
  const classes = Style()
  const { Clients, Products } = props
  const [EditIsOpen, setEditIsOpen] = React.useState(false)

  useEffect(() => {
    async function getData () {
      let temp_Products = []
      FirebaseServices.getAll('Products').then(x => {
        x.sort((a, b) =>
          a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0
        )
        temp_Products = x
        props.dispatch(actions.setProductos(x))
      })
      FirebaseServices.getAll('Entries').then(x => {
        x.sort((a, b) =>
          a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0
        )
        props.dispatch(actions.setEntries(x))
      })

      FirebaseServices.getAll('Clients').then(async x => {
        x.sort((a, b) =>
          a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0
        )
        for (let p = 0; p < x.length; p++) {
          x[p]['Credits'] = await FirebaseServices.getSubCollection(
            'Clients',
            x[p],
            'Credits'
          )
        }
        props.dispatch(actions.setClients(x))
      })
      FirebaseServices.getAll('Sales').then(async x => {
        x.sort((a, b) =>
          a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0
        )
        for (let p = 0; p < x.length; p++) {
          x[p]['Products'] = (
            await FirebaseServices.getSubCollection('Sales', x[p], 'Products')
          ).map(y => temp_Products.find(x => x.id === y['Product'].id))
        }
        props.dispatch(actions.setSales(x))
      })
    }
    getData()
  }, [])
  useEffect(() => {
    console.log('Props', props)
  }, [props])
  return (
    <div>
      <div className={classes.List}>
        <ClientForm
          modalIsOpen={EditIsOpen}
          CurrentClient={{ name: '' }}
          setIsOpen={setEditIsOpen}
        />
        <Button
          className={classes.AddButton}
          variant='outlined'
          onClick={() => setEditIsOpen(true)}
        >
          <AddCircleOutlineOutlinedIcon />
          {t('NewItem.label')}
        </Button>

        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell>{t('Name.label')}</TableCell>
              <TableCell>{t('Credit.label')}</TableCell>
              <TableCell />
              <TableCell />
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Clients.map((row, index) => (
              <Client key={`Client_Row_${row.id}`} index={index} Client={row} />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default connect(state => ({
  Clients: state.Clients,
  Products: state.Products
}))(Clients)
