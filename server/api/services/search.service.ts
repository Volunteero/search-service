import * as es from 'elasticsearch';
import { EntityType } from './entitiy-type';

class SearchService {

    private client;
    private indexName = 'volunteero-search';
    constructor(host: String) {

        this.client = new es.Client({
            host,
            log: 'trace'
        });
    }

    private createEsParams(entities, mode: EntityType) {

        let body = [];
        entities.forEach(entity => {

            let moddedPush = {};
            moddedPush[mode] = { _index: this.indexName, _type: 'default', _id: entity.id };
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
        return { body };
    }

    async createEntities(entities) {

        return await this.client.bulk(this.createEsParams(entities, EntityType.Create));
    }

    async updateEntities(entities) {

        return await this.client.bulk(this.createEsParams(entities, EntityType.Update));
    }

    async deleteEntities(entities) {

        return await this.client.bulk(this.createEsParams(entities, EntityType.Delete));
    }

    async search(keywords: String[], type = 'any') {

        let typedQuery = false;
        let q = '';
        // If there is a preferred entity type, enforce it
        if (type !== 'any') {

            typedQuery = true;
            q += `type:${type}`;
        }
        // If we have keywords, add each one as filter for name and description
        if (keywords.length > 0) {

            if (typedQuery) {

                q += ' AND (';
            }
            q += keywords.reduce((query, keyword) => {
                query += ` description:${keyword} OR name:${keyword} OR`;
                return query;
            }, '');
            q = q.substring(0, q.length - 3);
            if (typedQuery) {

                q += ')';
            }
        }
        // Do the search
        const result = await this.client.search({
            index: this.indexName,
            q
        });
        // Sort and split
        const sortedAndCleaned = { events: [], campaigns: [], organizations: [], other: [] };
        result.hits.hits
            .sort((a, b) => a._score > b._score)
            .map((hit) => hit._source)
            .forEach(entity => {

                let copy = { ...entity };
                switch (entity.type) {
                    case 'event':
                    case 'organization':
                    case 'campaign':
                        delete copy.type;
                        sortedAndCleaned[entity.type + 's'].push(copy);
                        break;
                    default:
                        sortedAndCleaned.other.push(copy);
                        break;
                }

            });
        return sortedAndCleaned;
    }
}

export default new SearchService('http://ec2-52-59-87-68.eu-central-1.compute.amazonaws.com:9200');