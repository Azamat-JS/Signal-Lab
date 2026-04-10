import { Body, Controller, Post } from '@nestjs/common';
import { RunScenarioDto } from './dto/dto';
import { ScenarioService } from './scenario.service';

@Controller('scenarios')
export class ScenarioController {
  constructor(private readonly scenarioService: ScenarioService) { }

  @Post('run')
  async run(@Body() dto: RunScenarioDto) {
    return this.scenarioService.runScenario(dto.type, dto.name);
  }
}