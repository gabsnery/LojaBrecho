import * as actions from '../../store/actions'
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
import { connect } from 'react-redux'

const ProductForm = props => {
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
        props.dispatch(actions.addProduct({..._CurrentProduct,id:x['id']}))

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
            label={t('Product.label')}
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
          <div style={{  marginTop: '2em' }}>
             Descrição
          <div style={{ border: '1px solid grey',marginTop: '1em' }}>
            <Editor
              editorState={editorState}
              toolbarClassName='toolbarClassName'
              wrapperClassName='wrapperClassName'
              editorClassName='editorClassName'
              onEditorStateChange={onEditorStateChange}
            />
          </div>
          </div>
          <Box
            sx={{
              margin: '30px 0',
              padding: '30px 10px',
              border: '1px dashed grey'
            }}
          >
            <span>Grupo de campos para Produtos</span>
          <div
            style={{
              padding: '10px',
              marginTop: '10px',
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gridGap: '10px'
            }}
          >
            <TextField
              label={t('Height.label')}
              id='height'
              variant='standard'
              name='height'
              value={CurrentProduct.height}
              onChange={handleInputClient}
            />
            <TextField
              label={t('ShoulderWidth.label')}
              id='shoulderWidth'
              variant='standard'
              name='shoulderWidth'
              value={CurrentProduct.shoulderWidth}
              onChange={handleInputClient}
              />
            <TextField
              label={t('BustWidth.label')}
              id='bustWidth'
              variant='standard'
              name='bustWidth'
              value={CurrentProduct.bustWidth}
              onChange={handleInputClient}
              />
            <TextField
              label={t('WaistWidth.label')}
              id='waistWidth'
              variant='standard'
              name='waistWidth'
              value={CurrentProduct.waistWidth}
              onChange={handleInputClient}
              />
            <TextField
              label={t('HipWidth.label')}
              id='hipWidth'
              variant='standard'
              name='hipWidth'
              value={CurrentProduct.hipWidth}
              onChange={handleInputClient}
              />
            <TextField
              label={t('SleeveLength.label')}
              id='sleeveLength'
              variant='standard'
              name='sleeveLength'
              value={CurrentProduct.sleeveLength}
              onChange={handleInputClient}
              />
            <TextField
              label={t('LegWidth.label')}
              id='legWidth'
              variant='standard'
              name='legWidth'
              value={CurrentProduct.legWidth}
              onChange={handleInputClient}
              />
          </div>
          </Box>
          <Box
            sx={{
              margin: '30px 0',
              padding: '30px 10px',
              border: '1px dashed grey'
            }}
          >
            <span>Entrega</span>
            <br />
 
            <TextField
              label={t('Weight.label')}
              id='weight'
              variant='standard'
              style={{ width: '15%' }}
              name='weight'
              value={CurrentProduct.weight}
              onChange={handleInputClient}
            />
              <br />

               <TextField
              label={t('Length.label')}
              id='length'
              variant='standard'
              name='length'
              style={{ width: 'calc(15% - 10px)' }}
              value={CurrentProduct.length}
              onChange={handleInputClient}
            />
            <TextField
              label={t('Width.label')}
              id='width'
              variant='standard'
              name='width'
              style={{ width: 'calc(15% - 10px)', marginLeft: '10px' }}
              value={CurrentProduct.width}
              onChange={handleInputClient}
            />
            <TextField
              label={t('Height.label')}
              id='height'
              variant='standard'
              name='height'
              style={{ width: 'calc(15% - 10px)', marginLeft: '10px' }}
              value={CurrentProduct.height}
              onChange={handleInputClient}
            />
          </Box>
         
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
export default connect(state => ({ Products: state.Products }))(ProductForm)
