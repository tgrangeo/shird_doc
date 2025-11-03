"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Chat: () => Chat,
  experimental_useObject: () => experimental_useObject,
  useCompletion: () => useCompletion
});
module.exports = __toCommonJS(src_exports);

// src/use-completion.ts
var import_ai = require("ai");
var import_swrv = __toESM(require("swrv"));
var import_vue = require("vue");
var uniqueId = 0;
var useSWRV = import_swrv.default.default || import_swrv.default;
var store = {};
function useCompletion({
  api = "/api/completion",
  id,
  initialCompletion = "",
  initialInput = "",
  credentials,
  headers,
  body,
  streamProtocol,
  onFinish,
  onError,
  fetch: fetch2
} = {}) {
  var _a;
  const completionId = id || `completion-${uniqueId++}`;
  const key = `${api}|${completionId}`;
  const { data, mutate: originalMutate } = useSWRV(
    key,
    () => store[key] || initialCompletion
  );
  const { data: isLoading, mutate: mutateLoading } = useSWRV(
    `${completionId}-loading`,
    null
  );
  (_a = isLoading.value) != null ? _a : isLoading.value = false;
  data.value || (data.value = initialCompletion);
  const mutate = (data2) => {
    store[key] = data2;
    return originalMutate();
  };
  const completion = data;
  const error = (0, import_vue.ref)(void 0);
  let abortController = null;
  async function triggerRequest(prompt, options) {
    return (0, import_ai.callCompletionApi)({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...(0, import_vue.unref)(body),
        ...options == null ? void 0 : options.body
      },
      streamProtocol,
      setCompletion: mutate,
      setLoading: (loading) => mutateLoading(() => loading),
      setError: (err) => {
        error.value = err;
      },
      setAbortController: (controller) => {
        abortController = controller;
      },
      onFinish,
      onError,
      fetch: fetch2
    });
  }
  const complete = async (prompt, options) => {
    return triggerRequest(prompt, options);
  };
  const stop = () => {
    if (abortController) {
      abortController.abort();
      abortController = null;
    }
  };
  const setCompletion = (completion2) => {
    mutate(completion2);
  };
  const input = (0, import_vue.ref)(initialInput);
  const handleSubmit = (event) => {
    var _a2;
    (_a2 = event == null ? void 0 : event.preventDefault) == null ? void 0 : _a2.call(event);
    const inputValue = input.value;
    return inputValue ? complete(inputValue) : void 0;
  };
  return {
    completion,
    complete,
    error,
    stop,
    setCompletion,
    input,
    handleSubmit,
    isLoading
  };
}

// src/chat.vue.ts
var import_ai2 = require("ai");
var import_vue2 = require("vue");
var VueChatState = class {
  constructor(messages) {
    this.statusRef = (0, import_vue2.ref)("ready");
    this.errorRef = (0, import_vue2.ref)(void 0);
    this.pushMessage = (message) => {
      this.messagesRef.value = [...this.messagesRef.value, message];
    };
    this.popMessage = () => {
      this.messagesRef.value = this.messagesRef.value.slice(0, -1);
    };
    this.replaceMessage = (index, message) => {
      this.messagesRef.value[index] = { ...message };
    };
    this.snapshot = (value) => value;
    this.messagesRef = (0, import_vue2.ref)(messages != null ? messages : []);
  }
  get messages() {
    return this.messagesRef.value;
  }
  set messages(messages) {
    this.messagesRef.value = messages;
  }
  get status() {
    return this.statusRef.value;
  }
  set status(status) {
    this.statusRef.value = status;
  }
  get error() {
    return this.errorRef.value;
  }
  set error(error) {
    this.errorRef.value = error;
  }
};
var Chat = class extends import_ai2.AbstractChat {
  constructor({ messages, ...init }) {
    super({
      ...init,
      state: new VueChatState(messages)
    });
  }
};

// src/use-object.ts
var import_vue3 = require("vue");
var import_swrv2 = __toESM(require("swrv"));
var import_provider_utils = require("@ai-sdk/provider-utils");
var import_ai3 = require("ai");
var getOriginalFetch = () => fetch;
var uniqueId2 = 0;
var useSWRV2 = import_swrv2.default.default || import_swrv2.default;
var store2 = {};
var experimental_useObject = function useObject({
  api,
  id,
  schema,
  initialValue,
  fetch: fetch2,
  onError,
  onFinish,
  headers,
  credentials
}) {
  var _a;
  const completionId = id || `completion-${uniqueId2++}`;
  const key = `${api}|${completionId}`;
  const { data, mutate: originalMutate } = useSWRV2(key, () => key in store2 ? store2[key] : initialValue);
  const { data: isLoading, mutate: mutateLoading } = useSWRV2(
    `${completionId}-loading`,
    null
  );
  (_a = isLoading.value) != null ? _a : isLoading.value = false;
  data.value || (data.value = initialValue);
  const mutateObject = (value) => {
    store2[key] = value;
    return originalMutate();
  };
  const error = (0, import_vue3.ref)(void 0);
  let abortController = null;
  const stop = async () => {
    if (abortController) {
      try {
        abortController.abort();
      } catch (e) {
      } finally {
        abortController = null;
      }
    }
    await mutateLoading(() => false);
  };
  const clearObject = async () => {
    error.value = void 0;
    await mutateLoading(() => false);
    await mutateObject(void 0);
    data.value = void 0;
  };
  const clear = async () => {
    await stop();
    await clearObject();
  };
  const submit = async (input) => {
    try {
      await clearObject();
      await mutateLoading(() => true);
      abortController = new AbortController();
      const actualFetch = fetch2 != null ? fetch2 : getOriginalFetch();
      const response = await actualFetch(api, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...headers
        },
        credentials: credentials != null ? credentials : "same-origin",
        signal: abortController.signal,
        body: JSON.stringify(input)
      });
      if (!response.ok) {
        throw new Error(
          await response.text() || "Failed to fetch the response."
        );
      }
      if (!response.body) {
        throw new Error("The response body is empty.");
      }
      let accumulatedText = "";
      let latestObject = void 0;
      await response.body.pipeThrough(new TextDecoderStream()).pipeTo(
        new WritableStream({
          async write(chunk) {
            accumulatedText += chunk;
            const { value } = await (0, import_ai3.parsePartialJson)(accumulatedText);
            const currentObject = value;
            if (!(0, import_ai3.isDeepEqualData)(latestObject, currentObject)) {
              latestObject = currentObject;
              await mutateObject(currentObject);
            }
          },
          async close() {
            await mutateLoading(() => false);
            abortController = null;
            if (onFinish) {
              const validationResult = await (0, import_provider_utils.safeValidateTypes)({
                value: latestObject,
                schema: (0, import_ai3.asSchema)(schema)
              });
              onFinish(
                validationResult.success ? {
                  object: validationResult.value,
                  error: void 0
                } : { object: void 0, error: validationResult.error }
              );
            }
          }
        })
      );
    } catch (err) {
      if ((0, import_provider_utils.isAbortError)(err))
        return;
      if (onError && err instanceof Error)
        onError(err);
      await mutateLoading(() => false);
      error.value = err instanceof Error ? err : new Error(String(err));
    }
  };
  return {
    submit,
    object: data,
    error,
    isLoading,
    stop,
    clear
  };
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Chat,
  experimental_useObject,
  useCompletion
});
//# sourceMappingURL=index.js.map