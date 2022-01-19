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
    fontSize:'12px',
    borderRadius:'10px',
    paddingBottom:'10px',
    backgroundColor: 'white',
    color: '#0A1929',
  },
  AddButton: { float: 'left', margin: '10px' },
  RemoveButton: { float: 'right', margin: '10px' },
  RemoveModal: {
    position: 'absolute',
    backgroundColor:'white',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    height: 100,
    padding:15,
    border: '2px solid #000',
    boxShadow: '2px 2px tea',
  },
  input: {marginTop:'10px'},
  Panel: {
    position: 'fixed',
    top: '0',
    backgroundColor: 'white',
    height: '100%',
    right: '0px',
    width: '70%',
    padding:'10px 20px',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4
  }
})

export default Style
