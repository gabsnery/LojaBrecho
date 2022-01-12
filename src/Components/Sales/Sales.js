import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react'
import { useData } from '../../Context/DataContext'
import Style from '../../Style'
import { Sale } from './Sale'
import { SalesForm } from './SalesForm'

const Sales = () => {
  const classes = Style()
  const [modalIsOpen, setIsOpen] = useState(false)

  const { Sales } = useData()

  return (
    <div className='Sales'>
      <div className={classes.List}>
        <SalesForm
          modalIsOpen={modalIsOpen}
          CurrentItem={({ Nome: '' })}
          setIsOpen={setIsOpen}
        />
        <Button
          className={classes.AddButton}
          variant='outlined'
          onClick={() => setIsOpen(true)}
        >
          <AddCircleOutlineOutlinedIcon />
          Novo item
        </Button>
    
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell style={{ width: '50%' }}>Cliente</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Valor</TableCell>
              <TableCell />
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {Sales.map((row, index) => (
              <Sale
                key={`Sale_Row_${row.id}`}
                Sale={row}
                index={index}
              />
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
export default Sales
