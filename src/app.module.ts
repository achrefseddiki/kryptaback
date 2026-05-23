import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { BlogPostsModule } from './blog-posts/blog-posts.module';
import { DropsModule } from './drops/drops.module';
import { ReviewsModule } from './reviews/reviews.module';
import { BuildsModule } from './builds/builds.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { OrdersModule } from './orders/orders.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { HeroContentModule } from './hero-content/hero-content.module';
import { FeaturedBuildsModule } from './featured-builds/featured-builds.module';
import { BuilderAiModule } from './builder-ai/builder-ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    CategoriesModule,
    ProductsModule,
    BlogPostsModule,
    DropsModule,
    ReviewsModule,
    BuildsModule,
    UsersModule,
    AuthModule,
    OrdersModule,
    CloudinaryModule,
    HeroContentModule,
    FeaturedBuildsModule,
    BuilderAiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
