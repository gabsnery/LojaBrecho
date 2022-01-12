import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React from 'react'
import { useData } from '../../Context/DataContext'
import Style from '../../Style'
import Client from './Client'
import { ClientForm } from './ClientForm'

const Clients = () => {
  const classes = Style()
  const { Clients } = useData()
  const [EditIsOpen, setEditIsOpen] = React.useState(false)
  return (
    <div>

      <div className={classes.List}>
        <ClientForm
          modalIsOpen={EditIsOpen}
          CurrentClient={({ Nome: '' })}
          setIsOpen={setEditIsOpen}
        />
        <Button
          className={classes.AddButton}
          variant='outlined'
          onClick={() => setEditIsOpen(true)}
        >
          <AddCircleOutlineOutlinedIcon />
          Novo item
        </Button>

        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Id</TableCell>
              <TableCell>Nome</TableCell>
              <TableCell>Crédito previsto</TableCell>
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

export default Clients
