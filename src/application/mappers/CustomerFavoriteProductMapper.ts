import { CustomerFavoriteProductDTO } from '@application/dtos/CustomerFavoriteDTO';
import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';

export class CustomerFavoriteProductMapper {
  public static toDTO(entity: CustomerFavoriteProduct): CustomerFavoriteProductDTO {
    const { product } = entity;
    return {
      id: product.externalProductId,
      description: product.description,
      image: product.image,
      price: +product.price,
      title: product.title,
      rating: product?.rating
    };
  }

  public static entityListToDTOList(
    entities: CustomerFavoriteProduct[],
  ): CustomerFavoriteProductDTO[] {
    return entities.map((entity) => this.toDTO(entity));
  }
}
