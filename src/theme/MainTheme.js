import { createTheme } from '@mui/material/styles';
import { teal, blueGrey } from '@mui/material/colors';


const mainTheme = createTheme({
  palette: {
    primary: {
      main: blueGrey[700],
      light: blueGrey[200],
      middleLight: blueGrey[100],
      superLight: blueGrey[50],
    },
    secondary: {
      main: teal[400],
      light: teal[200],
      middleLight: teal[100],
      superLight: teal[50],
    },
  },
  
});

export default mainTheme