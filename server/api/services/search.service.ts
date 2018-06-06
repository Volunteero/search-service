import * as es from 'elasticsearch';
import * as events from 'events';
import * as uuid from 'uuid/v4';
import { EntityType } from './entitiy-type';

class SearchService extends events.EventEmitter {

    private client;
    constructor(host: String) {

        super();
        this.client = new es.Client({
            host,
            log: 'trace'
        });
    }

    async searchDescription() {

        const result = await this.client.ping();
        console.log(result);
    }

    private createEsParams(entities, mode: EntityType) {

        let body = [];
        entities.forEach(entity => {

            let moddedPush = {};
            moddedPush[mode] = { _index: 'volunteero-search', _type: 'default', _id: entity.id };
            body.push(moddedPush);

            switch (mode) {
                case EntityType.Create:
                    body.push(entity);
                    break;
                case EntityType.Update:
                    body.push({ doc: entity });
                    break;
            }
        });
        console.log(body);
        return { body };
    }

    async createEntities(entities) {

        const result = await this.client.bulk(this.createEsParams(entities, EntityType.Create));
        console.log(result);
    }

    async updateEntities(entities) {

        const result = await this.client.bulk(this.createEsParams(entities, EntityType.Update));
        console.log(result);
    }

    async deleteEntities(entities) {

        const result = await this.client.bulk(this.createEsParams(entities, EntityType.Delete));
        console.log(result);
    }
}

export default new SearchService('http://ec2-52-59-200-135.eu-central-1.compute.amazonaws.com:9200');