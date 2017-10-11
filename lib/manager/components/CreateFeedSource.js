// @flow

import memoize from 'lodash.memoize'
import React, {Component} from 'react'
import update from 'react-addons-update'
import {
  Button,
  Checkbox,
  Col,
  ControlLabel,
  FormControl,
  FormGroup,
  Grid,
  HelpBlock,
  ListGroup,
  ListGroupItem,
  Panel,
  Row
} from 'react-bootstrap'
import {isUri} from 'valid-url'

import ManagerPage from '../../common/components/ManagerPage'
import ProjectHeader from './ProjectHeader'

import type {Project, User} from '../../types'

type NewFeed = {
  autoFetchFeed: boolean,
  deployable: boolean,
  name: string,
  projectId: string,
  retrievalMethod?: string,
  url: string
}

type Props = {
  createFeedSource: NewFeed => void,
  fetchProject: (string) => void,
  project: Project,
  projectId: string,
  user: User
}

type Validation = {
  _form: boolean,
  name?: boolean,
  url?: boolean
}

type State = {
  model: NewFeed,
  validation: Validation
}

export default class CreateFeedSource extends Component {
  props: Props
  state: State

  componentWillMount () {
    const {fetchProject, project, projectId} = this.props
    if (!project) {
      fetchProject(projectId)
    } else {
      this._initializeState(this.props)
    }
  }

  componentWillReceiveProps (nextProps: Props) {
    this._initializeState(nextProps)
  }

  _initializeState (props: Props) {
    this.setState({
      model: {
        autoFetchFeed: false,
        deployable: false,
        name: '',
        projectId: props.projectId,
        url: ''
      },
      validation: {
        _form: false,
        name: true,
        url: true
      }
    })
  }

  _onInputChange = memoize(
    (fieldName: string) => (evt: Event & {target: HTMLInputElement}) => {
      const updatedState: State = update(this.state, {
        model: {[fieldName]: {$set: evt.target.value}}
      })
      this.setState(updatedState)
      this._validateModel(updatedState.model)
    }
  )

  _onSave = () => {
    const {model} = this.state
    if (model.url === '') {
      delete model.url
    }
    model.retrievalMethod = model.autoFetchFeed
      ? 'FETCHED_AUTOMATICALLY'
      : 'MANUALLY_UPLOADED'
    this.props.createFeedSource(model)
  }

  _toggleCheckBox = memoize((fieldName: string) => () => {
    this.setState(
      update(this.state, {
        model: {[fieldName]: {$set: !this.state.model[fieldName]}}
      })
    )
  })

  _validateModel (model: NewFeed) {
    const validation: Validation = {
      _form: false,
      name: !(!model.name || model.name.length === 0),
      url: model.url === '' || !!isUri(model.url)
    }
    validation._form = !!(validation.name && validation.url)
    this.setState({ validation })
  }

  render () {
    const {project, user} = this.props

    if (!project) {
      return (
        <Grid fluid>
          <Row>
            <Col xs={12}>
              <h4>Loading...</h4>
            </Col>
          </Row>
        </Grid>
      )
    }

    const {model, validation} = this.state
    return (
      <ManagerPage ref='page' title={project.name}>
        <Grid fluid>
          <ProjectHeader project={project} user={user} />
          <Row className='create-feed'>
            <Col xs={12}>
              <h3>Create New Feed</h3>
            </Col>
            <Col xs={12} sm={8}>
              <Panel header={<h3>Settings</h3>}>
                <ListGroup fill>
                  <ListGroupItem>
                    <FormGroup validationState={validationState(validation.name)}>
                      <ControlLabel>Feed source name</ControlLabel>
                      <FormControl
                        value={model.name}
                        name={'name'}
                        onChange={this._onInputChange('name')}
                      />
                      <FormControl.Feedback />
                      <HelpBlock>Required.</HelpBlock>
                    </FormGroup>
                  </ListGroupItem>
                  <ListGroupItem>
                    <FormGroup>
                      <Checkbox
                        checked={model.deployable}
                        onChange={this._toggleCheckBox('deployable')}
                      >
                        <strong>Make feed source deployable</strong>
                      </Checkbox>
                      <small>
                        Enable this feed source to be deployed to an
                        OpenTripPlanner (OTP) instance (defined in organization
                        settings) as part of a collection of feed sources or
                        individually.
                      </small>
                    </FormGroup>
                  </ListGroupItem>
                </ListGroup>
              </Panel>
              <Panel header={<h3>Automatic fetch</h3>}>
                <ListGroup fill>
                  <ListGroupItem>
                    <FormGroup validationState={validationState(validation.url)}>
                      <ControlLabel>Feed source fetch URL</ControlLabel>
                      <FormControl
                        value={model.url}
                        name={'url'}
                        onChange={this._onInputChange('url')}
                        />
                      <FormControl.Feedback />
                    </FormGroup>
                  </ListGroupItem>
                  <ListGroupItem>
                    <FormGroup>
                      <Checkbox
                        checked={model.autoFetchFeed}
                        onChange={this._toggleCheckBox('autoFetchFeed')}
                        bsStyle='danger'
                      >
                        <strong>Auto fetch feed source</strong>
                      </Checkbox>
                      <small>
                        Set this feed source to fetch automatically. (Feed
                        source URL must be specified and project auto fetch must
                        be enabled.)
                      </small>
                    </FormGroup>
                  </ListGroupItem>
                </ListGroup>
              </Panel>
            </Col>
          </Row>
          <Row>
            <Col xs={12}>
              <Button
                bsStyle='primary'
                disabled={!validation._form}
                onClick={this._onSave}
              >
                Save
              </Button>
            </Col>
          </Row>
        </Grid>
      </ManagerPage>
    )
  }
}

function validationState (val: ?boolean): ?string {
  return val ? undefined : 'error'
}