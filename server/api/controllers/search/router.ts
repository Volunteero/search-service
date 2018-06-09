import * as express from 'express';
import controller from './controller'
import { validate } from 'express-jsonschema';
export default express.Router()
    .get('/', controller.search);