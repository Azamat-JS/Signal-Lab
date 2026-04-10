import { IsNotEmpty, IsString } from 'class-validator'
import type { ScenarioType } from '../type';

export class RunScenarioDto {
    @IsString()
    @IsNotEmpty()
    type!: ScenarioType;

    @IsString()
    @IsNotEmpty()
    name!: string;
}