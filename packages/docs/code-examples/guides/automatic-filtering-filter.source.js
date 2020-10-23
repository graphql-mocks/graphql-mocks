import { createWrapper, WrapperFor } from 'graphql-mocks/resolver';

function filterResult(result, args) {
  // only filter on results that are arrays of objects, ie: [User!]!
  if (!Array.isArray(result) || (Array.isArray(result) && result.some((item) => typeof item !== 'object'))) {
    return result;
  }

  const filtered = result.filter((resultItem) => {
    // ensure that the value for an argument matches the value
    // on the object for the matching key
    return Object.entries(args).every(([key, value]) => {
      if (key in resultItem) {
        return resultItem[key] === value;
      }

      return true;
    });
  });

  return filtered;
}

export const automaticFilterWrapper = createWrapper('automatic-field-filtering', WrapperFor.FIELD, async function (
  originalResolver,
  wrapperOptions,
) {
  return async (parent, args, context, info) => {
    const result = await originalResolver(parent, args, context, info);
    return filterResult(result, args);
  };
});
