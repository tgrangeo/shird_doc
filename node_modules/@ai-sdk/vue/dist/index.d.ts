import { CompletionRequestOptions, UseCompletionOptions, UIMessage, AbstractChat, ChatInit, Schema, DeepPartial } from 'ai';
export { UseCompletionOptions } from 'ai';
import { Ref } from 'vue';
import { FetchFunction, InferSchema } from '@ai-sdk/provider-utils';
import * as z3 from 'zod/v3';
import * as z4 from 'zod/v4';

type UseCompletionHelpers = {
    /** The current completion result */
    completion: Ref<string>;
    /** The error object of the API request */
    error: Ref<undefined | Error>;
    /**
     * Send a new prompt to the API endpoint and update the completion state.
     */
    complete: (prompt: string, options?: CompletionRequestOptions) => Promise<string | null | undefined>;
    /**
     * Abort the current API request but keep the generated tokens.
     */
    stop: () => void;
    /**
     * Update the `completion` state locally.
     */
    setCompletion: (completion: string) => void;
    /** The current value of the input */
    input: Ref<string>;
    /**
     * Form submission handler to automatically reset input and append a user message
     * @example
     * ```jsx
     * <form @submit="handleSubmit">
     *  <input @change="handleInputChange" v-model="input" />
     * </form>
     * ```
     */
    handleSubmit: (event?: {
        preventDefault?: () => void;
    }) => void;
    /** Whether the API request is in progress */
    isLoading: Ref<boolean | undefined>;
};
declare function useCompletion({ api, id, initialCompletion, initialInput, credentials, headers, body, streamProtocol, onFinish, onError, fetch, }?: UseCompletionOptions): UseCompletionHelpers;

declare class Chat<UI_MESSAGE extends UIMessage> extends AbstractChat<UI_MESSAGE> {
    constructor({ messages, ...init }: ChatInit<UI_MESSAGE>);
}

type Experimental_UseObjectOptions<SCHEMA extends z4.core.$ZodType | z3.Schema | Schema, RESULT> = {
    /** API endpoint that streams JSON chunks matching the schema */
    api: string;
    /** Zod or AI schema that defines the final object shape */
    schema: SCHEMA;
    /** Shared state key. If omitted a random one is generated */
    id?: string;
    /** Initial partial value */
    initialValue?: DeepPartial<RESULT>;
    /** Optional custom fetch implementation */
    fetch?: FetchFunction;
    /** Called when stream ends */
    onFinish?: (event: {
        object: RESULT | undefined;
        error: Error | undefined;
    }) => Promise<void> | void;
    /** Called on error */
    onError?: (error: Error) => void;
    /** Extra request headers */
    headers?: Record<string, string> | Headers;
    /** Request credentials mode. Defaults to 'same-origin' if omitted */
    credentials?: RequestCredentials;
};
type Experimental_UseObjectHelpers<RESULT, INPUT> = {
    /** POST the input and start streaming */
    submit: (input: INPUT) => void;
    /** Current partial object, updated as chunks arrive */
    object: Ref<DeepPartial<RESULT> | undefined>;
    /** Latest error if any */
    error: Ref<Error | undefined>;
    /** Loading flag for the in-flight request */
    isLoading: Ref<boolean | undefined>;
    /** Abort the current request. Keeps current partial object. */
    stop: () => void;
    /** Abort and clear all state */
    clear: () => void;
};
declare const experimental_useObject: <SCHEMA extends z4.core.$ZodType | z3.Schema | Schema, RESULT = InferSchema<SCHEMA>, INPUT = any>({ api, id, schema, initialValue, fetch, onError, onFinish, headers, credentials, }: Experimental_UseObjectOptions<SCHEMA, RESULT>) => Experimental_UseObjectHelpers<RESULT, INPUT>;

export { Chat, Experimental_UseObjectHelpers, Experimental_UseObjectOptions, UseCompletionHelpers, experimental_useObject, useCompletion };
