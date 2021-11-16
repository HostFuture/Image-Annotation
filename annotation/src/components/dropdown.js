import React from "react";
import Select from "react-select";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      options: [
        {value:"car", label:"Car"}, 
        {value:"bus", label:"Bus"}, 
        {value:"autorickshaw", label:"Autorickshaw"}, 
        {value:"bike", label:"Bike"}
      ]
    };

    this.handleChange = this.handleChange.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }
  handleChange(e) {
    let { onChange } = this.props;
    onChange(e.label);
  }
  onDelete(e) {
    let { onDelete } = this.props;
    onDelete();
  }

  render() {
    return(
      <div className="row" style={{ width: "200%" }}>
        <div className="col col-md-8">
          <Select
            value={this.state.selectedOption}
            onChange={this.handleChange}
            options={this.state.options}
          />
        </div>
        <div
          className="btn btn-outline-primary btn-sm mb-0 col col-md-2"
          style={{ float: "right", background: "red" }} onClick={this.onDelete}
        >
          <FontAwesomeIcon icon={faTrashAlt} color="#fff" />
        </div>
      </div>
    );
  }
}

export default Dropdown;