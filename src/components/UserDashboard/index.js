import { Component } from 'react'
import axios from 'axios'

import { PulseLoader } from "react-spinners"

import './index.css'

import { FaFilter } from "react-icons/fa"
import { BsFilterRight } from "react-icons/bs"
import { IoSearchSharp } from "react-icons/io5"



import EditPopup from '../EditUser'
import DeletePopup from '../DeleteUser'

const apiStatusConstants = {
    initial: 'INITIAL',
    inProgress: 'IN_PROGRESS',
    success: 'SUCCESS',
    failure: 'FAILURE',
}


const filterByOptions = [
    {id: "firstName", displayText: "First Name"},
    {id: "lastName", displayText: "Last Name"},
    {id: "email", displayText: "Email"},
    {id: "id", displayText: "ID"},
    {id: "department", displayText: "Department"}
]

export const sortByOptions = [
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

class UserDashboard extends Component{
    state={
        apiStatus: apiStatusConstants.initial, 
        userListData:[], 
        filterby: filterByOptions[0].id,
        searchInput:'',
        sortby: sortByOptions[0].id,
        failureMsg:'',
        editingRowUserId: null,
        editingRowUserData: null,
        deletingRowUserId: null
    }

    componentDidMount(){
        this.getUsersList()
    }

    // function for correct name display:
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


    getUsersList = async () =>{
        this.setState({apiStatus: apiStatusConstants.inProgress})
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
            this.props.updateUserListData(updatedData)
        } catch (error) {
            console.log('Error:', error.message)
            this.setState({failureMsg: error.message, apiStatus:apiStatusConstants.failure})
        }
        
    }

    onChangeFilterBy = event =>{
        this.setState({filterby: event.target.value})
    }

    onChangeSortBy = event =>{
        this.setState({sortby: event.target.value})
    }

    
    renderLoadingView = () => (
        <div className='loader-container'>
            <PulseLoader color="#325ea8" />
        </div>
    )

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

    renderSuccessView = () =>{
        const {userListData, filterby, sortby, editingRowUserId, deletingRowUserId, searchInput} = this.state
        let filterData = userListData.filter(user=>{
            const fieldData = user[filterby].toString().toLowerCase()
            return fieldData.includes(searchInput.toLowerCase())
        })

        let sortedData = [...filterData];
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
                sortedData.sort((a,b)=> a.email.localeCompare(b.email));
                break;
            case "department_A_Z":
                sortedData.sort((a,b)=> a.department.localeCompare(b.department));
                break;
            case "department_Z_A":
                sortedData.sort((a,b)=> a.department.localeCompare(b.department));
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
                            className='seach-input-element' 
                            placeholder= {`Search users by ${filterByOptions.find(eachObj=> eachObj.id===filterby).displayText}...`}
                            value={searchInput}
                            onChange={event=>this.setState({searchInput:event.target.value})}
                        />
                        <button type='button' className='search-icon-button'>
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