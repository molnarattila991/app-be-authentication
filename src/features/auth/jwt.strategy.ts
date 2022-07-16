import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { jwtConstants } from './constants';
import { TokenValidationCheckerService } from './token-validation-checker/token-validation-checker.service';
import { ExtractJwtTokenFromHeaderService, IExtractToken } from './extract-token/extract-token.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private tokenChecker: TokenValidationCheckerService,
    @Inject(ExtractJwtTokenFromHeaderService) private tokenExtract: IExtractToken
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
      passReqToCallback: true
    });
  }

  async validate(req: Request, payload: any) {
    const token: string = this.tokenExtract.extract(req);
    const tokenIsValid = await this.tokenChecker.check(token);

    if (tokenIsValid) {
      return { userId: payload.sub, username: payload.username };
    } else {
      throw new UnauthorizedException();
    }
  }
}