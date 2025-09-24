import { Component } from "react"
import Popup from "reactjs-popup"
import axios from 'axios'
import { PulseLoader } from "react-spinners"

import { TbError404 } from "react-icons/tb"
import { SiTicktick } from "react-icons/si"

import './index.css'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

class AddUserForm extends Component{
    state = {
        apiStatus: apiStatusConstants.initial,
        userDetails: {
            firstName: '',
            lastName: '',
            email: '',
            department: ''
        },
        isPopupOpen: false,
        successData: '',
        failureMsg:''
    }

    onSubmitNewUserForm = async (event) =>{
        event.preventDefault()
        this.setState({isPopupOpen:true})        
    }

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

    postNewUser = async ()=>{
        this.setState({apiStatus:apiStatusConstants.inProgress})
        const {userDetails} = this.state
        const url = 'https://jsonplaceholder.typicode.com/users'
        const params = {
            name: userDetails.firstName+" "+userDetails.lastName,
            email: userDetails.email,
            department: userDetails.department
        }
        
        const userExists = this.props.userData.some(user=>
            user.email.toLowerCase() === userDetails.email.toLowerCase()
        )
        if (userExists){
            this.setState({failureMsg: "User with this email already exists!", apiStatus: apiStatusConstants.failure})
            return
        }

        try{
            const response = await axios.post(url, params)
            console.log("response:", response.data)
            this.setState({successData: response.data, apiStatus:apiStatusConstants.success})
        } catch (error) {
            console.log("Error:", error.message)
            this.setState({failureMsg: error.message, apiStatus:apiStatusConstants.failure})
        }
    }

    onEnterUserDetails = event =>{
        const {name,value} = event.target
        this.setState(prevState=>({userDetails:{...prevState.userDetails, [name]:value}}))
    }

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
                        onClick={this.postNewUser}
                    >
                        Yes
                    </button>
                    <button
                        className="close-button"
                        type="button"
                        onClick={()=>this.setState({isPopupOpen:false})}
                    >
                        No
                    </button>
                </div>
            </>
        )
    }

    renderLoadingView = () => (
        <div className='form-loader-container'>
            <PulseLoader color="#28c840" />
        </div>
    )

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
                            this.props.onSuccessfulUserAdd()
                        }}
                    >
                        OK
                    </button>
                </div>
            </>
        )
    }

    render(){
        const {userDetails, isPopupOpen}=this.state
        const {firstName, lastName, email, department} = userDetails
        return(
            <div className="add-new-user-main-container">
                <form className="add-new-user-main-container-form" onSubmit={this.onSubmitNewUserForm}>
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
                        <button type="submit" className="save-user-button">Save User Data</button>
                        <Popup
                            open={isPopupOpen}
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
                        <button type='button' className='cancel-button' onClick={this.onCancelChanges}>Cancel</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default AddUserForm