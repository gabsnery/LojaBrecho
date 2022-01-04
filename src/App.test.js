import React from 'react'
import { render, screen } from '@testing-library/react'
import Products from './Components/Products/Products'
import DataProvider, { useData } from './Context/DataContext'

describe('Componente renderiza produtos', () => {
  it('Renderiza lista', () => {
    const Products_ = [
      {
        Stock: 1,
        id: 1,
        Nome: '1',
        Value: 1
      },
      {
        Stock: 1,
        id: 2,
        Nome: '1',
        Value: 1
      }
      ,
      {
        Stock: 1,
        id: 3,
        Nome: '1',
        Value: 1
      }
    ]
    render(
      <DataProvider>
        <Products Products={Products_} />
      </DataProvider>
    )
   const table = screen.getByTestId('table-products')
   const rows =  table.getElementsByTagName('tr')
    

    expect(rows.length).toBe(3)
  })
})
