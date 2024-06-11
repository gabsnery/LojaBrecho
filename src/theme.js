import { createTheme } from '@mui/material/styles';
export const rowHeigth = 22;
export const theme = {

  palette: {
    mode: 'dark',
    accent: '#F2678B',
    common: {
      black: '#1A1A1A',
      white: '#FFF',
    },
    background: {
      paper: '#F7F7F7',
      default: '#F7F7F7',
      disabled: '#cccccc',
    },
    text: {
      secondary: '#0E0E0E',
      primary: '#0E0E0E',
      disabled: '#666666',
    },
    primary: {
      light3: '#001b3b',
      light2: '#001b3b',
      light1: '#001b3b',
      light: '#001b3b',
      main: '#001b3b',
      dark: '#001b3b',
      dark1: '#001b3b',
      dark2: '#001b3b',
      dark3: '#001b3b',
      contrastText: '#F7F7F7',
    },
    grey: {
      50: '#F7F7F7',
      100: '#EDEDED',
      200: '#DEDEDE',
      300: '#CCCCCC',
      400: '#B2B2B2',
      500: '#9C9C9C',
      600: '#717171',
      700: '#595959',
      800: '#404040',
      900: '#2E2E2E',
      A100: '#1A1A1A',
      A200: '#0E0E0E',
    },
    secondary: {
      light3: '#81A585',
      light2: '#81A585',
      light1: '#81A585',
      light: '#81A585',
      main: '#81A585',
      dark: '#81A585',
      dark1: '#81A585',
      dark2: '#81A585',
      dark3: '#81A585',
      contrastText: '#F7F7F7',
    },
    error: {
      main: '#d32f2f'
    },
    warning: {
      main: '#ed6c02',
    },
    success: {
      main: '#b5db63',
      light: '#779573',
      dark: '#323833',
    },
    info: {
      main: '#F485A2',
      light: '#9F9F9F',
    },
    divider: '#CCCCCC',
    other: {
      pastel1: '#F9B3B3',
      pastel2: '#A0C4FF',
      pastel3: '#FDCCA4',
      pastel4: '#95B8B6',
      pastel5: '#D6AEF7',
      pastel6: '#C1D5A8',
      pastel7: '#FF9999',
      pastel8: '#8FCACA'
    }
  },
}
export const muiTheme = createTheme(theme)