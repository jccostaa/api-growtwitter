import { Response } from "express";

export function missingFieldsError(response:Response){
    return response.status(400).json({
        success:false,
        message:"Preencha os campos obrigatorios"
    })
}

export function serverError(response:Response, error:any){
    return response.status(500).json({
        success:false,
        message:error.toString()
    })
}