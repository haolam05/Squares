import express from "express";
import { Dummy, ListFiles, CreateSquare } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port = 8088;
const app = express();
app.use(bodyParser.json());
app.get("/api/dummy", Dummy);
app.get("/api/list", ListFiles);        // Home page
app.post("/api/create", CreateSquare);
app.listen(port, () => console.log(`Server listening on ${port}`));
