import { NextFunction, Request, Response } from "express";
import { body, ValidationChain, validationResult } from "express-validator";

export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));
        const errors = validationResult(req);
        if(errors.isEmpty()) return next();
        return res.status(422).json({errors: errors.array()})
    };
};

export const loginValidator= [
    body("email").trim().isEmail().withMessage("Email is required"),
    body("password").trim().isLength({min: 6}).withMessage("Password should contains atleast 6 characters"),
]

export const signupValidator= [
    body("name").notEmpty().withMessage("Name is required"),
    ...loginValidator,
]

export const chatCompletionValidator= [
    body("message").notEmpty().withMessage("Message is required"),
]
