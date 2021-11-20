import { Checkbox, FormControlLabel } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import React, { useEffect, useState } from 'react'
import { useData, useState_ } from '../../Context/DataContext'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import Style from '../../Style'
import { Editor, EditorState } from 'draft-js'
import "draft-js/dist/Draft.css";

export const ProductsForm = props => {
  const classes = Style()
  const [editorState, setEditorState] = React.useState(() =>
    EditorState.createEmpty()
  )

  const editor = React.useRef(null)

  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const [Client] = useState(props.Client)
  const { updateTotalValue } = useData()
  const [Entry] = useState(props.Entry)
  const [CurrentProduct, setCurrentProduct] = useState(props.CurrentProduct)
  function handleInputClient (e) {
    e.preventDefault()
    console.log(e)
    setCurrentProduct({
      ...CurrentProduct,
      [e.target.name]:
        e.target.name === 'Value' ? +e.target.value : e.target.value
    })
  }

  function closeModal () {
    setIsOpen(false)
  }

  function editProduct (e) {
    e.preventDefault()
    if (Client) {
      let ClientRef = firebase
        .firestore()
        .collection('Clients')
        .doc(Client.id)
      CurrentProduct['Client'] = ClientRef
    }
    if (Entry) {
      let EntryRef = firebase
        .firestore()
        .collection('Entries')
        .doc(Entry.id)
      CurrentProduct['Entry'] = EntryRef
    }

    if (CurrentProduct.hasOwnProperty('id')) {
      FirebaseServices.update('Products', CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
        updateTotalValue(CurrentProduct)
      })
    } else {
      FirebaseServices.create('Products', CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
        updateTotalValue(CurrentProduct)
      })
    }
  }
  useEffect(() => {
    setCurrentProduct(props.CurrentProduct)
  }, [props.CurrentProduct])
  const focusEditor = () => {
    editor.current.focus()
  }
  if (CurrentProduct === undefined) return <></>

  return (
    <Modal
      open={modalIsOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.Panel}>
        <h1>Produto</h1>
        <form onSubmit={editProduct}>
          <TextField
            id='Nome'
            variant='standard'
            name='Nome'
            style={{ width: '100%' }}
            defaultValue={CurrentProduct.Nome}
            onChange={handleInputClient}
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gridGap: '5px'
            }}
          >
            <TextField
              label='Categoria'
              type='Number'
              value={CurrentProduct.Stock}
              onChange={e =>
                setCurrentProduct({
                  ...CurrentProduct,
                  [e.target.name]:
                    e.target.name === 'Stock' ? +e.target.value : e.target.value
                })
              }
              name='Stock'
              id='formatted-numberformat-input'
              variant='standard'
            />
            <TextField
              label='Estoque'
              type='Number'
              value={CurrentProduct.Stock}
              onChange={e =>
                setCurrentProduct({
                  ...CurrentProduct,
                  [e.target.name]:
                    e.target.name === 'Stock' ? +e.target.value : e.target.value
                })
              }
              name='Stock'
              id='formatted-numberformat-input'
              variant='standard'
            />
            <TextField
              label='Valor de venda'
              type='Number'
              value={CurrentProduct.Value}
              onChange={e =>
                setCurrentProduct({
                  ...CurrentProduct,
                  [e.target.name]:
                    e.target.name === 'Value' ? +e.target.value : e.target.value
                })
              }
              name='Value'
              id='formatted-numberformat-input'
              variant='standard'
            />
          </div>

          <div
            style={{
              border: '1px solid black',
              minHeight: '6em',
              cursor: 'text'
            }}
            onClick={focusEditor}
          >
            <Editor
              ref={editor}
              editorState={editorState}
              onChange={setEditorState}
              placeholder='Write something!'
            />
          </div>
          <FormControlLabel
            control={
              <Checkbox
                id='Site'
                checked={CurrentProduct.Site}
                variant='standard'
                name='Site'
                label='Site'
                onChange={e =>
                  setCurrentProduct({
                    ...CurrentProduct,
                    [e.target.name]: e.target.checked
                  })
                }
              />
            }
            label='Site?'
          />

          <Button
            type='submit'
            className={classes.SubmitButton}
            value='Submit'
            variant='outlined'
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
