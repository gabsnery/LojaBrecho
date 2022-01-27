import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import TextField from '@mui/material/TextField'
import { convertFromRaw, convertToRaw, EditorState } from 'draft-js'
import React, { useEffect, useState } from 'react' 
 import { useTranslation } from 'react-i18next'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../../App.css'
import { useData, useState_ } from '../../Context/DataContext'
import firebase from '../../firebase.config'
import FirebaseServices from '../../services/services'
import Style from '../../Style'

export const ProductForm = props => {
  const classes = Style()
  const { modalIsOpen, setIsOpen } = props
  const { setState_ } = useState_()
  const [Client] = useState(props.Client)
  const { updateTotalValue } = useData()
  const [Entry] = useState(props.Entry)
  const [CurrentProduct, setCurrentProduct] = useState(props.CurrentProduct)
  const [editorState, setEditorState] = useState(EditorState.createEmpty())
  const { t } = useTranslation()

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
    let _CurrentProduct = CurrentProduct
    if (Client) {
      let ClientRef = firebase
        .firestore()
        .collection('Clients')
        .doc(Client.id)
      _CurrentProduct['Client'] = ClientRef
    }
    if (Entry) {
      let EntryRef = firebase
        .firestore()
        .collection('Entries')
        .doc(Entry.id)
      _CurrentProduct['Entry'] = EntryRef
    }

    if (_CurrentProduct.hasOwnProperty('id')) {
      FirebaseServices.update('Products', _CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
        updateTotalValue(_CurrentProduct)
      })
    } else {
      FirebaseServices.create('Products', _CurrentProduct).then(x => {
        setIsOpen(false)
        setState_(true)
        updateTotalValue(_CurrentProduct)
      })
    }
  }
  useEffect(() => {
    if (props.modalIsOpen && !props.CurrentProduct.hasOwnProperty('id')) {
      setCurrentProduct(props.CurrentProduct)
      props.CurrentProduct['type'] = 'ThriftStore'
      props.CurrentProduct['sold'] = false
      props.CurrentProduct['releasedCredit'] = false
      props.CurrentProduct['stock'] = 1
      //props.CurrentProduct['type']="New";
    }
      if (props.CurrentProduct['Description']) {
        setEditorState(
          EditorState.createWithContent(
            convertFromRaw(props.CurrentProduct['Description'])
          )
        )
      } else {
        setEditorState(EditorState.createEmpty())
      }
  }, [props])

  if (CurrentProduct === undefined) return <></>

  return (
    <Modal
      open={modalIsOpen}
      onClose={closeModal}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
    >
      <Box className={classes.Panel}>
        <h1>{t('Product.label')}</h1>
        <form onSubmit={editProduct}>
          <TextField
            id='name'
            variant='standard'
            name='name'
            style={{ width: '100%' }}
            defaultValue={CurrentProduct.name}
            onChange={handleInputClient}
            autoComplete='off'
          />
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4,1fr)',
              gridGap: '5px'
            }}
          >
            <TextField
              label={t('Category.label')}
              type='Number'
              value={CurrentProduct.stock}
              onChange={e =>
                setCurrentProduct({
                  ...CurrentProduct,
                  [e.target.name]:
                    e.target.name === 'stock' ? +e.target.value : e.target.value
                })
              }
              name='category'
              id='formatted-numberformat-input'
              variant='standard'
            />
            <TextField
              label={t('Stock.label')}
              type='Number'
              value={CurrentProduct.stock}
              disabled={CurrentProduct.type === 'ThriftStore'}
              onChange={e =>
                setCurrentProduct({
                  ...CurrentProduct,
                  [e.target.name]:
                    e.target.name === 'stock' ? +e.target.value : e.target.value
                })
              }
              name='stock'
              id='formatted-numberformat-input'
              variant='standard'
            />
            <TextField
              label={t('Value.label')}
              type='Number'
              value={CurrentProduct.value}
              onChange={e =>
                setCurrentProduct({
                  ...CurrentProduct,
                  [e.target.name]:
                    e.target.name === 'value' ? +e.target.value : e.target.value
                })
              }
              name='value'
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
            {t('Submit.label')}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
