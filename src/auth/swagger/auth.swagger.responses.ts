export const signUpResponse = {
  created: {
    status: 201,
    description: "იუზერის წარმატებული რეგისტრაცია",
    schema: {
      properties: {
        id: { type: "number", example: 1 },
        firstName: { type: "string", example: "string" },
        lastName: { type: "string", example: "string" },
        email: { type: "string", example: "email" },
        phone: { type: "string", example: "1234567890" },
        createdAt: { type: "date", example: "2023-12-08T18:10:56.176Z" },
        updatedAt: { type: "date", example: "2023-12-08T18:10:56.176Z" },
        deletedAt: { example: "null" }
      }
    }
  },
  badRequest: {
    status: 400, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", example: ["ვალიდაციის შეცდომა"] },
        error: { type: "string", example: "message" }
      }
    }
  },
  conflict: { status: 409, description: "message" }
};
export const signIn = {
  success: {
    status: 200,
    description: "მომხმარებლის წარმატებული ავტორიზაცია",
    schema: {
      properties: {
        token: { type: "string", example: "string" }
      }
    }
  },
  badRequest: {
    status: 400, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 400 },
        message: { type: "array", example: ["ვალიდაციის შეცდომა"] },
        error: { type: "string", example: "Bad Request" }
      }
    }
  },
  notFound: {
    status: 404, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "message" }
      }
    }
  }
};
