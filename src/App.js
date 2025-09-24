import {Routes, Route} from 'react-router-dom'

import './App.css'

import UserManagement from './components/UserManagement'
import NotFound from './components/NotFound'

const App = () => (
  <Routes>
    <Route path='/' element={<UserManagement />}/>
    <Route path='*' element={<NotFound/>}/>
  </Routes>
)
export default App;
