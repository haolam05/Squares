import { Request, Response } from "express";

export let vals = new Map<String, String>();

/** Returns a list of all the named save files. */
export function Dummy(req: Request, res: Response) {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(500).send('missing "name" parameter');
  } else {
    res.json(`Hi, ${name}`);
  }
}

// Delete all saved files
export function reset(): void {
  vals.clear();
}

// sends response with data(vals), which are the files we have saved, in the following format:
//    { files: vals }, where vals = {filename1=>square1, filename2=>square2,...}
export function ListFiles(_: Request, res: Response) {
  res.json({ files: Object.fromEntries(vals) })
}

// updates data(vals) by adding a new key value pair to it, where key value pair format is
//    {filename=>square}
export function CreateSquare(req: Request, res: Response) {
  const filename = first(req.body.filename);
  const sq = first(req.body.sq);
  if (filename === undefined) {
    res.status(400).send('missing "filename" parameter!!');
    return;
  } else if  (sq === undefined) {
    res.status(400).send('missing "sq" parameter!!');
    return;
  } else {
    vals.set(filename, sq);
    res.json(vals.get(filename));
  }
}

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param: any): string|undefined {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
}
