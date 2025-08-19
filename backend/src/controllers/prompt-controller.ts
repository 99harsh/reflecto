import prisma from '../utils/db';
import { Response } from "express";
import {  ISE, SUCCESS } from "../utils/responses";

export const allPrompts = async(req:any, res: Response) => {
    try{
        const prompts = await prisma.prompts.findMany();
        res.json(SUCCESS(prompts));
    }catch(error){
        console.log(`GET ALL PROMPTS FAILED ${error}`);
        res.status(500).json(ISE());
    }
}