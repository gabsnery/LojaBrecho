import React from 'react'
import { makeStyles } from '@mui/styles'

const Style = makeStyles({
  SubmitButton: {
    display: 'flex',
    margin: '3em 2em',
    position: 'fixed',
    right: 0,
    bottom: 0
  },
  List: {
    margin: '0 50px',
    backgroundColor: 'white',
    color: '#0A1929',
    borderRadius: '10px'
  },
  AddButton: { float: 'left', margin: '10px' },
  RemoveButton: { float: 'right', margin: '10px' },
  RemoveModal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4
  },
  Panel: {
    position: 'fixed',
    top: '0',
    height: '100%',
    right: '0px',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  }
})

export default Style
