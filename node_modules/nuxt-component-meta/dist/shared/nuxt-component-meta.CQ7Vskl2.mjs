import { camelCase } from 'scule';

function refineMeta(meta, fields = { type: true, props: true, slots: true, events: true, exposed: true }) {
  const eventProps = new Set(meta.events.map((event) => camelCase(`on_${event.name}`)));
  const props = (fields.props ? meta.props : []).filter((prop) => !prop.global && !eventProps.has(prop.name)).sort((a, b) => {
    if (!a.required && b.required) {
      return 1;
    }
    if (a.required && !b.required) {
      return -1;
    }
    if (a.type === "boolean" && b.type !== "boolean") {
      return 1;
    }
    if (a.type !== "boolean" && b.type === "boolean") {
      return -1;
    }
    return 0;
  });
  const refinedMeta = {
    type: meta.type,
    props: props.map((sch) => stripeTypeScriptInternalTypesSchema(sch, true)),
    slots: (fields.slots ? meta.slots : []).map((sch) => stripeTypeScriptInternalTypesSchema(sch, true)),
    exposed: (fields.exposed ? meta.exposed : []).map((sch) => stripeTypeScriptInternalTypesSchema(sch, true)),
    events: (fields.events ? meta.events : []).map((sch) => stripeTypeScriptInternalTypesSchema(sch, true))
  };
  removeFields(refinedMeta, ["declarations"]);
  return refinedMeta;
}
function stripeTypeScriptInternalTypesSchema(type, topLevel = true) {
  if (!type) {
    return type;
  }
  if (!topLevel && type.declarations && type.declarations.find((d) => d.file.includes("node_modules/typescript") || d.file.includes("@vue/runtime-core"))) {
    return false;
  }
  if (Array.isArray(type)) {
    return type.map((sch) => stripeTypeScriptInternalTypesSchema(sch, false)).filter((r) => r !== false);
  }
  if (Array.isArray(type.schema)) {
    return {
      ...type,
      declarations: void 0,
      schema: type.schema.map((sch) => stripeTypeScriptInternalTypesSchema(sch, false)).filter((r) => r !== false)
    };
  }
  if (!type.schema || typeof type.schema !== "object") {
    return typeof type === "object" ? { ...type, declarations: void 0 } : type;
  }
  const schema = {};
  Object.keys(type.schema).forEach((sch) => {
    if (sch === "schema" && type.schema[sch]) {
      schema[sch] = schema[sch] || {};
      Object.keys(type.schema[sch]).forEach((sch2) => {
        const res2 = stripeTypeScriptInternalTypesSchema(type.schema[sch][sch2], false);
        if (res2 !== false) {
          schema[sch][sch2] = res2;
        }
      });
      return;
    }
    const res = stripeTypeScriptInternalTypesSchema(type.schema[sch], false);
    if (res !== false) {
      schema[sch] = res;
    }
  });
  return {
    ...type,
    declarations: void 0,
    schema
  };
}
function removeFields(obj, fieldsToRemove) {
  if (obj && typeof obj === "object") {
    for (const key in obj) {
      if (fieldsToRemove.includes(key)) {
        delete obj[key];
      } else if (typeof obj[key] === "object") {
        removeFields(obj[key], fieldsToRemove);
      }
    }
  }
  return obj;
}

export { refineMeta as r };
