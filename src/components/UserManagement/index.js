import { Component } from 'react'

import './index.css'

import Banner from '../Banner'
import UserDashboard from '../UserDashboard'
import AddUserForm from '../AddUserForm'
import ViewUser from '../ViewUser'

const tabsList = [
    {tabId: 'HOME', displayText: 'Dashboard'},
    {tabId: 'FORM', displayText: 'Add New User'},
    {tabId: 'VIEW', displayText: 'View Existing User'}
]

class UserManagement extends Component{
    state={activeTabId: tabsList[0].tabId, userData:[]}

    onChangeTab = tabId => {
        this.setState({activeTabId: tabId})
    }

    onSuccessfulUserAdd = () =>{
        this.setState({activeTabId: tabsList[0].tabId})
    }

    updateUserListData = data =>{
        this.setState({userData: data})
    }


    renderActiveContent = ()=>{
        const {activeTabId,userData}=this.state
        switch (activeTabId){
            case tabsList[0].tabId:
                return <UserDashboard updateUserListData={this.updateUserListData} />
            case tabsList[1].tabId:
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