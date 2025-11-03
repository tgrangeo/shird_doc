// src/use-completion.ts
import { callCompletionApi } from "ai";
import swrv from "swrv";
import { ref, unref } from "vue";
var uniqueId = 0;
var useSWRV = swrv.default || swrv;
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
  const error = ref(void 0);
  let abortController = null;
  async function triggerRequest(prompt, options) {
    return callCompletionApi({
      api,
      prompt,
      credentials,
      headers: {
        ...headers,
        ...options == null ? void 0 : options.headers
      },
      body: {
        ...unref(body),
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
  const input = ref(initialInput);
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
import {
  AbstractChat
} from "ai";
import { ref as ref2 } from "vue";
var VueChatState = class {
  constructor(messages) {
    this.statusRef = ref2("ready");
    this.errorRef = ref2(void 0);
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
    this.messagesRef = ref2(messages != null ? messages : []);
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
var Chat = class extends AbstractChat {
  constructor({ messages, ...init }) {
    super({
      ...init,
      state: new VueChatState(messages)
    });
  }
};

// src/use-object.ts
import { ref as ref3 } from "vue";
import swrv2 from "swrv";
import {
  isAbortError,
  safeValidateTypes
} from "@ai-sdk/provider-utils";
import {
  asSchema,
  isDeepEqualData,
  parsePartialJson
} from "ai";
var getOriginalFetch = () => fetch;
var uniqueId2 = 0;
var useSWRV2 = swrv2.default || swrv2;
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
  const error = ref3(void 0);
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
            const { value } = await parsePartialJson(accumulatedText);
            const currentObject = value;
            if (!isDeepEqualData(latestObject, currentObject)) {
              latestObject = currentObject;
              await mutateObject(currentObject);
            }
          },
          async close() {
            await mutateLoading(() => false);
            abortController = null;
            if (onFinish) {
              const validationResult = await safeValidateTypes({
                value: latestObject,
                schema: asSchema(schema)
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
      if (isAbortError(err))
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
export {
  Chat,
  experimental_useObject,
  useCompletion
};
//# sourceMappingURL=index.mjs.map