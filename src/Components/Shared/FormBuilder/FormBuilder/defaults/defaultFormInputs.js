// @flow
import shortAnswerInputs from './shortAnswerInputs';
import longAnswerInputs from './longAnswerInputs';
import numberInputs from './numberInputs';
import arrayInputs from './arrayInputs';
import defaultInputs from './defaultInputs';

const DEFAULT_FORM_INPUTS = ({
  ...defaultInputs,
  ...shortAnswerInputs,
  ...longAnswerInputs,
  ...numberInputs,
  ...arrayInputs,
});

export default DEFAULT_FORM_INPUTS;
