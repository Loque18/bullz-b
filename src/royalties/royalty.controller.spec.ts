import { Test, TestingModule } from '@nestjs/testing';
import { RoyaltysController } from './royalty.controller';

describe('RoyaltysController', () => {
  let controller: RoyaltysController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RoyaltysController],
    }).compile();

    controller = module.get<RoyaltysController>(RoyaltysController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
