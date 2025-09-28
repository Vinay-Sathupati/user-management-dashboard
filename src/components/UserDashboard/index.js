import { Component } from 'react'
import axios from 'axios' //axios for fetching data

import { PulseLoader } from "react-spinners"

import './index.css'

import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFilter } from "react-icons/fa"
import { BsFilterRight } from "react-icons/bs"
import { IoSearchSharp } from "react-icons/io5"

import EditPopup from '../EditUser'
import DeletePopup from '../DeleteUser'


// API status constants to be used for loading, failure, success views
const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}

//options for filtering by category
const filterByOptions = [
    {id: "firstName", displayText: "First Name"},
    {id: "lastName", displayText: "Last Name"},
    {id: "email", displayText: "Email"},
    {id: "id", displayText: "ID"},
    {id: "department", displayText: "Department"}
]

// options for sorting
const sortByOptions = [
    {id: 'id_1_9', displayText: 'ID \u2193'},
    {id: 'id_9_1', displayText: 'ID \u2191'},
    {id: 'firstName_A_Z', displayText: 'First Name (A-Z \u2193)'},
    {id: 'firstName_Z_A', displayText: 'First Name (Z-A \u2191)'},
    {id: 'lastName_A_Z', displayText: 'Last Name (A-Z \u2193)'},
    {id: 'lastName_Z_A', displayText: 'Last Name (Z-A \u2191)'},
    {id: 'email_A_Z', displayText: 'Email (A-Z \u2193)'},
    {id: 'email_Z_A', displayText: 'Email (Z-A \u2191)'},
    {id: 'department_A_Z', displayText: 'Department (A-Z \u2193)'},
    {id: 'department_Z_A', displayText: 'Department (Z-A \u2191)'},
]

// Dashboard component using state (Child Component for UserManagement Component)
class UserDashboard extends Component{
    state={
        apiStatus: apiStatusConstants.initial,
        userListData:[], 
        filterby: filterByOptions[0].id,
        searchInput:'',
        sortby: sortByOptions[0].id,
        failureMsg:'', 
        editingRowUserId: null, //tracks which user row is currently being edited to open EditPopup
        editingRowUserData: null, //userData(object) of a particular row in a list to pass it to EditPopup component
        deletingRowUserId: null, //userID of a particular row in a list to pass it to DeletePopup component
        currentPage: 1, // for pagination
        usersPerPage: 5 // for pagination
    }

    // fetch users list on first render of the page
    componentDidMount(){
        this.getUsersList()
    }

    // function for first and last name display, removes any prefixes
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

    // fetches data and maps it to userListData
    getUsersList = async () =>{
        this.setState({apiStatus: apiStatusConstants.inProgress}) // API status is set to progress so spinner/ loading is displayed till fetching data is complete
        const url = 'https://jsonplaceholder.typicode.com/users'
        try {
            const response = await axios.get(url)
            console.log(response.data)
            const updatedData = response.data.map(eachObj=>({
                id: eachObj.id,
                firstName: this.nameCorrection(eachObj.name,"firstName"),
                lastName: this.nameCorrection(eachObj.name,"lastName"),
                email: eachObj.email,
                department: eachObj.company.name
            }))
            
            this.setState({userListData: updatedData, apiStatus:apiStatusConstants.success})
            this.props.updateUserListData(updatedData) //updating parent component user list data after successful fetch
        } catch (error) {
            console.log('Error:', error.message)
            this.setState({failureMsg: error.message, apiStatus:apiStatusConstants.failure})
        }
        
    }

    // event handler for filter dropdown
    onChangeFilterBy = event =>{
        this.setState({filterby: event.target.value})
    }

    // event handler for sort dropdown
    onChangeSortBy = event =>{
        this.setState({sortby: event.target.value})
    }

    // used to display a spinner while fetching data (during a fetch request to the API)
    renderLoadingView = () => (
        <div className='loader-container'>
            <PulseLoader color="#325ea8" />
        </div>
    )

    //used to display failure msg when failed fetching data
    renderFailureView = () =>{
        const {failureMsg} = this.state
        return (
            <div className='failure-container'>
                <img src="/images/something_went_wrong.jpg" alt="Something went wrong" />
                <h1 className='failure-heading'>Aaaah! Something went wrong</h1>
                <p className='failure-para'>{failureMsg}.</p>
                <button className='try-again-button' onClick={()=>{this.getUsersList()}}>Please Try Again</button>
            </div>
        )
    }

