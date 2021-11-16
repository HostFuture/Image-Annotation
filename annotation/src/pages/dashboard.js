import React from 'react';
import { authFetch } from '../components/auth';
import Header from '../components/header';
import { toast } from 'react-toastify';
import { ReactPictureAnnotation } from "react-picture-annotation";
import Dropdown from "../components/dropdown";


toast.configure();
const images = require.context('../user_data', true);


class Dashboard extends React.Component {
  constructor(props){
    super(props);
    this.state = {project_count: 0, project_name: '', project_files: 0, max_files: 10, new_project: '', listOfImages: [], project_dir:'', file_names: [], annotation: '', annotation_flag: false, annotationData: [], annotation_image: '', export_flag: false}

    this.handleUpload = this.handleUpload.bind(this);
    this.actionFocus = this.actionFocus.bind(this);
    this.actionBlur = this.actionBlur.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);
    this.initalFetch = this.initalFetch.bind(this);
    this.importAll = this.importAll.bind(this);
    this.mapImage = this.mapImage.bind(this);
    this.handleAnnotation = this.handleAnnotation.bind(this); 
    this.annoChange = this.annoChange.bind(this);
    this.annoSelect = this.annoSelect.bind(this);
    this.resetAnno = this.resetAnno.bind(this);
    this.submitAnno = this.submitAnno.bind(this);
    this.downloadCSV = this.downloadCSV.bind(this);
  }
  componentDidMount() {
    this.initalFetch();
  }
  initalFetch() {
    authFetch('/user/me'
    ).then(r => r.json()
    ).then(ret => {
      var files = []
      for(var i in ret.file_names)
        files.push([i, ret.file_names[i]]);
      
      this.setState({project_count: ret.project, project_name: ret.project_name, project_files: ret.project_files, file_names: files, project_dir: ret.project_dir});
      
      if(ret.project_files > 0) {
        this.mapImage(); 
      }
    })
  }
  handleUpload() {
    var files = document.getElementById('project_file').files;
    var allowed_files = (this.state.max_files - this.state.project_files)
    if(files.length > allowed_files) {
      toast.error("You are only allowed to upload " + allowed_files + " files but found " + files.length, {position: "top-left"});
      document.getElementById('upload-form').reset();
    } else if(files.length === 0) {
      toast.error("Atleast one file to be selected before uploading", {position: "top-left"})
      document.getElementById('upload-form').reset();
    } else {
      var formData = new FormData();
      for (var index = 0; index < files.length; index++) {
        formData.append("files[]", files[index]);
      }

      authFetch('/project/upload', {
        method: 'POST',
        body: formData
      }).then(r => r.json()
      ).then(ret => {
        if(ret.status === 200) {
          toast.success(ret.msg, {position: 'top-left'});
          this.initalFetch();
        } else {
          toast.error(ret.msg, {position: 'top-left'});
        }
      });
      document.getElementById('upload-form').reset();
    }
  }
  actionFocus(e) {
    var ele = document.getElementById(e.target.ariaLabel);
    ele.classList.add('is-focused');
  }
  actionBlur(e) {
    var ele = document.getElementById(e.target.ariaLabel);
    if (e.target.value === '') {
      ele.classList.remove('is-focused');
    }
  }
  handleChange(e) { this.setState({new_project:e.target.value}) }
  handleCreate() {
    if(this.state.new_project === '') {
      toast.error("Please enter a valid project name", {position: "top-left"});
    } else {
      authFetch('/project/create/' + this.state.new_project, {
        method: 'PUT'
      }).then(r => r.json()
      ).then(ret => {
        if(ret.status === 200) {
          toast.success(ret.msg, {position: "top-left"});
          this.initalFetch();
          this.setState({new_project: ''});
        } else {
          toast.error(ret.msg, {position: "top-left"});
        }
      })
    }
  }
  importAll(r) { return r.keys().map(r) }
  handleAnnotation(e) {
    authFetch('/project/image/'+ this.state.file_names[e.target.ariaLabel][1] +'/details'
    ).then(r => r.json()
    ).then(ret => {
      if(ret.status === 200) {
        toast.success(ret.msg, {position: 'top-left'});
        if(ret.annotations.length > 0) {
          this.setState({export_flag:true, annotationData:ret.annotations});
        }
      } else {
        toast.error(ret.msg, {position: 'top-left'});
      }
    });
    this.setState({
      annotation: this.state.project_dir + "/" + this.state.file_names[e.target.ariaLabel][1],
      annotation_image: this.state.file_names[e.target.ariaLabel][1],
      annotation_flag: true
    });
  }
  annoChange(e) { this.setState({annotationData: e}) }
  annoSelect(e) {}
  mapImage() {
    this.setState({
      listOfImages: this.state.file_names.map((d, i) => { return(
        <div className="col-xl-3 col-md-6 mb-xl-6" key={i} >
          <div className="card card-blog card-plain">
            <div className="card-header p-0 mt-n4 mx-3">
              <span className="d-block shadow-xl border-radius-xl" style={{cursor:"pointer"}}>
                <img src={images(`./${this.state.project_dir + "/" + d[1]}`).default} alt="img-blur-shadow" className="img-fluid shadow border-radius-lg" aria-label={d[0]} onClick={ this.handleAnnotation }/>
              </span>
            </div>
          </div>
        </div>
      )})
    })
  }
  resetAnno() {
    this.setState({
      annotation: '',
      annotation_flag: false,
      annotationData: [],
      annotation_image: '',
      export_flag: false
    });
  }
  submitAnno() {
    if (this.state.annotationData.length > 0) {
      authFetch('/project/image/update', {
        method: 'POST',
        body: JSON.stringify( {'image_name':this.state.annotation_image, annotation_data:JSON.stringify(this.state.annotationData)} )
      }).then(r => r.json()
      ).then(ret => {
        if(ret.status === 200) {
          toast.success(ret.msg, {position: 'top-left'});
          this.resetAnno();
        } else {
          toast.error(ret.msg, {position: 'top-left'});
        }
      })
    }
  }
  downloadCSV() {
    authFetch('/project/image/' + this.state.annotation_image + '/download'
    ).then(r => r.json()
    ).then(ret => {
      if(ret.status === 200) {
        toast.success(ret.msg, {position: 'top-left'});
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(ret.content);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'Annotations.csv';  
        hiddenElement.click();  
      } else {
        toast.error(ret.msg, {position: 'top-left'});
      }
    });
  }
  render() {
    return(
      <>
        <Header />

        <div className="container-fluid px-2 px-md-4">
          <div className="page-header min-height-300 border-radius-xl mt-4 bg-home-image" >
            <span className="mask  bg-gradient-primary  opacity-6"></span>
          </div>

          <div className="card card-body mx-3 mx-md-4 mt-n6 mb-4">

            { this.state.project_count === 0 &&
                <div className="col-12 mt-4">
                  <div className="mb-5 ps-3">
                    <h1 className="mb-3">Create Projects</h1>
                    <form>
                      <div className="row">
                        <div className="input-group input-group-outline mb-3 w-30 h-25" id='project-name'>
                          <label className="form-label">Project Name</label>
                          <input type="text" className="form-control" aria-label='project-name' 
                            onFocus={ this.actionFocus } onBlur={ this.actionBlur } 
                            value={ this.state.new_project } onChange={ this.handleChange } />
                        </div>
                        <button className="btn bg-gradient-primary w-15 h-25" type="button" onClick={ this.handleCreate }>Add a project</button>
                      </div>
                    </form>
                  </div>
                </div>
            }
            {
              this.state.project_count !== 0 &&
                <div className="col-12 mt-4">
                  <div className="mb-5 ps-3">
                    <h1 className="mb-5">Projects</h1>
                    <h3>{"> "} { this.state.project_name }</h3>
                    <p className="mb-3 text-sm">There are { this.state.project_files } out of 10 images have been uploaded.</p>
                    { this.state.project_files < this.state.max_files && 
                      <form id='upload-form'>
                        <label className="form-label pb-0">Upload Images</label><br />
                        <input type="file" id="project_file" accept="image/*" multiple />
                        <button className="btn bg-gradient-primary w-15" type="button" onClick={ this.handleUpload }>Upload</button>
                      </form>
                    }
                  </div>

                </div>
            }

            { !this.state.annotation_flag &&
              <div className="row">
                { this.state.listOfImages }
              </div>
            }

            {
              this.state.annotation_flag &&
              <div className="offset-2">
                <div className="row" style={{height:"600px"}}>

                  <ReactPictureAnnotation 
                    inputElement={(value, onChange, onDelete) => (
                      <Dropdown
                        value={value}
                        onChange={onChange}
                        onDelete={onDelete}
                      />
                    )}
                    image={images(`./${ this.state.annotation }`).default}
                    width={800}
                    height={600}
                    onChange={ this.annoChange }
                    onSelect={ this.annoSelect }
                    annotationData = { this.state.annotationData }
                  />

                </div>
                <div className="row mt-5">
                  <button className="btn bg-gradient-dark w-15 me-3" type="button" onClick={ this.resetAnno }>Reset</button>
                  <button className="btn bg-gradient-primary w-15 me-3" type="button" onClick={ this.submitAnno }>Submit</button>
                  {
                    this.state.export_flag &&
                    <button className="btn bg-gradient-info w-15" type="button" onClick={ this.downloadCSV }>Download CSV</button>
                  }
                </div>
              </div>
            }

          </div>

        </div>
      </>
    );
  }
}


export default Dashboard;