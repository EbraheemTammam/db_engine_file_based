import { Body, Controller, Post} from '@nestjs/common';
import { CoreService } from './core.service';

@Controller('execute')
export class CoreController {
    private readonly _service;

    constructor(service: CoreService) {
        this._service = service;
    }

    @Post('ddl')
    execute_ddl(@Body() buffer: string) {
        try {
            return this._service.parse_ddl(this._service.lex(buffer));
        }
        catch (e) {
            let now: Date = new Date();
            let error_with_location: string = e.stack.split('\n')[1].trim();
            error_with_location = (
                error_with_location.slice(0, error_with_location.indexOf('(')) +
                error_with_location.slice(error_with_location.indexOf(')') + 1, error_with_location.indexOf(')')) 
            );
            console.error(`[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] [ERROR] ${error_with_location}: ${e.message}`);
            return {'error': e.message}
        }
    }

    @Post('dml')
    execute_dml(@Body() buffer: string) {
        try {
            return this._service.parse_ddl(this._service.lex(buffer));
        }
        catch (e) {
            let now: Date = new Date();
            let error_with_location: string = e.stack.split('\n')[1].trim();
            error_with_location = (
                error_with_location.slice(0, error_with_location.indexOf('(')) +
                error_with_location.slice(error_with_location.indexOf(')') + 1, error_with_location.indexOf(')')) 
            );
            console.error(`[${now.toLocaleDateString()} ${now.toLocaleTimeString()}] [ERROR] ${error_with_location}: ${e.message}`);
            return {'error': e.message}
        }
    }
}
