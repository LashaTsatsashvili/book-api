import { ApiResponse, ApiBearerAuth } from "@nestjs/swagger";

export const ApiBookResponse1 = {
  getOne: [
    ApiResponse({
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
    }),
    ApiResponse({
      status: 404,
      description: "წიგნი ვერ მოიძებნა.",
      schema: {
        type: "object",
        properties: {
          statusCode: { type: "number", example: 404 },
          message: { type: "string", example: "message" }
        }
      }
    }),
  ],
  getAll: [
    ApiResponse({
      status: 200,
      description: "ყველა წიგნის წამოღება",
      // ... (your schema here)
    }),
  ],
  create: [
    ApiResponse({
      status: 201,
      description: "ახალი წიგნის შექმნა",
      // ... (your schema here)
    }),
    ApiResponse({
      status: 400,
      description: "ცუდი რექვესტი",
      // ... (your schema here)
    }),
  ],
  update: [
    ApiResponse({
      status: 200,
      description: "ახალი წიგნის შექმნა",
      // ... (your schema here)
    }),
    ApiResponse({
      status: 403,
      description: "ცუდი რექვესტი",
      // ... (your schema here)
    }),
    ApiResponse({
      status: 400,
      description: "ცუდი რექვესტი",
      // ... (your schema here)
    }),
    ApiResponse({
      status: 500,
      description: "ცუდი რექვესტი",
      // ... (your schema here)
    }),
  ],
  delete: [
    ApiResponse({
      status: 200,
      description: "Delete a book",
      // ... (your schema here)
    }),
    ApiResponse({
      status: 404,
      description: "არ გაქვთ ამ წიგნის წაშლის უფლება",
      // ... (your schema here)
    }),
  ],
  createOrUpdateHistory: [
    ApiResponse({
      status: 200,
      description: "Create or update reading history for a book",
      // ... (your schema here)
    }),
    ApiResponse({
      status: 403,
      description: "ცუდი რექვესტი",
      // ... (your schema here)
    }),
  ],
};

export const ApiBookBearerAuth = ApiBearerAuth("JWT-auth");
