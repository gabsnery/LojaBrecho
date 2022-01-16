import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useData } from '../../Context/DataContext'

function ClientHistory (props) {
  const { Client } = props
  const [ClientHistory, setClientHistory] = useState([])
  const { Entries, Sales } = useData()
  const { t, i18n } = useTranslation()

  useEffect(() => {
    i18n.changeLanguage('pt')
    setClientHistory(CreateResume(props.Client))
  }, [props])

  const CreateResume = Client => {
    let temp = []

    Entries.filter(p => p['Client'] !== undefined)
      .filter(p => p['Client'].id === Client.id)
      .map(t =>
        temp.push({
          type: 'Entrada',
          Created: new Date(t.Created.seconds * 1000),
          Value: t.Value
        })
      )

    Sales.filter(p => p['Client'] !== undefined)
      .filter(p => p['Client'].id === Client.id)
      .map(y =>
        temp.push({
          type: 'Saida',
          Created: new Date(y.Created.seconds * 1000),
          Value: y.Value
        })
      )
    Client.Credits.map(p =>
      temp.push({
        type: p.Type,
        Created: new Date(p.Created.seconds * 1000),
        Value: p.Value
      })
    )
    temp = temp.sort((a, b) =>  b.Created -a.Created)
    return temp
  }
  return (
    <React.Fragment>
      {ClientHistory ? (
        ClientHistory.map((subRow, index) => (
          <TableRow key={`Client_Row_${Client.id}_${index}`}>
            <TableCell>
              {moment(subRow.Created).format('MM/D/yyyy HH:mm')}
            </TableCell>
            <TableCell>{t(subRow.type)}</TableCell>
            <TableCell>{subRow.Value}</TableCell>
          </TableRow>
        ))
      ) : (
        <></>
      )}
    </React.Fragment>
  )
}
export default ClientHistory
