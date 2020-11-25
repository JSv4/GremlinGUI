import { NodeModel } from '@projectstorm/react-diagrams';
import { GremlinPortModel } from '../../Links/GremlinPortModel';

/**
 * Example of a custom model using pure javascript
 */
export class JSCustomNodeModel extends NodeModel {
	constructor(id=-1, name="Unnamed", options={}) {
		super({
			...options,
			type: 'js-custom-node'
		});
		this.id = id;
		this.name = name;

		// setup an in and out port
		this.addPort(
			new GremlinPortModel({
				in: true,
				name: 'in'
			})
		);
		this.addPort(
			new GremlinPortModel({
				in: false,
				name: 'out'
			})
		);
	}

	serialize() {
		return {
			...super.serialize(),
			color: this.color
		};
	}

	deserialize(ob, engine) {
		super.deserialize(ob, engine);
		this.color = ob.color;
	}
}
