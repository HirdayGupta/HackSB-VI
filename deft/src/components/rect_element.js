import React, { Component } from "react";
import { Rect } from "react-konva";
import { LeftAnchor, RightAnchor, TopAnchor, BottomAnchor, WidthAnchor, HeightAnchor } from "../constraints"

export default class RectElement extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      x: props.x,
      y: props.y,
      width: props.width,
      height: props.height,
      fill: props.fill,
      borderRadius: props.borderRadius
    };

    this.leftAnchor = new LeftAnchor(this.state.x, this.state.y, this.state.width, this.state.height);
    this.rightAnchor = new RightAnchor(this.state.x, this.state.y, this.state.width, this.state.height);
    this.topAnchor = new TopAnchor(this.state.x, this.state.y, this.state.width, this.state.height);
    this.bottomAnchor = new BottomAnchor(this.state.x, this.state.y, this.state.width, this.state.height);
    this.widthAnchor = new WidthAnchor(this.state.x, this.state.y, this.state.width, this.state.height);
    this.heightAnchor = new HeightAnchor(this.state.x, this.state.y, this.state.width, this.state.height);

    this.constraints = [];
    this.name = props.name;
  }

  componentDidMount() {
    this.shapeRef.moveToTop();
  }

  getType = () => {
    return "RectElement";
  }

  changeBorderRadius(newBorderRadius) {
    this.setState({
      borderRadius: parseInt(newBorderRadius)
    });
  }

  updateFillColor(newColor) {
    this.setState({
      fill: newColor
    });
  }

  getConstraints() {
    return this.constraints;
  }

  addConstraint(constraint) {
    this.constraints.push(constraint);
  }

  deleteConstraint(constraint) {
    var index = this.constraints.indexOf(constraint);
    if (index < 0) {
      return;
    }
    this.constraints.splice(index, 1);
  }

  updateAnchors = () => {
    this.leftAnchor.computeValue(this.state.x, this.state.y, this.state.width, this.state.height);
    this.rightAnchor.computeValue(this.state.x, this.state.y, this.state.width, this.state.height);
    this.topAnchor.computeValue(this.state.x, this.state.y, this.state.width, this.state.height);
    this.bottomAnchor.computeValue(this.state.x, this.state.y, this.state.width, this.state.height);
    this.widthAnchor.computeValue(this.state.x, this.state.y, this.state.width, this.state.height);
    this.heightAnchor.computeValue(this.state.x, this.state.y, this.state.width, this.state.height);
  }

  handleDragEnd = (e) => {
    this.setState({
      x: e.target.x(),
      y: e.target.y()
    }, this.updateAnchors);
  }

  handleTransformEnd = (e) => {
    // transformer is changing scale of the node
    // and NOT its width or height
    // but in the store we have only width and height
    // to match the data better we will reset scale on transform end
    const node = this.shapeRef;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // we will reset it back
    node.scaleX(1);
    node.scaleY(1);

    this.setState({
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY)
    }, this.updateAnchors);
  }

  render() {
    return(
      <React.Fragment>
      <Rect
        x={this.state.x}
        y={this.state.y}
        ref={ref => {this.shapeRef = ref}}
        width={this.state.width}
        height={this.state.height}
        fill={this.state.fill}
        cornerRadius={this.state.borderRadius}
        name={this.props.name}
        draggable={true}
        onClick={this.handleClick}
        onDragEnd={this.handleDragEnd}
        onTransformEnd={this.handleTransformEnd}
      />
      </React.Fragment>

    )
  }
}