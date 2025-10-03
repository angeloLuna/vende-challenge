import { NotFoundException } from '@nestjs/common';
import { ProductsService } from './products.service';
import { PrismaService } from '../prisma/prisma.service'; // ajusta ruta si usas src/prisma
import { createMockPrisma, MockPrisma } from '../../test/mocks/prisma.mock';

describe('ProductsService', () => {
  let service: ProductsService;
  let prisma: MockPrisma;

  beforeEach(() => {
    prisma = createMockPrisma();
    service = new ProductsService(prisma as unknown as PrismaService);
  });

  it('create: debe crear un producto', async () => {
    const dto = { name: 'Laptop', sku: 'LP-001', price: 1000, companyId: 'uuid-cia' };
    prisma.product.create.mockResolvedValue({ id: 'p1', ...dto, createdAt: new Date(), updatedAt: new Date() } as any);

    const result = await service.create(dto as any);
    expect(prisma.product.create).toHaveBeenCalledWith({ data: dto });
    expect(result.id).toBe('p1');
  });

  it('findAll: debe listar productos con company', async () => {
    prisma.product.findMany.mockResolvedValue([
      { id: 'p1', name: 'A', sku: 'A', price: 10, companyId: 'c1' },
    ] as any);

    const items = await service.findAll();
    expect(prisma.product.findMany).toHaveBeenCalledWith({
      include: { company: { select: { id: true, name: true } } },
    });
    expect(items).toHaveLength(1);
  });

  it('findOne: devuelve el producto si existe', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'p1' } as any);
    const item = await service.findOne('p1');
    expect(item.id).toBe('p1');
  });

  it('findOne: lanza NotFound si no existe', async () => {
    prisma.product.findUnique.mockResolvedValue(null);
    await expect(service.findOne('nope')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('update: actualiza producto existente', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'p1' } as any); // usado por findOne
    prisma.product.update.mockResolvedValue({ id: 'p1', name: 'B' } as any);

    const updated = await service.update('p1', { name: 'B' } as any);
    expect(prisma.product.update).toHaveBeenCalledWith({ where: { id: 'p1' }, data: { name: 'B' } });
    expect(updated.name).toBe('B');
  });

  it('remove: elimina producto existente', async () => {
    prisma.product.findUnique.mockResolvedValue({ id: 'p1' } as any);
    prisma.product.delete.mockResolvedValue({ id: 'p1' } as any);

    const res = await service.remove('p1');
    expect(prisma.product.delete).toHaveBeenCalledWith({ where: { id: 'p1' } });
    expect(res).toEqual({ ok: true });
  });
});
