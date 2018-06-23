import * as express from 'express';
import controller from './controller'
import entitiySchema from './entitiy-schema';
import { validateInput, ValidationScope } from '../../middleware/input-validation';
export default express.Router()
    .get('/', controller.search)
    .post('/create', validateInput(entitiySchema, ValidationScope.Body), controller.create)
    .post('/update', validateInput(entitiySchema, ValidationScope.Body), controller.update)
    .delete('/delete', validateInput(entitiySchema, ValidationScope.Body), controller.delete);