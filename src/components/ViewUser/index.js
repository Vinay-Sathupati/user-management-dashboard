import { Component } from "react";
import axios from "axios";
import { PulseLoader } from "react-spinners"
import './index.css'

// API status constants to be used for loading, failure, success views
const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

// view user component using state (Child Component for UserManagement Component)
class ViewUser extends Component {
    state={apiStatus: apiStatusConstants.initial, userId: '', userData:{}, failureMsg:''}

    // updates state when user types user ID in input field
    onEnterUserId = event =>{
        this.setState({userId:event.target.value})
    }

    // function for correct name display by removing prefixes
    nameCorrection = (name, firstOrLast) =>{
        const prefixes = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."]
        const nameArr = name.split(" ")

        if (firstOrLast==="firstName"){
            if (prefixes.includes(nameArr[0])) {
                return nameArr[1]
            }
            return nameArr[0]
        }
        
        if(prefixes.includes(nameArr[0])){
            return nameArr.slice(2).join(" ")
        }
        return nameArr.slice(1).join(" ")

    }

    // gets triggered after clicking find user button
    // fetches details of specific user based on id
    getUserDetails = async (id)=>{
        const url =(`https://jsonplaceholder.typicode.com/users/${id}`)

        try {
            this.setState({apiStatus:apiStatusConstants.inProgress})
            const response = await axios.get(url)
            console.log(response)
            const updatedData = {
                id: response.data.id,
                firstName: this.nameCorrection(response.data.name,"firstName"),
                lastName: this.nameCorrection(response.data.name,"lastName"),
                email: response.data.email,
                department: response.data.company.name
            }
            this.setState({userData: updatedData, apiStatus:apiStatusConstants.success})
        } catch (error) {
            console.log('Error:', error.message)
            this.setState({apiStatus:apiStatusConstants.failure, failureMsg: error.message})
        }
    }
    // prevents default behaviour on form submission
    onSubmitForm = event =>{
        event.preventDefault()
        const {userId}=this.state
        this.getUserDetails(userId)
    }

    // Chooses which content to render based on API status
    renderSpecificUser = () =>{
        const {apiStatus} = this.state

        switch (apiStatus) {
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

    // used to display a spinner while fetching data (during a fetch request to the API)
    renderLoadingView = () => (
        <div className='view-loader-container'>
            <PulseLoader color="#fc7f12" />
        </div>
    )

    // displays user information after successful fetch
    renderSuccessView = () =>{
        const {userData}=this.state
        const {id, firstName,lastName,email,department}=userData
        return(
            <div className='user-data-container'>
                <div className='view-user-info-container'>
                    <div>
                        <h1 className='user-name'>{firstName}{" "}{lastName}</h1>
                        <p className='user-email-title'><span className='sub-title'>Email:</span> {email}</p>
                        <p className='user-id-title'><span className='sub-title'>Customer ID:</span> {id}</p>
                        <p className='user-department-title'><span className='sub-title'>Department:</span> {department}</p>
                    </div>
                </div>
            </div>
        )
    }

    //displays failure msg when failed fetching data
    renderFailureView = () =>{
        const {userId, failureMsg} = this.state
        return (
            <div className='failure-container'>
                <img src="/images/something_went_wrong.jpg" alt="Something went wrong" />
                <h1 className='failure-heading'>Aaaah! Something went wrong</h1>
                <p className='failure-para'>{failureMsg}.</p>
                <button className='try-again-button' onClick={()=>{this.getUserDetails(userId)}}>Please Try Again</button>
            </div>
        )
    }

    render () {
        const {userId}= this.state
        
        return(
             <form className="view-user-main-container-form" onSubmit={this.onSubmitForm}>
                <h1>View Customer Information</h1>
                <hr className='horizontal-line'/>
                <div className="userid-input-container">
                    <label className="view-label-heading" htmlFor="user-id">User ID<span className="star-mark">*</span></label>
                    <input required className="view-input-element" id="user-id" type="text" placeholder="Enter User ID" name="userId" value={userId} onChange={this.onEnterUserId}/>
                    <button type='submit' className='find-button'>Find User</button>
                </div>
                {this.renderSpecificUser()}
             </form>
        )
    }
}

export default ViewUser