import { NextFunction, Request, Response } from "express";
import User from "../models/User.js"
import { hash, compare } from "bcrypt";

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
    //get all users
    try {
        const users = await User.find();
        return res.status(200).json({message: "OK", users});
    } catch (error) {
        console.log(error);
        return res.status(404).json({message: "error", cause: error.message});
    }
}

export const userSignup = async (req: Request, res: Response, next: NextFunction) => {
    //user signup
    try {
        const {name, email, password} = req.body;
        const existingUser = await User.findOne({email});
        if(existingUser) return res.status(401).send("User is already registered");
        const hashedPassword = await hash(password, 10);
        const user = new User({name, email, password: hashedPassword});
        await user.save();
        return res.status(201).json({message: "OK", id: user._id.toString()});
    } catch (error) {
        console.log(error);
        return res.status(401).json({message: "error", cause: error.message});
    }
}

export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    //user login
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email});
        if(!user) {
            return res.status(401).send("User is not registered")
        }
        const isPasswordCorrect = await compare(password, user.password);
        if(!isPasswordCorrect) {
            return res.status(401).send("Password is not correct");
        }
       return res.status(200).json({message: "OK", id: user._id.toString()});
    } catch (error) {
        console.log(error);
        return res.status(200).json({message: "error", cause: error.message});
    }
}