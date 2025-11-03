import { z } from '@nuxt/content';

const ogImageSchema = z.object({
  url: z.string().optional(),
  component: z.string().optional(),
  props: z.record(z.string(), z.any())
}).optional();
const schema = z.object({
  ogImage: ogImageSchema
});
function asOgImageCollection(collection) {
  if (collection.type === "page") {
    collection.schema = collection.schema ? schema.extend(collection.schema.shape) : schema;
  }
  return collection;
}

export { asOgImageCollection, ogImageSchema, schema };
