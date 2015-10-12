import _ from 'underscore';
import React from 'react';
import ReactDOM from 'react-dom';
import {connect} from 'react-redux';
import classNames from 'classnames';

import {createFile, deleteFile, 
        renameFile, openFile} from 'actions/files';
import {buildPermalink} from 'helpers';

class FileRenameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      path: props.path
    };
  }

  componentDidMount() {
    ReactDOM.findDOMNode(this.refs.fileName).select();
  }

  onSubmit(event) {
    event.preventDefault();
    this.props.onRename(this.state.path);
  }

  handleChange(event) {
    this.setState({
      path: event.target.value
    });
  }

  render() {
    const block = this.props.block + "__rename-form";
    return (
      <form className={block} onSubmit={this.onSubmit.bind(this)}>
        <input
          className={block + "__input"}
          value={this.state.path}
          ref="fileName"
          onChange={this.handleChange.bind(this)} />
      </form>
    );
  }
}

class FileItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      rename: props.rename
    };
  }

  buildPermalink(path) {
    const {files} = this.props,
          source = files[path];

    return buildPermalink({path, source});
  }
  
  handleFileRename(event) {
    const {files, dispatch} = this.props;
    this.setState({rename: true});
    event.preventDefault();
  }

  handleClick(event) {
    const {path} = this.props;
    this.props.onOpenFile(path);
    event.preventDefault();
  }

  renameFile(newPath) {
    const {dispatch} = this.props;
    dispatch(renameFile(this.props.path, newPath));
    dispatch(openFile(newPath));
    this.setState({rename: false});
  }

  handleRemove() {
    const {path, dispatch, files} = this.props;
    dispatch(deleteFile(path));
  }

  render() {
    const {path, current, block} = this.props;
    const isCurrent = path == current;
    return (
      <li className={classNames({
        [block + "__item"]: true,
        [block + "__item--current"]: isCurrent
      })}>
        {isCurrent && (
          <a className={block + "__permalink"}
             href={this.buildPermalink(path)}
             target="_blank">permalink</a>
        )}
        <a href="#"
           target="_blank" 
           className={block + "__file-name"}
           onDoubleClick={this.handleFileRename.bind(this)}
           onClick={this.handleClick.bind(this)}>
          {this.state.rename?
            <FileRenameForm 
                block={block}
                path={path}
                onRename={this.renameFile.bind(this)} />: path}
        </a>
        {isCurrent && !this.state.rename && (
          <button
              onClick={this.handleRemove.bind(this)}
              className={block + "__remove-button"}>
            {String.fromCharCode(10799)}
          </button>
        )}
      </li>
    );
  }
}

class FileList extends React.Component {
  constructor() {
    super();
    this.state = {
      renamingPath: null
    };
  }

  handleNewFileButtonClick(event) {
    const {files, dispatch} = this.props;
    const fileName = 'module.py';
    dispatch(createFile(fileName))
    this.setState({renamingPath: fileName});
    event.preventDefault();
  }

  render() {
    const {files, current, dispatch} = this.props;
    const block = "file-list";
    return (
      <ul className={block}>
        {_.keys(files).map(
          (path) => <FileItem
                      key={path}
                      block={block}
                      path={path}
                      rename={this.state.renamingPath === path} 
                      {...this.props} />
        )}
        <li className={classNames(block + "__item", 
                                  block + "__item--new")}>
          <a onClick={this.handleNewFileButtonClick.bind(this)}
             href="#" >+</a>
        </li>
      </ul>
    );
  }

}

function select(state) {
  return {
    files: state.files
  };
}

export default connect(select)(FileList);