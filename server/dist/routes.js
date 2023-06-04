"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateSquare = exports.ListFiles = exports.reset = exports.Dummy = exports.vals = void 0;
exports.vals = new Map();
/** Returns a list of all the named save files. */
function Dummy(req, res) {
    var name = first(req.query.name);
    if (name === undefined) {
        res.status(500).send('missing "name" parameter');
    }
    else {
        res.json("Hi, ".concat(name));
    }
}
exports.Dummy = Dummy;
// Delete all saved files
function reset() {
    exports.vals.clear();
}
exports.reset = reset;
// sends response with data(vals), which are the files we have saved, in the following format:
//    { files: vals }, where vals = {filename1=>square1, filename2=>square2,...}
function ListFiles(_, res) {
    res.json({ files: Object.fromEntries(exports.vals) });
}
exports.ListFiles = ListFiles;
// updates data(vals) by adding a new key value pair to it, where key value pair format is
//    {filename=>square}
function CreateSquare(req, res) {
    console.log(req.body);
    var filename = first(req.body.filename);
    var sq = first(req.body.sq);
    if (filename === undefined) {
        res.status(400).send('missing "filename" parameter!!');
        return;
    }
    else if (sq === undefined) {
        res.status(400).send('missing "sq" parameter!!');
        return;
    }
    else {
        exports.vals.set(filename, sq);
        res.json(exports.vals.get(filename));
    }
}
exports.CreateSquare = CreateSquare;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
function first(param) {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFFVyxRQUFBLElBQUksR0FBRyxJQUFJLEdBQUcsRUFBa0IsQ0FBQztBQUU1QyxrREFBa0Q7QUFDbEQsU0FBZ0IsS0FBSyxDQUFDLEdBQVksRUFBRSxHQUFhO0lBQy9DLElBQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ25DLElBQUksSUFBSSxLQUFLLFNBQVMsRUFBRTtRQUN0QixHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQywwQkFBMEIsQ0FBQyxDQUFDO0tBQ2xEO1NBQU07UUFDTCxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQU8sSUFBSSxDQUFFLENBQUMsQ0FBQztLQUN6QjtBQUNILENBQUM7QUFQRCxzQkFPQztBQUVELHlCQUF5QjtBQUN6QixTQUFnQixLQUFLO0lBQ25CLFlBQUksQ0FBQyxLQUFLLEVBQUUsQ0FBQztBQUNmLENBQUM7QUFGRCxzQkFFQztBQUVELDhGQUE4RjtBQUM5RixnRkFBZ0Y7QUFDaEYsU0FBZ0IsU0FBUyxDQUFDLENBQVUsRUFBRSxHQUFhO0lBQ2pELEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxLQUFLLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxZQUFJLENBQUMsRUFBRSxDQUFDLENBQUE7QUFDL0MsQ0FBQztBQUZELDhCQUVDO0FBRUQsMEZBQTBGO0FBQzFGLHdCQUF3QjtBQUN4QixTQUFnQixZQUFZLENBQUMsR0FBWSxFQUFFLEdBQWE7SUFDdEQsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7SUFDckIsSUFBTSxRQUFRLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7SUFDMUMsSUFBTSxFQUFFLEdBQUcsS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7SUFDOUIsSUFBSSxRQUFRLEtBQUssU0FBUyxFQUFFO1FBQzFCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLGdDQUFnQyxDQUFDLENBQUM7UUFDdkQsT0FBTztLQUNSO1NBQU0sSUFBSyxFQUFFLEtBQUssU0FBUyxFQUFFO1FBQzVCLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLDBCQUEwQixDQUFDLENBQUM7UUFDakQsT0FBTztLQUNSO1NBQU07UUFDTCxZQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsRUFBRSxFQUFFLENBQUMsQ0FBQztRQUN2QixHQUFHLENBQUMsSUFBSSxDQUFDLFlBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUMsQ0FBQztLQUM5QjtBQUNILENBQUM7QUFkRCxvQ0FjQztBQUVELHdFQUF3RTtBQUN4RSw0RUFBNEU7QUFDNUUsbURBQW1EO0FBQ25ELFNBQVMsS0FBSyxDQUFDLEtBQVU7SUFDdkIsSUFBSSxLQUFLLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO1FBQ3hCLE9BQU8sS0FBSyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ3hCO1NBQU0sSUFBSSxPQUFPLEtBQUssS0FBSyxRQUFRLEVBQUU7UUFDcEMsT0FBTyxLQUFLLENBQUM7S0FDZDtTQUFNO1FBQ0wsT0FBTyxTQUFTLENBQUM7S0FDbEI7QUFDSCxDQUFDIn0=