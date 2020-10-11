/* eslint-disable no-prototype-builtins */

// convert snake to camel from BE
export const camelCase = (obj) => {
  const newObj = {};
  for (const d in obj) {
    if (obj.hasOwnProperty(d)) {
      newObj[
        d.replace(/(_\w)/g, function (k) {
          return k[1].toUpperCase();
        })
      ] = obj[d];
    }
  }
  return newObj;
};
