import { Component } from "react"
import Popup from "reactjs-popup"

import axios from 'axios'

import './index.css'

import { PulseLoader } from "react-spinners"

import { TbError404 } from "react-icons/tb"
import { SiTicktick } from "react-icons/si"

// API status constants to be used for loading, failure, success views
const apiDeleteStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

// Delete pop-up component using state (Child Component for UserDashboard Component)
class DeletePopup extends Component{
    state = {apiDeleteStatus: apiDeleteStatusConstants.initial, userData: {...this.props.userData}, failureMsg:''}


    // deletes user of specific user ID using DELETE method
    onDeletedData = async () =>{
        this.setState({apiDeleteStatus:apiDeleteStatusConstants.inProgress}) // API status is set to progress so spinner/ loading is displayed till fetching data is complete
        const {userData} = this.state
        const url = `https://jsonplaceholder.typicode.com/users/${userData.id}`
        try{
            const response = await axios.delete(url)
            console.log("response:", response.data)
            this.setState({apiDeleteStatus:apiDeleteStatusConstants.success}) // renders success
        } catch (error) {
            console.log("Error:", error.message)
            this.setState({failureMsg: error.message, apiDeleteStatus:apiDeleteStatusConstants.failure}) // renders failure with failure msg
        }
    }
    

    // Chooses which content to render based on API status
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

    // initially displays user details and asks for confirmation to delete
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
                            // will delete the user data using API with DELETE method
                            onClick={this.onDeletedData}
                        >
                            Delete User
                        </button>
                        {/* on clicking cancel will close the pop-up */}
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

    //used to display failure msg when failed fetching data
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

    // used to display success msg on success updating data
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

    // used to display a spinner while fetching data (during a fetch request to the API)
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