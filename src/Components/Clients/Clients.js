import { useData } from '../../Context/DataContext'
import FirebaseServices from '../../services/services'
import * as actions from '../../store/actions'
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import Style from '../../Style'
import Client from './Client'
import { ClientForm } from './ClientForm'
import { connect } from 'react-redux'

const Clients = props => {
  const { t } = useTranslation()
  const classes = Style()
  const { Clients } = useData()
  const [EditIsOpen, setEditIsOpen] = React.useState(false)

  useEffect(() => {
    async function  getData(){

      FirebaseServices.getAll('Products').then(x => {
        x.sort((a, b) =>
          a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0
        )
        props.dispatch(actions.setProductos(x))
      })

      FirebaseServices.getAll('Clients').then(async (x)  => {
        x.sort((a, b) =>
          a['name'] > b['name'] ? 1 : b['name'] > a['name'] ? -1 : 0
        )
        for(let p=0;p<x.length;p++){
          x[p]['Credits'] = await (FirebaseServices.getSubCollection('Clients',x[p],'Credits'))
        }
        console.log(x)
        props.dispatch(actions.setClients(x))
      })
    }
    getData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>

      <div className={classes.List}>
        <ClientForm
          modalIsOpen={EditIsOpen}
          CurrentClient={({ name: '' })}
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
              <Client
                key={`Client_Row_${row.id}`}
                index={index}
                Client={row}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default connect(state => ({ Products: state.Products }))(Clients)
