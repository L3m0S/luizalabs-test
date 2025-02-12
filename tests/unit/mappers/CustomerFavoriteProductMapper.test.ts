import { describe, it, expect } from 'vitest';
import { CustomerFavoriteProductMapper } from '@application/mappers/CustomerFavoriteProductMapper';
import { CustomerFavoriteProduct } from '@domain/entities/CustomerFavoriteProduct';
import { CustomerFavoriteProductDTO } from '@application/dtos/CustomerFavoriteDTO';

describe('CustomerFavoriteProductMapper', () => {
  const mockCustomerFavoriteProduct: CustomerFavoriteProduct = {
    id: 1,
    product: {
      id: 1,
      description: 'Test description',
      externalProductId: 123,
      image: 'teste image',
      price: 1,
      title: 'Test Title',
      lastUpdateDate: new Date(),
      rating: 9.5
    },
    customer: {
      id: 1,
      name: 'Teste da silva',
      email: 'testeDaSilva@teste.com',
    },
  };

  describe('toDTO', () => {
    it('should correctly map a CustomerFavoriteProduct entity to a DTO', () => {
      const result: CustomerFavoriteProductDTO = CustomerFavoriteProductMapper.toDTO(
        mockCustomerFavoriteProduct,
      );

      expect(result).toEqual({
        id: mockCustomerFavoriteProduct.product.externalProductId,
        description: mockCustomerFavoriteProduct.product.description,
        image: mockCustomerFavoriteProduct.product.image,
        price: mockCustomerFavoriteProduct.product.price,
        title: mockCustomerFavoriteProduct.product.title,
        rating: mockCustomerFavoriteProduct.product.rating
      });
    });
  });

  describe('entityListToDTOList', () => {
    it('should correctly map a list of CustomerFavoriteProduct entities to DTOs', () => {
      const entities: CustomerFavoriteProduct[] = [
        mockCustomerFavoriteProduct,
        mockCustomerFavoriteProduct,
      ];
      const result = CustomerFavoriteProductMapper.entityListToDTOList(entities);

      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(
        CustomerFavoriteProductMapper.toDTO(mockCustomerFavoriteProduct),
      );
      expect(result[1]).toEqual(
        CustomerFavoriteProductMapper.toDTO(mockCustomerFavoriteProduct),
      );
    });

    it('should return an empty array when given an empty list', () => {
      const result = CustomerFavoriteProductMapper.entityListToDTOList([]);

      expect(result).toEqual([]);
    });
  });
});
