import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import ModeEditOutlineOutlinedIcon from '@mui/icons-material/ModeEditOutlineOutlined'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import React, { useEffect,useState } from 'react'
import Style from '../../Style'
import ProductForm from './ProductForm'
import Barcode from 'react-hooks-barcode'

export const ProductsTags = props => {
  const { SelectedProducts, printTagsModal, setprintTagsModal } = props
  const [arraySelectedProducts, setarraySelectedProducts] = useState([])

  useEffect(() => {
    if(printTagsModal){
    let arrays = [],
      size = 7

    while (SelectedProducts.length > 0)
      arrays.push(SelectedProducts.splice(0, size))

      setarraySelectedProducts(arrays)
}
  }, [printTagsModal])
  const classes = Style()
  const config = {
    marginTop: '20px',
    marginBottom: '20px',
    fontOptions: 'italic',
    format: 'CODE128',
    font: 'monospace',
    fontSize: 12,
    width: 1,
    heigth:0.5
  }
  let TRY = 0
  console.log(SelectedProducts)
  return (
    <Modal
      open={printTagsModal}
      onClose={() => setprintTagsModal(false)}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      {printTagsModal ? (
        <Box className={classes.Panel}>
          <table>
            <tbody>
              {arraySelectedProducts.map(item_ => (
                <tr>
                  {item_.map(item => (
                    <>
                      <td style={{ width: '5px' }}>
                        <Barcode value={item['id']} {...config} />
                        {item['name']}
                      </td>
                    </>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </Box>
      ) : (
        <></>
      )}
    </Modal>
  )
}
