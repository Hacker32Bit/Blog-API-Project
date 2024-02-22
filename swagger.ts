import swaggerJSDoc from "swagger-jsdoc";

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "My Blog API",
            version: "1.0.0",
            description: "API documentation for My Blog",
        },
    },
    apis: ["./controllers/*.ts"],
}

export const swaggerSpec = swaggerJSDoc(swaggerOptions)