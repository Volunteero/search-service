import { Request, Response } from 'express';
import MessagingService from '../../services/messaging.service';
export class Controller {

  async search(req: Request, res: Response) {

    const eventType = req.get('X-GitHub-Event');
    return res.status(200).json({});
  }

}
export default new Controller();
