import '../styles/globals.css'
import reduxStore from '../src/redux/store/store';
import { Provider } from "react-redux";

function MyApp({ Component, pageProps }) {
  return(
    <Provider store={reduxStore}>
    <Component {...pageProps} />
    </Provider>

  )
}

export default MyApp
