import React from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import Helmet from 'react-helmet'

import ManagerNavbar from '../containers/ManagerNavbar'
import CurrentStatusMessage from '../containers/CurrentStatusMessage'
import CurrentStatusModal from '../containers/CurrentStatusModal'
import ConfirmModal from './ConfirmModal.js'
import SelectFileModal from './SelectFileModal.js'
import InfoModal from './InfoModal.js'
import ManagerSidebar from '../containers/ManagerSidebar'

export default class ManagerPage extends React.Component {

  constructor (props) {
    super(props)
  }

  showInfoModal (props) {
    this.refs.infoModal.open(props)
  }

  showConfirmModal (props) {
    this.refs.confirmModal.open(props)
  }

  showSelectFileModal (props) {
    this.refs.selectFileModal.open(props)
  }

  render () {
    return (
      <div>
        <Helmet
          defaultTitle={DT_CONFIG.application.title}
          titleTemplate={`${DT_CONFIG.application.title} - %s`}
        />
        <ManagerSidebar />
        {/*<ManagerNavbar noMargin={this.props.noMargin}/>*/}
        <div style={{ paddingTop: 20, paddingLeft: 50 }}>
          {this.props.children}
        </div>
        <CurrentStatusMessage />
        <ConfirmModal ref='confirmModal'/>
        <InfoModal ref='infoModal'/>
        <SelectFileModal ref='selectFileModal'/>
        <CurrentStatusModal ref='statusModal'/>
      </div>
    )
  }
}