    // used to display successful UI with usersList and their details
    renderSuccessView = () =>{
        const {userListData, filterby, sortby, editingRowUserId, deletingRowUserId, searchInput, currentPage, usersPerPage} = this.state
                
        // filters the list globally from the complete usersList
        let filterData = userListData.filter(user=>{
            const fieldData = user[filterby].toString().toLowerCase()
            return fieldData.includes(searchInput.toLowerCase())
        })

        let numberOfPages = [] // Array - number of pages for pagination
        const totalPages = Math.ceil(filterData.length/usersPerPage) //recalculates number of pages on every filtering
        for (let i=1;i<=totalPages ; i++){ // iterating and pushing numbers to be displayed based on length of users list
            numberOfPages.push(i)
        }

        const indexOfLastUser = currentPage * usersPerPage // introducing last index to slice the users list for pagination
        const indexOfFirstUser = indexOfLastUser - usersPerPage // introducing first index to slice the users list for pagination
        const currentPageUsers = filterData.slice(indexOfFirstUser, indexOfLastUser) // slicing the usersList for pagination and display only the currentpage list (5 users per page are being displayed)

        // sorts the list only from the current page that is being displayed
        let sortedData = [...currentPageUsers];
            switch (sortby) {
            case "firstName_A_Z":
                sortedData.sort((a,b)=> a.firstName.localeCompare(b.firstName));
                break;
            case "lastName_A_Z":
                sortedData.sort((a,b)=> a.lastName.localeCompare(b.lastName));
                break;
            case "firstName_Z_A":
                sortedData.sort((a,b)=> b.firstName.localeCompare(a.firstName));
                break;
            case "lastName_Z_A":
                sortedData.sort((a,b)=> b.lastName.localeCompare(a.lastName));
                break;
            case "id_1_9":
                sortedData.sort((a,b)=> a.id - b.id);
                break;
            case "id_9_1":
                sortedData.sort((a,b)=> b.id - a.id);
                break;
            case "email_A_Z":
                sortedData.sort((a,b)=> a.email.localeCompare(b.email));
                break;
            case "email_Z_A":
                sortedData.sort((a,b)=> b.email.localeCompare(a.email));
                break;
            case "department_A_Z":
                sortedData.sort((a,b)=> a.department.localeCompare(b.department));
                break;
            case "department_Z_A":
                sortedData.sort((a,b)=> b.department.localeCompare(a.department));
                break;
            default:
                break;
        }


        
        return (
             <>
                <div className='filter-search-sort-container'>
                    <div className='filter-by-container'>
                        <FaFilter className='filter-by-icon' />
                        <h1 className='filter-by-heading'>FilterBy</h1>
                        <select className='filter-by-select-element' value={filterby} onChange={this.onChangeFilterBy}>
                        {filterByOptions.map(eachObj=>(
                            <option key={eachObj.id} value={eachObj.id}>{eachObj.displayText}</option>
                        ))} 
                        </select>
                    </div>
                    <div className='search-container'>
                        <input 
                            type="search" 
                            id='user-search-input'
                            className='seach-input-element'
                            // updates placeholder based on the filterby dropdown selected  
                            placeholder= {`Search users by ${filterByOptions.find(eachObj=> eachObj.id===filterby).displayText}...`}
                            value={searchInput}
                            onChange={event=>this.setState({searchInput:event.target.value, currentPage: 1})}
                        />
                        <button type='button' className='search-icon-button' onClick={()=>{document.getElementById("user-search-input").focus()}}> {/* when clicked on icon focuses search input element */}
                            <IoSearchSharp  className='search-icon' />
                        </button>
                    </div>
                    <div className='sort-by-container'>
                        <BsFilterRight className='sort-by-icon' />
                        <h1 className='sort-by-heading'>SortBy</h1>
                        <select className='sort-by-select-element' value={sortby} onChange={this.onChangeSortBy}>
                            {sortByOptions.map(eachOption =>(
                                <option 
                                    key={eachOption.id} 
                                    value={eachOption.id}
                                    className='select-option'
                                >
                                    {eachOption.displayText}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='users-list-display-main-container'>
                    <table className='users-list-table'>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Email</th>
                                <th>Department</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* renders each user with edit and delete options */}
                            {sortedData.map(eachObj=>(
                                <tr key={eachObj.id}>
                                    <td>{eachObj.id}</td>
                                    <td>{eachObj.firstName}</td>
                                    <td>{eachObj.lastName}</td>
                                    <td>{eachObj.email}</td>
                                    <td>{eachObj.department}</td>
                                    <td>
                                        <div className='delete-view-button-container'>
                                            <button type='button' className='edit-button' onClick={()=>this.setState({editingRowUserId: eachObj.id})}>Edit</button>
                                            {editingRowUserId === eachObj.id && 
                                                <EditPopup
                                                    userData={eachObj}
                                                    onClose={() => this.setState({ editingRowUserId: null })}                                                        
                                                />
                                            }
                                            
                                            <div className='delete-button-container'>
                                                <button type='button' className='delete-button' onClick={()=>this.setState({deletingRowUserId: eachObj.id})}>Delete</button>
                                            </div>
                                            {deletingRowUserId === eachObj.id && 
                                                <DeletePopup
                                                    userData={eachObj}
                                                    onClose={() => this.setState({ deletingRowUserId: null })} 
                                                />}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr className='paginate-horizontal-line'/>
                    <div className='pagination-number-buttons'> 
                        <button 
                            type='button' 
                            className='pagination-button'
                            // previous button -> to move to previous page, prevents going below page 1
                            onClick={()=>{this.setState(prevState=>({currentPage: Math.max(prevState.currentPage -1,1)}))}}
                        >
                            <IoIosArrowBack className='arrow-icon' />
                        </button>
                        {numberOfPages.map((eachNum,index)=>(
                            <button key={index} type='button' className={`pagination-button ${currentPage === eachNum ? 'active-pagination-btn' : ''}`} onClick={()=>this.setState({currentPage: eachNum})}>{eachNum}</button>
                        ))}
                        <button 
                            type='button' 
                            className='pagination-button' 
                            // next button -> to move to next page, prevents going beyond last page
                            onClick={()=>{this.setState(prevState=>({currentPage: Math.min(prevState.currentPage + 1, totalPages)}))}}
                        >
                            <IoIosArrowForward className='arrow-icon' />
                        </button>
                    </div>
                </div>
            </>
        )
    }

    render() {
        const {apiStatus}=this.state
        
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
}

export default UserDashboard