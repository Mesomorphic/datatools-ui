import React from 'react'
import { connect } from 'react-redux'

import Sidebar from '../components/Sidebar'
import { login, logout, resetPassword } from '../../manager/actions/user'
import { setActiveProject } from '../../manager/actions/projects'
import { setActiveLanguage } from '../../manager/actions/languages'
import { setJobMonitorVisible } from '../../manager/actions/status'

const mapStateToProps = (state, ownProps) => {
  return {
    username: state.user.profile ? state.user.profile.email : null,
    userIsAdmin: state.user.profile && state.user.permissions.isApplicationAdmin(),
    projects: state.projects ? state.projects : null,
    languages: state.languages ? state.languages : ['English', 'Español', 'Français'],
    jobMonitor: state.status.jobMonitor
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    loginHandler: () => { dispatch(login()) },
    logoutHandler: () => { dispatch(logout()) },
    resetPasswordHandler: () => { dispatch(resetPassword()) },
    setActiveProject: (project) => { dispatch(setActiveProject(project)) },
    setActiveLanguage: (language) => { dispatch(setActiveLanguage(language)) },
    setJobMonitorVisible: (visible) => { dispatch(setJobMonitorVisible(visible)) }
  }
}

var ManagerSidebar = connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar)

export default ManagerSidebar
