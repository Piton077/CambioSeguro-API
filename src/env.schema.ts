import * as Joi from "joi";

export const validationSchema = Joi.object({
    PORT: Joi.number().default(3000),
    TOKEN_PROVIDER_EXPIRATION_PERIOD: Joi.string().required(),
    PASSWORD_ENCRYPTION_ROUNDS: Joi.number().required(),
    TOKEN_PROVIDER_SECRET: Joi.string().required(),
    EMAIL_HOST: Joi.string().required(),
    EMAIL_USERNAME: Joi.string().required(),
    EMAIL_PASSWORD: Joi.string().required(),
    CAMBIO_SEGURO_API_URL: Joi.string().required().default("https://api.test.cambioseguro.com/api/v1.1"),
    MONGO_URI: Joi.string().required().default("mongodb://mongo:27017/nestjs")
});
