import { DefaultPortModel } from '@projectstorm/react-diagrams';
import GremlinLinkModel from './GremlinLinkModel';

export class GremlinPortModel extends DefaultPortModel {
	createLinkModel() {
		return new GremlinLinkModel();
	}
}