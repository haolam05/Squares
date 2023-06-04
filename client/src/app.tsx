import React, { MouseEvent, ChangeEvent, Component } from "react";
import { solid, Color, Square, fromJson, toJson } from './square';
import { Editor } from "./editor";

interface AppState {
  page: "list" | "view";
  filename: string;
  files: undefined | Map<String, Square>;
  sq: undefined | Square;
  viewing_sq: string;
}

const default_color: Color = "yellow";

export class App extends Component<{}, AppState> {
  constructor(props: any) {
    super(props);
    this.state = { page: "list", filename: "", files: undefined, sq: undefined, viewing_sq: "" };
  }

  componentDidMount = () => {
    fetch("/api/list")
      .then(this.handleList)
      .catch(this.handleServerError);
  };

  render = (): JSX.Element => {
    const files: JSX.Element[] = [];
    if (this.state.page === "list") {
      if (this.state.files !== undefined) {
        for (const file of this.state.files.keys()) {
          const sq: Square = this.state.files.get(file) as Square;
          files.push(<li><a href="#" onClick={(evt) => this.viewSquare(evt, file as string, sq)}>{file}</a></li>)
        }
      }
      return (
        <div>
          <header><b>Files</b></header>
          <ul>{files}</ul>{/* list all existing files here */}
          <div>{/* create a new file */}
            <label htmlFor="name">Name: </label>
            <input id="name" type="text" value={this.state.filename} onChange={this.handleNameChange}></input>
            <button style={{ margin: '5px' }} type="button" onClick={this.createSquare}>Create</button>
          </div>
        </div>
      );
    } else {
      if (this.state.sq !== undefined) {
        return <Editor initialState={this.state.sq} onBack={this.handleBack} onSave={this.handleSave}/>
      }
    }
    return <div></div>;
  };

  handleBack = (): void => {
    this.setState({ page: "list", viewing_sq: "" });
    location.reload();
  };

  handleSave = (_: MouseEvent<HTMLAnchorElement>, sq: Square): void => {
    this.setState({filename: this.state.viewing_sq});
    const filename = this.state.viewing_sq.trim().replace('\t', ' ');  // no tabs
    const data = {
      'filename': filename,
      'sq': JSON.stringify(toJson(sq))
    }
    if (filename.length > 0) {
      fetch("/api/create", {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
        .then(this.handleCreateResponse)
        .catch(this.handleServerError);
    }
  };

  // TODO: add some functions to access routes and handle state changes probably
  handleList = (res: Response) => {
    if (res.status === 200) {
      res.json().then(this.handleListJson).catch(this.handleServerError);
    } else {
      this.handleServerError(res);
    }
  }

  handleListJson = (vals: any) => {
    const map = new Map(Object.entries(vals.files));
    if (typeof vals !== "object" || vals === null || !('files' in vals) || !(map instanceof Map)) {
        console.error("bad data from /list: no files", vals)
      return;
    }

    const files = new Map<String, Square>();
    for (const file of map.keys()) {
      if (file !== undefined) {
        files.set(file, fromJson(JSON.parse(map.get(file) as string)));
      }
    }

    this.setState({ files: files });
  };

  viewSquare = (_: MouseEvent<HTMLAnchorElement>, filename: string, sq: Square): void => {
    this.setState({ page: "view", viewing_sq: filename, sq: sq });
  };

  createSquare = (_: MouseEvent<HTMLButtonElement>): void => {
    const filename = this.state.filename.trim().replace('\t', ' ');  // no tabs
    const data = {
      "filename": filename,
      "sq": JSON.stringify(toJson(solid(default_color)))
    };
    if (filename.length > 0) {
      this.setState({ page: "view", filename: "", viewing_sq: filename});
      fetch("/api/create", {method: 'POST', body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}})
        .then(this.handleCreateResponse)
        .catch(this.handleServerError);
    }
  };

  handleCreateResponse = (res: Response): void => {
    if (res.status === 200) {
      res.json().then(this.handleCreateJson).catch(this.handleServerError);
    } else {
      this.handleServerError(res);
    }
  }

  handleCreateJson = (val: any) => {
    if (val === null) {
      console.error("bad data from /create: not a record", val)
      return;
    }
    this.setState({ sq: fromJson(JSON.parse(val)) });
  };

  handleServerError = (_: Response) => {
    console.error(`unknown error talking to server`);
  }

  handleNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({ filename: evt.target.value });
  };
}