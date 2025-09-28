import { Component } from 'react'

import './index.css'

import Banner from '../Banner'
import UserDashboard from '../UserDashboard'
import AddUserForm from '../AddUserForm'
import ViewUser from '../ViewUser'

// tab buttons -> to switch between dashboard, creating new user and viewing existing user
const tabsList = [
    {tabId: 'HOME', displayText: 'Dashboard'},
    {tabId: 'FORM', displayText: 'Add New User'},
    {tabId: 'VIEW', displayText: 'View Existing User'}
]

// UserManagement Component using state (Main or Parent Component / Home Page)
class UserManagement extends Component{
    state={activeTabId: tabsList[0].tabId, userData:[]}

    // updates activeTabId to switch between Dashboard, Add User Form, and View User tab
    onChangeTab = tabId => {
        this.setState({activeTabId: tabId})
    }

    // called after successfully creating and adding new user to the usersList from Add New User Form, switches the tab back to dashboard
    onSuccessfulUserAdd = () =>{
        this.setState({activeTabId: tabsList[0].tabId})
    }


    // updates the userlist data with newly added user information
    updateUserListData = data =>{
        this.setState({userData: data})
    }

    // Renders the component based on active tab
    renderActiveContent = ()=>{
        const {activeTabId,userData}=this.state
        switch (activeTabId){
            case tabsList[0].tabId:
                return <UserDashboard updateUserListData={this.updateUserListData} />
            case tabsList[1].tabId:
                // passing the userData list to check if user already exists before posting it to the API/database
                return <AddUserForm userData={userData} onSuccessfulUserAdd={this.onSuccessfulUserAdd}/>
            case tabsList[2].tabId:
                return <ViewUser />
            default:
                return null
        }
    }

    render(){
        const {activeTabId} = this.state
        return(
            <>
                <Banner />
                <div className='user-list-main-container'>
                    <div className='top-section-container'>  
                        <ul className='unordered-list-tabs'>
                            {tabsList.map(eachTab => (
                            <li key={eachTab.tabId} className="tabs-list">
                                <button
                                    type="button"
                                    // highlights active tab
                                    className={`tab-btn ${activeTabId === eachTab.tabId ? 'active-tab-btn' : ''}`}
                                    onClick={()=>this.onChangeTab(eachTab.tabId)}
                                >
                                    {eachTab.displayText}
                                </button>
                            </li>
                            ))}
                        </ul>
                    </div>
                    <hr className='horizontal-line'/>
                    {this.renderActiveContent()}
                </div>
            </>
        )
    }
}

export default UserManagement