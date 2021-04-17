// @flow
import * as React from 'react';
import CardGallery from './CardGallery';
import {
  parse,
  stringify,
  propagateDefinitionChanges,
  generateCategoryHash,
} from './utils';
import DEFAULT_FORM_INPUTS from './defaults/defaultFormInputs';

export default function PredefinedGallery({
  schema,
  uischema,
  onChange,
  mods,
}) {
  const schemaData = (parse(schema)) || {};
  const uiSchemaData = (parse(uischema)) || {};
  const allFormInputs = {
    ...DEFAULT_FORM_INPUTS,
    ...(mods && mods.customFormInputs),
  };
  const categoryHash = generateCategoryHash(allFormInputs);

  React.useEffect(() => {
    if (!uiSchemaData.definitions) {
      // eslint-disable-next-line no-console
      console.log('Parsing UI schema to assign UI for definitions');
      // need to create definitions from scratch
      const references = [];
      // recursively search for all $refs in the schemaData
      const findRefs = (name, schemaObject) => {
        if (!schemaObject) return;
        if (typeof schemaObject === 'object')
          Object.keys(schemaObject).forEach((key) => {
            if (typeof key === 'string') {
              if (key === '$ref') references.push(name);
              findRefs(key, schemaObject[key]);
            }
          });
        if (Array.isArray(schemaObject))
          schemaObject.forEach((innerObj) => {
            findRefs(name, innerObj);
          });
      };

      findRefs('root', schemaData);

      uiSchemaData.definitions = {};
      const referenceSet = new Set(references);
      Object.keys(uiSchemaData).forEach((uiProp) => {
        if (referenceSet.has(uiProp))
          uiSchemaData.definitions[uiProp] = uiSchemaData[uiProp];
      });
      if (!Object.keys(uiSchemaData.definitions).length) {
        uiSchemaData.definitions = undefined;
      }
      onChange(stringify(schemaData), stringify(uiSchemaData));
    }
  }, [uischema, schema]);
  return (
    <CardGallery
      definitionSchema={schemaData.definitions}
      definitionUiSchema={uiSchemaData.definitions}
      onChange={(
        newDefinitions,
        newDefinitionsUi,
      ) => {
        schemaData.definitions = newDefinitions;
        uiSchemaData.definitions = newDefinitionsUi;
        // propagate changes in ui definitions to all relavant parties in main schema

        propagateDefinitionChanges(
          schemaData,
          uiSchemaData,
          (newSchema, newUiSchema) =>
            onChange(stringify(newSchema), stringify(newUiSchema)),
          categoryHash,
        );
      }}
      mods={mods}
      categoryHash={categoryHash}
    />
  );
}
