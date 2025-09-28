import { Component } from "react"
import Popup from "reactjs-popup"
import axios from 'axios'
import { PulseLoader } from "react-spinners"

import { TbError404 } from "react-icons/tb"
import { SiTicktick } from "react-icons/si"

import './index.css'

// API status constants to be used for loading, failure, success views
const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

// Add New User Form component using state (Child Component for UserManagement Component)
class AddUserForm extends Component{
    state = {
        apiStatus: apiStatusConstants.initial,
        userDetails: {
            firstName: '',
            lastName: '',
            email: '',
            department: ''
        }, // stores input values from form
        isPopupOpen: false,
        successData: '', // stores response after successfully adding a user
        failureMsg:'' // stores error msg if adding user fails
    }


    // prevents default behaviour on form submission and opens confirmation pop-up
    onSubmitNewUserForm = async (event) =>{
        event.preventDefault()
        this.setState({isPopupOpen:true})        
    }

    // resets the form fields to empty values
    onCancelChanges = () =>{
        this.setState({
            userDetails: {
            firstName: '',
            lastName: '',
            email: '',
            department: ''
        }
        })
    }

    // POSTs new user data and updates API status based on success or failure response
    postNewUser = async ()=>{
        this.setState({apiStatus:apiStatusConstants.inProgress}) // API status is set to progress so spinner/ loading is displayed till fetching data is complete
        const {userDetails} = this.state
        const url = 'https://jsonplaceholder.typicode.com/users'
        const params = {
            name: userDetails.firstName+" "+userDetails.lastName,
            email: userDetails.email,
            department: userDetails.department
        }
        
        // validates that user email doesn't already exist before sending request
        const userExists = this.props.userData.some(user=>
            user.email.toLowerCase() === userDetails.email.toLowerCase()
        )
        if (userExists){
            this.setState({failureMsg: "User with this email already exists!", apiStatus: apiStatusConstants.failure}) // renders failure with failure msg-> user already exists
            return
        }

        try{
            const response = await axios.post(url, params)
            console.log("response:", response.data)
            this.setState({successData: response.data, apiStatus:apiStatusConstants.success}) // for displaying success msg
        } catch (error) {
            console.log("Error:", error.message)
            this.setState({failureMsg: error.message, apiStatus:apiStatusConstants.failure}) // for displaying failure msg
        }
    }

    // updates the corresponding state userDetails key as user types in that particular field
    onEnterUserDetails = event =>{
        const {name,value} = event.target
        this.setState(prevState=>({userDetails:{...prevState.userDetails, [name]:value}}))
    }

    // Chooses which content to render based on API status
    renderPopupContent = ()=>{
        const {apiStatus}=this.state
        switch (apiStatus) {
            case apiStatusConstants.initial:
                return this.renderInitialView()
            case apiStatusConstants.inProgress:
                return this.renderLoadingView()
            case apiStatusConstants.failure:
                return this.renderFailureView()
            case apiStatusConstants.success:
                return this.renderSuccessView()
            default:
                return null
        }
    }

    // initially asks for confirmation by displaying the user entered details
    renderInitialView=()=>{
        const {userDetails}=this.state
        const {firstName, lastName, email, department} = userDetails
        return (
            <>
                <div className="header">Are you sure you want to add this data?</div>
                <div className="content">
                    <p className="add-confirmation-text">First Name: {firstName}</p>
                    <p className="add-confirmation-text">Last Name: {lastName}</p>
                    <p className="add-confirmation-text">Email: {email}</p>
                    <p className="add-confirmation-text">Department: {department}</p>
                </div>
                <div className="actions">
                    <button
                        className="add-confirm-button"
                        type="button"
                        // on clicking yes would triggers the function to post the user to the database/API
                        onClick={this.postNewUser}
                    >
                        Yes
                    </button>
                    <button
                        className="close-button"
                        type="button"
                        //on clicking no would close the pop-up, user entered details would still persist to make necessary edits/corrections
                        onClick={()=>this.setState({isPopupOpen:false})}
                    >
                        No
                    </button>
                </div>
            </>
        )
    }

    // used to display a spinner while fetching data (during a fetch request to the API)
    renderLoadingView = () => (
        <div className='form-loader-container'>
            <PulseLoader color="#28c840" />
        </div>
    )

    //used to display failure msg when failed fetching data
    renderFailureView = () =>{
        const {failureMsg} = this.state
        return (
            <div className='form-failure-container'>
                <TbError404 className="failure-icon" />
                <p className='failure-para'>{failureMsg}</p>
                <button 
                    className='try-again-button' 
                    onClick={()=>{
                        this.setState({isPopupOpen:false}) 
                        this.onCancelChanges()
                    }}
                >
                    Please Try Again
                </button>
            </div>
        )
    }

    // used to display success msg on success posting data
    renderSuccessView = () =>{
        const {successData}=this.state
        return(
            <>
                <div className='render-success-main-container'>
                    <SiTicktick className='success-tick-icon' />
                    <h1 className='success-heading'>Success</h1>
                    <p className='success-para'>User added successfully, new UserId is {successData.id}</p>
                    <button 
                        type="button" 
                        className='success-add-ok-button' 
                        onClick={()=>{
                            this.setState({isPopupOpen:false})
                            this.onCancelChanges()
                            this.props.onSuccessfulUserAdd() //onClicking ok will redirect to dashboard page
                        }}
                    >
                        OK
                    </button>
                </div>
            </>
        )
    }


    // initially form gets displayed with required input fields
    render(){
        const {userDetails, isPopupOpen}=this.state
        const {firstName, lastName, email, department} = userDetails
        return(
            <div className="add-new-user-main-container">
                <form className="add-new-user-main-container-form" onSubmit={this.onSubmitNewUserForm}>
                    {/* maintained common function for all the input fields to update the state */}
                    <div className="form-first-last-name-email-department-container">
                        <div className="name-input-container">
                            <label className="label-heading" htmlFor="first-name">First Name<span className="star-mark">*</span></label>
                            <input required className="input-element" id="first-name" type="text" placeholder="Enter First Name" name="firstName" value={firstName} onChange={this.onEnterUserDetails}/>
                        </div>
                        <div className="name-input-container">
                            <label className="label-heading" htmlFor="last-name">Last Name<span className="star-mark">*</span></label>
                            <input required className="input-element" id="last-name" type="text" placeholder="Enter Last Name" name="lastName" value={lastName} onChange={this.onEnterUserDetails}/>
                        </div>
                        <div className="email-input-container">
                            <label className="label-heading" htmlFor="email">Email<span className="star-mark">*</span></label>
                            <input required className="input-element" id="email" type="email" placeholder="Enter Email" name="email" value={email} onChange={this.onEnterUserDetails}/>
                        </div>
                        <div className="department-input-container">
                            <label className="label-heading" htmlFor="department">Department<span className="star-mark">*</span></label>
                            <input required className="input-element" id="department" type="text" placeholder="Enter Department" name="department" value={department} onChange={this.onEnterUserDetails}/>
                        </div>
                    </div>
                    <div className='submit-cancel-button-container'>
                        {/* button triggers the form submission, which then opens the confirmation pop-up separately by updating the state value */}
                        <button type="submit" className="save-user-button">Save User Data</button> 
                        
                        <Popup
                            open={isPopupOpen} // not implementing submit button directly because it bypasses validation on required input fields
                            onClose={()=>this.setState({isPopupOpen:false})}
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
                        {/* on clicking cancel would reset the input fields */}
                        <button type='button' className='cancel-button' onClick={this.onCancelChanges}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddUserForm