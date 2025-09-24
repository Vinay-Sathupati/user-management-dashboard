import {Link, useNavigate} from 'react-router-dom'

import './index.css'

const NotFound = () => {
  const navigate = useNavigate()

  const onClickGoHome = ()=>{
    navigate('/')
  }

  return (
    <div className="not-found-container">
        <h1 className='not-found-heading'>Site Not Found</h1>
        <div className='not-found-text-button-container'>
            <p className="not-found-text">
                we are sorry, the page you requested could not be found.
            </p>
            <Link to="/" className="link-item">
                <button
                type="button"
                className="go-home-button"
                onClick={onClickGoHome}
                >
                Go Back Home
                </button>
            </Link>
        </div>
    </div>
  )
}

export default NotFound