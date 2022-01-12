import React from 'react'
import { render, screen,fireEvent } from '@testing-library/react'
import Products from './Products'
import DataProvider, { DataContext, useData } from '../../Context/DataContext'
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
  },
  {
    Stock: 1,
    id: 3,
    Nome: '1',
    Value: 1
  },
  {
    Stock: 0,
    id: 4,
    Nome: '1',
    Value: 1
  }
]
describe('Component renders products', () => {
  it('1 row for each object on a list', () => {

    render(
      <DataContext.Provider value={{ Products: Products_ }}>
        <Products />
      </DataContext.Provider>
    )

    const table = screen.getByTestId('table-products')
    const rows = table.getElementsByTagName('tr')
    const checkbox = screen.getByTestId('Checkbox-ShowAll')
    expect(rows.length).toBe(3)
  })
  it('1 row for each object on a list with check box showing all', () => {

    render(
      <DataContext.Provider value={{ Products: Products_ }}>
        <Products />
      </DataContext.Provider>
    )
    const table = screen.getByTestId('table-products')
    const rows = table.getElementsByTagName('tr')
    const checkbox = screen.getByTestId('Checkbox-ShowAll').querySelector('input[type="checkbox"]')
    fireEvent.click(checkbox)
    expect(checkbox).toHaveProperty('checked', true)
    expect(rows.length).toBe(4)

  })
  it('Testing Show all checkbox changin value 2 times', () => {

    render(
      <DataContext.Provider value={{ Products: Products_ }}>
        <Products />
      </DataContext.Provider>
    )
    const table = screen.getByTestId('table-products')
    const rows = table.getElementsByTagName('tr')
    const checkbox = screen.getByTestId('Checkbox-ShowAll').querySelector('input[type="checkbox"]')
    fireEvent.click(checkbox)
    fireEvent.click(checkbox)
    expect(checkbox).toHaveProperty('checked', false)
    expect(rows.length).toBe(3)

  })
  
  //test getting a item on list, editing with a random number and compare if it changed
})
