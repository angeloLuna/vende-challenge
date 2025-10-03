import { Test } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: jest.Mocked<ProductsService>;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        {
          provide: ProductsService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = moduleRef.get(ProductsController);
    service = moduleRef.get(ProductsService);
  });

  it('create: delega al service', async () => {
    service.create.mockResolvedValue({ id: 'p1' } as any);
    const dto: any = { name: 'X', sku: 'X', price: 1, companyId: 'c1' };
    const res = await controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
    expect(res.id).toBe('p1');
  });

  it('findAll: delega al service', async () => {
    service.findAll.mockResolvedValue([{ id: 'p1' }] as any);
    const res = await controller.findAll();
    expect(res).toHaveLength(1);
  });

  it('findOne: delega al service', async () => {
    service.findOne.mockResolvedValue({ id: 'p1' } as any);
    const res = await controller.findOne('p1');
    expect(service.findOne).toHaveBeenCalledWith('p1');
    expect(res.id).toBe('p1');
  });

  it('update: delega al service', async () => {
    service.update.mockResolvedValue({ id: 'p1', name: 'Z' } as any);
    const res = await controller.update('p1', { name: 'Z' } as any);
    expect(service.update).toHaveBeenCalledWith('p1', { name: 'Z' });
    expect(res.name).toBe('Z');
  });

  it('remove: delega al service', async () => {
    service.remove.mockResolvedValue({ ok: true } as any);
    const res = await controller.remove('p1');
    expect(service.remove).toHaveBeenCalledWith('p1');
    expect(res.ok).toBe(true);
  });
});
