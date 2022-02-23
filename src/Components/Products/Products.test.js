import * as React from 'react'
import { Provider } from 'react-redux'
import { render, screen, fireEvent } from '@testing-library/react'
import store from '../../store'
import actions from '../../store/actions'
import Products from './Products'
const Products_ = [
  {
    stock: 1,
    id: 1,
    Nome: '1',
    Value: 1
  },
  {
    stock: 1,
    id: 2,
    Nome: '1',
    Value: 1
  },
  {
    stock: 1,
    id: 3,
    Nome: '1',
    Value: 1
  },
  {
    stock: 0,
    id: 4,
    Nome: '1',
    Value: 1
  }
]
describe('AddTodo component test', () => {
  test('adds a new TODO when the button is pressed', () => {
    const store = store()

    render(
      <Provider store={store}>
        <Products />
      </Provider>
    )
    store.dispatch(actions.actions())

    const table = screen.getByTestId('table-products')
    const rows = table.getElementsByTagName('tr')
    const checkbox = screen.getByTestId('Checkbox-ShowAll')
    expect(rows.length).toBe(3)
  })
})
