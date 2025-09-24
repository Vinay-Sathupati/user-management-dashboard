import {Link} from 'react-router-dom'

import './index.css'


const Banner = ()=> {
    return (
        <div className='banner-main-container'>
            <div className='top-styling-container'>
                <span className='dot red'></span>
                <span className='dot yellow'></span>
                <span className='dot green'></span>
                <Link to='/' className='link-item'>
                    <h1 className='user-list-main-heading'>User Management Dashboard</h1>
                </Link>
                
            </div>
        </div>
    )
}

export default Banner