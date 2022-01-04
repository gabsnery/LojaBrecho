import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import React, { useEffect, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../../App.css'
import { useData, useState_ } from '../../Context/DataContext'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import Style from '../../Style'

export const ProductsForm = props => {
  const classes = Style()
  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const [Client] = useState(props.Client)
  const { updateTotalValue } = useData()
  const [Entry] = useState(props.Entry)
  const [CurrentProduct, setCurrentProduct] = useState(props.CurrentProduct)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())

  const onEditorStateChange = editorState => {
    setCurrentProduct({
      ...CurrentProduct,
      Description: convertToRaw(editorState.getCurrentContent())
    })
    setEditorState(editorState)
  }
  function handleInputClient (e) {
    e.preventDefault()
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
    props.CurrentProduct['Type'] = 'ThriftStore'
    props.CurrentProduct['Sold'] = false
    props.CurrentProduct['ReleasedCredit'] = false
    props.CurrentProduct['Stock'] = 1
    //props.CurrentProduct['Type']="New";
    if (props.CurrentProduct['Description']) {
      setEditorState(
        EditorState.createWithContent(
          convertFromRaw(props.CurrentProduct['Description'])
        )
      )
    } else {
      setEditorState(EditorState.createEmpty())
    }
  }, [props.CurrentProduct])

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
              disabled={CurrentProduct.Type === 'ThriftStore'}
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
              border: '1px solid grey',
              padding: '10px',
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gridGap: '5px'
            }}
          >
            <TextField
              id='Tamanho1'
              variant='standard'
              name='Tamanho1'
              value={CurrentProduct.Tamanho1}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho2'
              variant='standard'
              name='Tamanho2'
              value={CurrentProduct.Tamanho2}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho3'
              variant='standard'
              name='Tamanho3'
              value={CurrentProduct.Tamanho3}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho4'
              variant='standard'
              name='Tamanho4'
              value={CurrentProduct.Tamanho4}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho5'
              variant='standard'
              name='Tamanho5'
              value={CurrentProduct.Tamanho5}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho6'
              variant='standard'
              name='Tamanho6'
              value={CurrentProduct.Tamanho6}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho7'
              variant='standard'
              name='Tamanho7'
              value={CurrentProduct.Tamanho7}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho8'
              variant='standard'
              name='Tamanho8'
              value={CurrentProduct.Tamanho8}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho9'
              variant='standard'
              name='Tamanho9'
              value={CurrentProduct.Tamanho9}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho10'
              variant='standard'
              name='Tamanho10'
              value={CurrentProduct.Tamanho10}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho11'
              variant='standard'
              name='Tamanho11'
              value={CurrentProduct.Tamanho11}
              onChange={handleInputClient}
            />
            <TextField
              id='Tamanho12'
              variant='standard'
              name='Tamanho12'
              value={CurrentProduct.Tamanho12}
              onChange={handleInputClient}
            />
          </div>
          <div style={{ border: '1px solid grey', marginTop: '10px' }}>
            <Editor
              editorState={editorState}
              toolbarClassName='toolbarClassName'
              wrapperClassName='wrapperClassName'
              editorClassName='editorClassName'
              onEditorStateChange={onEditorStateChange}
            />
          </div>
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
