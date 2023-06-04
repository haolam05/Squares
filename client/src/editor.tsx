import React, { Component } from "react";
import { Square, Path, solid, replaceSubtree, Color, split, getSubtreeRoot  } from './square';
import { SquareElem } from "./square_draw";
import { len, prefix } from "./list";


interface EditorProps {
  /** Initial state of the file. */
  initialState: Square;
  onBack: () => void;
  onSave: (_: any, sq: Square) => void;
}


interface EditorState {
  /** The root square of all squares in the design */
  root: Square;
  viewButtons: JSX.Element[];
  editButtons: JSX.Element[];

  /** Path to the square that is currently clicked on, if any */
  selected?: Path;
}


export class Editor extends Component<EditorProps, EditorState> {

  constructor(props: any) {
    super(props);

    this.state = { 
      root: props.initialState,
      viewButtons: [<button style={{ height: '25px', width: '70px', margin: '5px' }} type="button" onClick={(evt) => this.props.onSave(evt, this.state.root)}>Save</button>,
                    <button style={{ height: '25px', width: '70px', margin: '5px' }} type="button" onClick={this.props.onBack}>Close</button>],
      editButtons: [<button style={{ height: '25px', width: '70px', margin: '5px' }} type="button" onClick={this.handleSplit}>Split</button>,
                    <button style={{ height: '25px', width: '70px', margin: '5px' }} type="button" onClick={this.handleMerge}>Merge</button>,
                    <select style={{ height: '25px', width: '70px', margin: '5px' }} onChange={this.handleColorChange}>
                      <option value="white">White</option>
                      <option value="red">Red</option>
                      <option value="orange">Orange</option>
                      <option value="yellow">Yellow</option>
                      <option value="green">Green</option>
                      <option value="blue">Blue</option>
                      <option value="purple">Purple</option>
                    </select>
                   ]
    };
  }

  render = (): JSX.Element => {
    // TODO: add some editing tools here
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <SquareElem width={600} height={600}
                      square={this.state.root} selected={this.state.selected}
                      onClick={this.handleClick}></SquareElem>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <header style={{ padding: '10px' }}><b>Tools</b></header>
          <div id='tools' style={{ display: 'none' }}>{this.state.editButtons}</div>
          <div style={{ display: 'flex' }}>{this.state.viewButtons}</div>
        </div>
      </div>
    )
  };

  handleClick = (path: Path): void => {
    // TODO: remove this code, do something with the path to the selected square
    this.setState({selected: path});
    const tools = document.getElementById("tools") as HTMLElement;
    tools.style.display = 'flex';

    const sq: Square = getSubtreeRoot(this.state.root, path);
    if (sq.kind === "solid") { //always
      let option = document.querySelector('option[value=' + sq.color + ']') as HTMLOptionElement;
      option.selected = true;
    }
  }

  handleSplit = (): void => {
    // TODO: implement
    const tools = document.getElementById("tools") as HTMLElement;
    tools.style.display = 'none';
    const option = document.querySelector('option:checked') as HTMLOptionElement;
    let color;

    const sq3: Square = getSubtreeRoot(this.state.root, this.state.selected as Path);
    if (sq3.kind === "solid") { //always
      color = sq3.color;
    } else {
      color = option.value as Color
    }
    
    let sq1: Square = this.state.root;
    let sq2: Square = split(solid(color), solid(color), solid(color), solid(color));
    let path: Path = this.state.selected as Path;

    if (path !== undefined) {
      this.setState({root: replaceSubtree(sq1, path, sq2)});
      this.setState({ selected: undefined });
    }
  };


  handleMerge = (): void => {
    // TODO: implement
    const tools = document.getElementById("tools") as HTMLElement;
    tools.style.display = 'none';
    const option = document.querySelector('option:checked') as HTMLOptionElement;
    const color = option.value as Color;

    if (this.state.root.kind !== "solid") {
      let sq1: Square = this.state.root;
      let sq2: Square = solid(color);
      let path: Path = prefix(len(this.state.selected as Path) - 1, this.state.selected as Path);

      if (path !== undefined) {
        this.setState({ root: replaceSubtree(sq1, path, sq2)});
        this.setState({ selected: undefined });
      }
    }
  };

  handleColorChange = (): void => { // TODO: you may want to add parameter(s)
    // TODO: implement
    const tools = document.getElementById("tools") as HTMLElement;
    tools.style.display = 'none';
    const option = document.querySelector('option:checked') as HTMLOptionElement;
    const color = option.value as Color;

    let sq1: Square = this.state.root;
    let sq2: Square = solid(color);
    let path: Path = this.state.selected as Path;
    if (path !== undefined) {
      this.setState({ root: replaceSubtree(sq1, path, sq2) });
      this.setState({ selected: undefined });
    }
  };
}
