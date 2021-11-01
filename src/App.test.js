import { configure, mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import toJson from 'enzyme-to-json'
import Clients from './Components/Clients'
configure({ adapter: new Adapter() })

it('should render', () => {
  const spy = jest.spyOn(global.console, 'error')
  const onClick = jest.fn()
  let props = {
      text: 'Teste',
      onClick: onClick,
      disabled: false
  }
  const app = mount( 
      <Clients {...props} />,
  )
  expect(toJson(app)).toMatchSnapshot()
  expect(spy).not.toHaveBeenCalled()
})
