import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Rol } from '../entities';
import { RolsService } from '../services/rols.service';

describe('RolsService', () => {
  let service: RolsService;
  const mockRolsService = {
    create: jest.fn().mockImplementation((dto) => dto),
    save: jest
      .fn()
      .mockImplementation((rol) =>
        Promise.resolve({ id: expect.any(Number), ...rol }),
      ),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RolsService,
        {
          provide: getRepositoryToken(Rol),
          useValue: mockRolsService,
        },
      ],
    }).compile();

    service = module.get<RolsService>(RolsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('create rol', async () => {
    const dto = {
      name: 'Rol Jest',
      description: 'Description',
    };

    // expect(await service.createRol(dto))({
    //   id: expect.any(Number),
    //   ...dto,
    //   createdAt: '2022-10-25T11:07:20-06:00',
    // });

    expect(mockRolsService.create).toHaveBeenCalledWith(dto);
  });
});
