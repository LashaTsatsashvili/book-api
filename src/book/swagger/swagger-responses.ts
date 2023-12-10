export const getOneResponses = {
  success: {
    status: 200,
    description: "კონკრეტული წიგნის წამოღება.",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        author: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { type: "string" },
        pages: {
          type: "array", items: {
            type: "object", example: {
              id: "number",
              content: "string",
              pageNumber: "number"
            }
          }
        }
      }
    }
  },
  notFound: {
    status: 404,
    description: "წიგნი ვერ მოიძებნა.",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 404 },
        message: { type: "string", example: "message" }
      }
    }
  }
};
export const getAllResponses = {
  success: {
    status: 200,
    description: "ყველა წიგნის წამოღება",
    schema: {
      type: "array",
      items: {
        type: "object",
        properties: {
          id: { type: "number" },
          title: { type: "string" },
          author: { type: "string" },
          createdAt: { type: "string" },
          updatedAt: { type: "string" },
          deletedAt: { type: "string" },
          pages: {
            type: "array", items: {
              type: "object", example: {
                id: "number",
                content: "string",
                pageNumber: "number"
              }
            }
          }
        }
      }
    }
  }
};
export const createResponses = {
  created: {
    status: 201,
    description: "ახალი წიგნის შექმნა",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        author: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { example: null },
        uploader: {
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            phone: { type: "string" }
          }
        }
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
  }
};
export const updateResponse = {
  success: {
    status: 200,
    description: "ახალი წიგნის შექმნა",
    schema: {
      type: "object",
      properties: {
        id: { type: "number" },
        title: { type: "string" },
        author: { type: "string" },
        updatedAt: { type: "string" },
        deletedAt: { example: null },
        uploader: {
          properties: {
            id: { type: "number" },
            email: { type: "string" },
            phone: { type: "string" }
          }
        }
      }
    }
  },
  forbidden: {
    status: 403, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "message" }
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
  internalServerError: {
    status: 500, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 500 },
        message: { type: "string", example: "message" }
      }
    }
  }
};
export const deleteResponse = {
  success: {
    status: 200,
    description: "Delete a book",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  },
  forbidden: {
    status: 403,
    description: "არ გაქვთ ამ წიგნის წაშლის უფლება",
    schema: {
      type: "object",
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "message" }
      }
    }
  }
};
export const createOrUpdateHistoryResponse = {
  success : {
    status: 200,
    description: "Create or update reading history for a book",
    schema: {
      type: "object",
      properties: {
        message: { type: "string" }
      }
    }
  },
  forbidden : {
    status: 403, description: "ცუდი რექვესტი", schema: {
      properties: {
        statusCode: { type: "number", example: 403 },
        message: { type: "string", example: "message" }
      }
    }
  }
};
