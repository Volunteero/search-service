import { Request, Response } from 'express';
import { Validator, Schema, ValidatorResult, validate } from 'jsonschema';

export function validateInput(schema: Schema, scope: ValidationScope = ValidationScope.Body) {

    return function corsMiddleware(req: Request, res: Response, next) {

        let result= validate(req.body, schema);
        if (!result.valid) {

            return res.status(400).json({ errors: result });
        }

        next();
    };
}

export enum ValidationScope {
    Body, Query
}