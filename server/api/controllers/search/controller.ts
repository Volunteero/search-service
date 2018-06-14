import { Request, Response } from 'express';
import MessagingService from '../../services/messaging.service';
import SearchService from '../../services/search.service';

export class Controller {

  public static allowedTypes = ['event', 'campaign', 'organization', 'any'];
  async search(req: Request, res: Response) {

    const isValidInput = Controller.isValidInput(req.query);
    if (!isValidInput.valid) {

      return res.status(400).json({
        message: 'Invalid input: ' + isValidInput.reason,
        allowedType: Controller.allowedTypes.join(', ')
      })
    }

    const keywords = req.query.keyword.split(' ');
    const searchResult = await SearchService.search(keywords, req.query.type);
    return res.status(200).json({ ...searchResult });
  }

  async create(req: Request, res: Response) {

    const result = await SearchService.createEntities(req.body.entities);
    if (result.error) {

      return res.status(400).json({ errors: result.errors });
    }
    return res.status(200).json({ success: true });
  }

  async update(req: Request, res: Response) {

    const result = await SearchService.updateEntities(req.body.entities);
    if (result.error) {

      return res.status(400).json({ errors: result.errors });
    }
    return res.status(200).json({ success: true });
  }

  async delete(req: Request, res: Response) {

    const result = await SearchService.deleteEntities(req.body.entities);
    if (result.error) {

      return res.status(400).json({ errors: result.errors });
    }
    return res.status(200).json({ success: true });
  }

  static isValidInput(query: any = {}): { valid: boolean, reason?: string } {

    if (typeof query.type === 'undefined') {

      return {
        valid: false,
        reason: 'No type specified'
      };
    }
    if (typeof query.keyword === 'undefined') {

      return {
        valid: false,
        reason: 'No keyword specified'
      };
    }
    if (this.allowedTypes.indexOf(query.type) < 0) {

      return {
        valid: false,
        reason: 'Type not supported'
      };
    }

    return {
      valid: true
    };
  }

}
export default new Controller();
