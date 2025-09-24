import { Component } from "react"
import Popup from "reactjs-popup"

import axios from 'axios'

import './index.css'

import { PulseLoader } from "react-spinners"

import { TbError404 } from "react-icons/tb"
import { SiTicktick } from "react-icons/si"


const apiDeleteStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}


class DeletePopup extends Component{
    state = {apiDeleteStatus: apiDeleteStatusConstants.initial, userData: {...this.props.userData}, failureMsg:''}


    onDeletedData = async () =>{
        this.setState({apiDeleteStatus:apiDeleteStatusConstants.inProgress})
        const {userData} = this.state
        const url = `https://jsonplaceholder.typicode.com/users/${userData.id}`
        try{
            const response = await axios.delete(url)
            console.log("response:", response.data)
            this.setState({apiDeleteStatus:apiDeleteStatusConstants.success})
        } catch (error) {
            console.log("Error:", error.message)
            this.setState({failureMsg: error.message, apiDeleteStatus:apiDeleteStatusConstants.failure})
        }
    }
    

    renderPopupContent = ()=>{
        const {apiDeleteStatus}=this.state
        switch (apiDeleteStatus) {
            case apiDeleteStatusConstants.initial:
                return this.renderDeleteInitialView()
            case apiDeleteStatusConstants.inProgress:
                return this.renderDeleteLoadingView()
            case apiDeleteStatusConstants.failure:
                return this.renderDeleteFailureView()
            case apiDeleteStatusConstants.success:
                return this.renderDeleteSuccessView()
            default:
                return null
        }
    }

    renderDeleteInitialView = () =>{
        const {userData} = this.state
        const {firstName,lastName,email,department}=userData
        const {onClose} = this.props
        return (
            <>
                <div className="header">Are you sure you want to delete this user?</div>
                <div className="content">
                    <div className="content">
                        <p className="add-confirmation-text">First Name: {firstName}</p>
                        <p className="add-confirmation-text">Last Name: {lastName}</p>
                        <p className="add-confirmation-text">Email: {email}</p>
                        <p className="add-confirmation-text">Department: {department}</p>
                    </div>
                    <div className="actions">
                        <button
                            className="delete-confirm-button"
                            type="button"
                            onClick={this.onDeletedData}
                        >
                            Delete User
                        </button>
                        <button
                            className="close-button"
                            type="button"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
                
            </>
        )
    }

    renderDeleteFailureView = () =>{
            const {failureMsg} = this.state
            return (
                <div className='form-failure-container'>
                    <TbError404 className="failure-icon" />
                    <p className='failure-para'>{failureMsg}</p>
                    <button 
                        className='try-again-button' 
                        onClick={() => {
                            this.setState({ apiDeleteStatus: apiDeleteStatusConstants.initial });
                            this.props.onClose();
                        }}
                    >
                        Please Try Again
                    </button>
                </div>
            )
        }

    renderDeleteSuccessView = () =>{
        return(
            <>
                <div className='render-success-main-container'>
                    <SiTicktick className='success-tick-icon' />
                    <h1 className='success-heading'>Success</h1>
                    <p className='success-para'>User deleted successfully.</p>
                    <button 
                        type="button" 
                        className='success-ok-button' 
                        onClick={
                            this.props.onClose
                        }
                    >
                        OK
                    </button>
                </div>
            </>
        )
    }

    renderDeleteLoadingView = () => (
        <div className='form-loader-container'>
            <PulseLoader color="#ff5f57" />
        </div>
    )

    render(){
        const {onClose} = this.props
        return (
            <Popup
                open={true}
                onClose={onClose}
                modal
                nested
            >
                {close => (
                    <div className="modal">
                        <button className="close" onClick={close}>&times;</button>
                        {this.renderPopupContent()}
                    </div>
                )}
            </Popup>
        )
    }
}

export default DeletePopup