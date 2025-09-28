import { Component } from "react"
import Popup from "reactjs-popup"

import axios from 'axios'

import './index.css'

import { PulseLoader } from "react-spinners"

import { TbError404 } from "react-icons/tb"
import { SiTicktick } from "react-icons/si"

// API status constants to be used for loading, failure, success views
const apiEditStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE'
}

// Edit pop-up component using state (Child Component for UserDashboard Component)
class EditPopup extends Component{
    state = {apiEditStatus: apiEditStatusConstants.initial, userData: {...this.props.userData}, failureMsg:''}

    // updates the corresponding state userData key as user types in that particular field
    onEditUserDetails = event =>{
        const {name,value} = event.target
        this.setState(prevState => ({
            userData: {
                ...prevState.userData,
                [name]: value
            }
        }))
    }

    // updates the exisiting user data with PUT method
    onSaveEditedData = async () =>{
        this.setState({apiEditStatus:apiEditStatusConstants.inProgress}) // API status is set to progress so spinner/ loading is displayed till fetching data is complete
        const {userData} = this.state
        const url = `https://jsonplaceholder.typicode.com/users/${userData.id}`
        const params = {
            name: userData.firstName+" "+userData.lastName,
            email: userData.email,
            department: userData.department
        }
        try{
            const response = await axios.put(url, params)
            console.log("response:", response.data)
            this.setState({apiEditStatus:apiEditStatusConstants.success}) // renders success 
        } catch (error) {
            console.log("Error:", error.message)
            this.setState({failureMsg: error.message, apiEditStatus:apiEditStatusConstants.failure})  // renders failure with failure msg
        }
    }
    
    // Chooses which content to render based on API status
    renderPopupContent = ()=>{
        const {apiEditStatus}=this.state
        switch (apiEditStatus) {
            case apiEditStatusConstants.initial:
                return this.renderEditInitialView()
            case apiEditStatusConstants.inProgress:
                return this.renderEditLoadingView()
            case apiEditStatusConstants.failure:
                return this.renderEditFailureView()
            case apiEditStatusConstants.success:
                return this.renderEditSuccessView()
            default:
                return null
        }
    }

    // initially displays user details in input fields to edit
    renderEditInitialView = () =>{
        const {userData} = this.state
        const {onClose} = this.props
        return (
            <>
                <div className="header">Update User Details</div>
                <div className="content">
                    <div className="form-first-last-name-email-department-container">
                        {/* maintained common function for all the input fields to update the state */}
                        <div className="name-input-container">
                            <label className="label-heading" htmlFor="first-name">First Name<span className="star-mark">*</span></label>
                            <input required className="input-element" id="first-name" type="text" placeholder="Enter First Name" name="firstName" value={userData.firstName} onChange={this.onEditUserDetails}/>
                        </div>
                        <div className="name-input-container">
                            <label className="label-heading" htmlFor="last-name">Last Name<span className="star-mark">*</span></label>
                            <input required className="input-element" id="last-name" type="text" placeholder="Enter Last Name" name="lastName" value={userData.lastName} onChange={this.onEditUserDetails}/>
                        </div>
                        <div className="email-input-container">
                            <label className="label-heading" htmlFor="email">Email<span className="star-mark">*</span></label>
                            <input required className="input-element" id="email" type="email" placeholder="Enter Email" name="email" value={userData.email} onChange={this.onEditUserDetails}/>
                        </div>
                        <div className="department-input-container">
                            <label className="label-heading" htmlFor="department">Department<span className="star-mark">*</span></label>
                            <input required className="input-element" id="department" type="text" placeholder="Enter Department" name="department" value={userData.department} onChange={this.onEditUserDetails}/>
                        </div>
                    </div>
                    <div className="actions">
                        <button
                            className="edit-confirm-button"
                            type="button"
                            // will update the user data to API with PUT method
                            onClick={this.onSaveEditedData}
                        >
                            Update Changes
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
    renderEditFailureView = () =>{
        const {failureMsg} = this.state
        return (
            <div className='form-failure-container'>
                <TbError404 className="failure-icon" />
                <p className='failure-para'>{failureMsg}</p>
                <button 
                    className='try-again-button' 
                    onClick={() => {
                        this.setState({ apiEditStatus: apiEditStatusConstants.initial });
                        this.props.onClose();
                    }}
                >
                    Please Try Again
                </button>
            </div>
        )
    }
    
    // used to display success msg on success updating data
    renderEditSuccessView = () =>{
        return(
            <>
                <div className='render-success-main-container'>
                    <SiTicktick className='success-tick-icon' />
                    <h1 className='success-heading'>Success</h1>
                    <p className='success-para'>User updated successfully.</p>
                    <button 
                        type="button" 
                        className='success-edit-ok-button'
                        // on clicking will close the pop-up 
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
    renderEditLoadingView = () => (
        <div className='form-loader-container'>
            <PulseLoader color="#ffbd2e" />
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

export default EditPopup