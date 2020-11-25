import { Action, InputType } from '@projectstorm/react-canvas-core';
import * as _ from 'lodash';

/**
 * Deletes all selected items
 */
export default class GremlinDeleteItemsAction extends Action {
	constructor(options = {}, nodeDeleteHandler=null, linkDeleteHandler=null) {
		const keyCodes = options.keyCodes || [46, 8];
		const modifiers = {
			ctrlKey: false,
			shiftKey: false,
			altKey: false,
			metaKey: false,
			...options.modifiers
		};

		super({
			type: InputType.KEY_DOWN,
			fire: (event) => {
				const { keyCode, ctrlKey, shiftKey, altKey, metaKey } = event.event;

				if (keyCodes.indexOf(keyCode) !== -1 && _.isEqual({ ctrlKey, shiftKey, altKey, metaKey }, modifiers)) {
					_.forEach(this.engine.getModel().getSelectedEntities(), (model) => {
						// only delete items which are not locked
						if (!model.isLocked()) {
                            // Injecting listeners at this part of the event handler because, unfortunately, there's no way that I could see to differentiate why a model was removed 
                            // by listening to the defauly actions. When I unloaded the digraphs and removed the nodes and edges, the listeners were seeing those as the same kind of 
                            // remove as if I had deleted them with a delete key or backspace... so everytime I unloaded the digraph, I destroyed it! Totally not what was desired
                            // so intercept user inputs here for *actual* delete and DO NOTHING for the remove event itself that is emitted from the edges, nodes or model.
                            console.log("Custom delete", model);
                            console.log("Type is", model.options.type);
                            console.log(model.hasOwnProperty('sourcePort'));
                            
                            // Setup the delete listeners...
                            if (nodeDeleteHandler && model.options.type==='js-custom-node') nodeDeleteHandler(model.id);
                            if (linkDeleteHandler && model.options.type==='link') linkDeleteHandler(model.id);

                            // remove the the engine model itself to perform updates on screen
							model.remove();
						}
					});
					this.engine.repaintCanvas();
				}
			}
		});
	}
}