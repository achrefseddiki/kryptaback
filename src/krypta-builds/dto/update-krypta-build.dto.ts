import { PartialType } from '@nestjs/mapped-types';
import { CreateKryptaBuildDto } from './create-krypta-build.dto';

export class UpdateKryptaBuildDto extends PartialType(CreateKryptaBuildDto) {}
