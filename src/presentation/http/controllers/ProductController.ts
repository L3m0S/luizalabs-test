import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { IProductService } from '@application/interfaces/IProductService';

@injectable()
export class ProductController {
  constructor(
    @inject('IProductService')
    private readonly productService: IProductService,
  ) { }

  public async getById(req: Request, res: Response) {
    const { id } = req.params;
    res.status(200).send(await this.productService.getById(+id));
  }
}
