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
import Style from '../../Style'
import Client from './Client'
import ClientForm from './ClientForm'

const Clients = props => {
  const { t } = useTranslation()
  const classes = Style()
  const { Clients } = props
  const [EditIsOpen, setEditIsOpen] = React.useState(false)

  
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
  Clients: state.thriftStore.Clients,
  Products: state.thriftStore.Products
}))(Clients)
