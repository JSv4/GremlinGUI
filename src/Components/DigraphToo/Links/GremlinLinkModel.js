import {
  DefaultLinkModel,
} from '@projectstorm/react-diagrams-defaults';

export default class GremlinLinkModel extends DefaultLinkModel {
  constructor(id, options={}) {
    super({
      type: 'link',
      ...options,
    });

    this.id = id || -1;
  }

}
