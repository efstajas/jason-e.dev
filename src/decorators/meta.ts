import { createDecorator } from 'vue-class-component';

/* eslint-disable no-param-reassign */
export default createDecorator((options, key) => {
  if (!options.methods) return;
  options.metaInfo = options.methods[key];
});
