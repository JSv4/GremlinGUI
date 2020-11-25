import { DefaultLinkFactory } from '@projectstorm/react-diagrams-defaults';
import GremlinLinkModel from './GremlinLinkModel';


export default class LinkFactory extends DefaultLinkFactory {
    constructor() {
        super('link');
    }

    generateModel() {
        return new GremlinLinkModel();
    }

}
