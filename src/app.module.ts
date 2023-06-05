import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GatewayModule } from './gateway/gateway.module';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';

const staticPath = join(__dirname, '../../', 'client', 'dist', 'client');

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: staticPath,
    }),
    GatewayModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
