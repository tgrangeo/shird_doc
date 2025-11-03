'use strict';

const content = require('@nuxt/content');

const ogImageSchema = content.z.object({
  url: content.z.string().optional(),
  component: content.z.string().optional(),
  props: content.z.record(content.z.string(), content.z.any())
}).optional();
const schema = content.z.object({
  ogImage: ogImageSchema
});
function asOgImageCollection(collection) {
  if (collection.type === "page") {
    collection.schema = collection.schema ? schema.extend(collection.schema.shape) : schema;
  }
  return collection;
}

exports.asOgImageCollection = asOgImageCollection;
exports.ogImageSchema = ogImageSchema;
exports.schema = schema;
