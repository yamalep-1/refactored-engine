import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Создадим тестового поставщика
  const supplier = await prisma.user.upsert({
    where: { email: 'supplier@lumiere.com' },
    update: {},
    create: {
      name: 'LUMIÈRE Official',
      email: 'supplier@lumiere.com',
      password: '123',
      role: 'SUPPLIER',
    },
  });

  const mockProducts = [
    {
      name: 'Белая базовая футболка',
      description: 'Идеальная посадка, 100% органический хлопок. Незаменимая вещь в гардеробе.',
      price: 2500,
      imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Минималистичное худи',
      description: 'Мягкий флис внутри, оверсайз крой. Комфорт на каждый день.',
      price: 6500,
      imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Легкая куртка-ветровка',
      description: 'Защита от ветра и легкого дождя. Стильный и функциональный элемент.',
      price: 8900,
      imageUrl: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Классическая рубашка',
      description: 'Хлопковая рубашка прямого кроя. Подходит для офиса и вечерних выходов.',
      price: 4200,
      imageUrl: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Льняные брюки',
      description: 'Легкие дышащие брюки для теплой погоды. Элегантная небрежность.',
      price: 5500,
      imageUrl: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&q=80&w=800',
    },
    {
      name: 'Вязаный свитер',
      description: 'Теплый свитер крупной вязки из полушерсти. Согреет в любые холода.',
      price: 7200,
      imageUrl: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=800',
    }
  ];

  for (const product of mockProducts) {
    await prisma.product.create({
      data: {
        ...product,
        supplierId: supplier.id,
      },
    });
  }

  console.log('БД успешно заполнена товарами!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
