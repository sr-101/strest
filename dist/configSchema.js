"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Joi = require("joi");
// import { validateSchema } from './yaml-parse';
// Uses spec from: http://www.softwareishard.com/blog/har-12-spec/
var ifSchema = Joi.object().keys({
    operand: Joi.string().required(),
    equals: Joi.alternatives().try(Joi.string(), Joi.number()).required(),
});
var authSchema = Joi.object().keys({
    basic: Joi.object().keys({
        username: Joi.string().required(),
        password: Joi.string().required(),
    }).optional()
});
var cookieSchema = Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
    path: Joi.string().optional(),
    domain: Joi.string().optional(),
    expires: Joi.string().optional(),
    httpOnly: Joi.boolean().optional(),
    secure: Joi.boolean().optional(),
    comment: Joi.string().optional()
});
var headerSchema = Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
});
var queryStringSchema = Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required(),
});
var paramsSchema = Joi.object().keys({
    name: Joi.string().required(),
    value: Joi.string().required()
});
var postDataSchema = Joi.object().keys({
    mimeType: Joi.string().required(),
    params: Joi.array().items(paramsSchema).optional(),
    text: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
    comment: Joi.string().optional(),
}).without('text', 'params')
    .without('params', 'text');
var requestSchema = Joi.object().keys({
    url: Joi.string().required(),
    method: Joi.string().required(),
    postData: postDataSchema.optional(),
    // httpVersion: Joi.string().optional(),
    headers: Joi.array().items(headerSchema).optional(),
    queryString: Joi.array().items(queryStringSchema).optional(),
    cookies: Joi.array().items(cookieSchema).optional(),
    json: Joi.string().optional(),
});
var validateSchema = Joi.object().keys({
    jsonpath: Joi.string().required(),
    expect: Joi.alternatives().try(Joi.boolean(), Joi.number(), Joi.object(), Joi.string(), null).optional(),
    type: Joi.array().items(Joi.string()).optional(),
    jsonschema: Joi.any().optional(),
    regex: Joi.string().optional()
}).without('type', 'expect')
    .without('type', 'regex')
    .without('expect', 'regex')
    .without('expect', 'type')
    .without('regex', 'type')
    .without('regex', 'expect');
exports.responseSchema = Joi.object().keys({
    // This is the strict response schema.  It can be used to validate and log responses
    status: Joi.number().required(),
    statusText: Joi.string().optional(),
    httpVersion: Joi.string().optional(),
    cookies: Joi.array().items(cookieSchema).optional(),
    headers: Joi.array().items(headerSchema).optional(),
    content: Joi.alternatives().try(Joi.object(), Joi.string()).optional(),
    redirectURL: Joi.string().optional(),
    headersSize: Joi.number().optional(),
    bodySize: Joi.number().optional(),
    comment: Joi.string().optional(),
});
var requestsSchema = Joi.object().keys({
    delay: Joi.number().optional(),
    maxRetries: Joi.number().optional(),
    if: ifSchema.optional(),
    request: requestSchema.required(),
    validate: Joi.array().items(validateSchema.optional()),
    log: Joi.alternatives().try(Joi.boolean(), Joi.string().optional()),
    auth: authSchema.optional(),
});
var requestNameSchema = Joi.object().pattern(/\w+/, requestsSchema);
exports.Schema = Joi.object({
    version: Joi.number().min(2).max(2),
    requests: requestNameSchema,
    allowInsecure: Joi.boolean().optional(),
    variables: Joi.object().optional(),
    // Created dynamically
    raw: Joi.string().required(),
    relativePath: Joi.string().required(),
    fileName: Joi.string().required(),
});
exports.BulkSchema = Joi.array().items(Joi.string());
