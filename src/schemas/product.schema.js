import joi from "joi";

  export const postProductSchema = joi.object({
      name: joi.string().required(),
      description: joi.string().required(),
      photo: joi.string().uri().required(),
      category: joi.string().required(),
      status: joi.string().required(),
      price: joi.number().min(0).precision(2).required(),
    });
