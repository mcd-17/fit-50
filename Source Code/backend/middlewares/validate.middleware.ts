import {ValidationChain, validationResult, ValidationChainWithExtensions, ContextRunner} from 'express-validator'
import {NextFunction, Request, Response} from "express";

type Validation = ValidationChain | ContextRunner | ValidationChainWithExtensions<any>

const validate = (validations: Validation[]) => async (req : Request, res: Response, next: NextFunction) => {
    for (let validation of validations) {
        const result = await validation.run(req);
        // @ts-ignore
        if (result.errors.length) break;
    }
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    const extractedErrors = []
    errors.array().map(err => extractedErrors.push({ error: true, msg: err.msg }))
    return res.status(422).json(extractedErrors[0])
}

export default validate