import { Catch, ExceptionFilter, ArgumentsHost, HttpStatus } from "@nestjs/common";
import { QueryFailedError } from "typeorm";

@Catch(QueryFailedError)
export class MySQLExceptionFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const context = host.switchToHttp();
    const response = context.getResponse();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    // @ts-ignore
    if (exception.errno === 1062) {
      // Duplicate entry error
      response.status(status).json({
        statusCode: status,
        message: "ჩანაწერის დუბლიკატი. გთხოვთ, მიუთითოთ უნიკალური მნიშვნელობები"
      });
    } else {
      // Handle other MySQL errors
      response.status(status).json({
        statusCode: status,
        message: "თქვენი მოთხოვნის დამუშავებისას დაფიქსირდა შეცდომა"
      });
    }
  }
}
