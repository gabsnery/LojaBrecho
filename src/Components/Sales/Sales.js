import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined'
import { TableBody } from '@mui/material'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import React, { useState } from 'react' 
 import { useTranslation } from 'react-i18next'
import { useData } from '../../Context/DataContext'
import Style from '../../Style'
import { Sale } from './Sale'
import { SalesForm } from './SalesForm'

const Sales = () => {
  const classes = Style()
  const [modalIsOpen, setIsOpen] = useState(false)
  const { t } = useTranslation()

  const { Sales } = useData()

  return (
    <div className='Sales'>
      <div className={classes.List}>
        <SalesForm
          EditModalIsOpen={modalIsOpen}
          CurrentItem={({ Nome: '' })}
          setEditModalIsOpen={setIsOpen}
        />
        <Button
          className={classes.AddButton}
          variant='outlined'
          onClick={() => setIsOpen(true)}
        >
          <AddCircleOutlineOutlinedIcon />
          {t('NewItem.label')}
        </Button>
    
        <Table aria-label='collapsible table' size='small'>
          <TableHead>
            <TableRow>
              <TableCell>{t('Date.label')}</TableCell>
              <TableCell style={{ width: '50%' }}>{t('Client.label')}</TableCell>
              <TableCell>{t('Value.label')}</TableCell>
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
