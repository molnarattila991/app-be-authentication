import { Injectable } from '@nestjs/common';

export interface IExtractToken {
    extract(req: Request);
}

@Injectable()
export class ExtractJwtTokenFromHeaderService implements IExtractToken {
    public extract(req: Request): string {
        return JSON.stringify(req.headers["authorization"].split(" ")[1]).replace('"', "").replace('"', "");
    }
}
