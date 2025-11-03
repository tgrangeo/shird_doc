import { fork } from 'node:child_process';
import process from 'node:process';
import { defineCommand } from 'citty';
import { isSocketSupported } from 'get-port-please';
import { listen } from 'listhen';
import { getArgs, parseArgs } from 'listhen/cli';
import { resolve } from 'pathe';
import { satisfies } from 'semver';
import { isWindows, isTest, isBun, isDeno } from 'std-env';
import { i as initialize, r as resolveLoadingTemplate, a as renderError, b as isSocketURL, p as parseSocketURL } from './index.mjs';
import { request } from 'node:http';
import { Readable } from 'node:stream';
import { pipeline } from 'node:stream/promises';
import { NodeRequest } from 'srvx/node';
import { Agent } from 'undici';
import { connect } from 'node:net';
import { a as showVersionsFromConfig } from '../shared/cli.C3Xt5_9L.mjs';
import { o as overrideEnv } from '../shared/cli.BEUGgaW4.mjs';
import { l as loadKit } from '../shared/cli.qKvs7FJ2.mjs';
import { l as logger } from '../shared/cli.B9AmABr3.mjs';
import { e as extendsArgs, b as envNameArgs, l as legacyRootDirArgs, d as dotEnvArgs, a as logLevelArgs, c as cwdArgs } from '../shared/cli.DSCVCUX6.mjs';
import 'defu';
import 'node:events';
import 'node:fs';
import 'node:fs/promises';
import 'node:url';
import 'exsolve';
import 'h3';
import 'perfect-debounce';
import 'ufo';
import '../shared/cli.pLQ0oPGc.mjs';
import '../shared/cli.At9IMXtr.mjs';
import 'ohash';
import 'youch';
import 'consola/utils';
import 'consola';
import 'node:path';

function fetchSocketOptions(socketPath) {
  if ("Bun" in globalThis) {
    return { unix: socketPath };
  }
  if ("Deno" in globalThis) {
    return {
      client: globalThis.Deno.createHttpClient({
        transport: "unix",
        path: socketPath
      })
    };
  }
  return {
    dispatcher: new Agent({ connect: { socketPath } })
  };
}
function fetchWithNodeHttp(socketPath, url, init) {
  return new Promise((resolve, reject) => {
    const headers = {};
    if (init?.headers) {
      if (init.headers instanceof Headers) {
        for (const [key, value] of init.headers.entries()) {
          headers[key] = value;
        }
      } else if (Array.isArray(init.headers)) {
        for (const [key, value] of init.headers) {
          headers[key] = value;
        }
      } else {
        Object.assign(headers, init.headers);
      }
    }
    const req = request({
      socketPath,
      path: url.pathname + url.search,
      method: init?.method || "GET",
      headers
    }, (res) => {
      const responseHeaders = new Headers();
      for (const [key, value] of Object.entries(res.headers)) {
        if (value !== void 0) {
          if (key.toLowerCase() === "set-cookie") {
            if (Array.isArray(value)) {
              for (const cookie of value) {
                responseHeaders.append("set-cookie", cookie);
              }
            } else {
              responseHeaders.append("set-cookie", value);
            }
          } else {
            responseHeaders.set(key, Array.isArray(value) ? value.join(", ") : value);
          }
        }
      }
      res.on("error", (err) => {
        if (err && err.message && !err.message.includes("aborted")) {
          reject(err);
        }
      });
      resolve({
        status: res.statusCode || 200,
        statusText: res.statusMessage || "OK",
        headers: responseHeaders,
        body: res
      });
    });
    req.on("error", reject);
    if (init?.body) {
      if (typeof init.body === "string") {
        req.write(init.body);
      } else if (init.body instanceof ReadableStream) {
        const reader = init.body.getReader();
        const pump = async () => {
          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                break;
              }
              req.write(value);
            }
            req.end();
          } catch (err) {
            req.destroy(err);
          }
        };
        pump();
        return;
      }
    }
    req.end();
  });
}
function fetchAddress(addr, input, inputInit) {
  let url;
  let init;
  if (input instanceof Request) {
    url = new URL(input.url);
    init = {
      method: input.method,
      headers: input.headers,
      body: input.body,
      ...inputInit
    };
  } else {
    url = new URL(input);
    init = inputInit;
  }
  init = {
    duplex: "half",
    redirect: "manual",
    ...init
  };
  if (addr.socketPath && isWindows) {
    url.protocol = "http:";
    return fetchWithNodeHttp(addr.socketPath, url, init);
  }
  if (addr.socketPath) {
    url.protocol = "http:";
    return fetch(url, {
      ...init,
      ...fetchSocketOptions(addr.socketPath)
    });
  }
  const origin = `http://${addr.host}${addr.port ? `:${addr.port}` : ""}`;
  const outURL = new URL(url.pathname + url.search, origin);
  return fetch(outURL, init);
}
async function sendWebResponse(res, webResponse) {
  res.statusCode = webResponse.status;
  res.statusMessage = webResponse.statusText;
  const setCookies = webResponse.headers.getSetCookie?.();
  if (setCookies && setCookies.length > 0) {
    for (const cookie of setCookies) {
      res.appendHeader("set-cookie", cookie);
    }
  }
  for (const [key, value] of webResponse.headers.entries()) {
    if (key.toLowerCase() !== "set-cookie") {
      res.setHeader(key, value);
    }
  }
  if (webResponse.body) {
    if (webResponse.body instanceof Readable) {
      try {
        await pipeline(webResponse.body, res, { end: true });
      } catch (error) {
        if (!res.writableEnded) {
          res.end();
        }
        throw error;
      }
      return;
    }
    const reader = webResponse.body.getReader();
    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        if (!res.write(value)) {
          await new Promise((resolve) => res.once("drain", resolve));
        }
      }
    } catch (error) {
      reader.releaseLock();
      if (!res.writableEnded) {
        res.end();
      }
      throw error;
    } finally {
      reader.releaseLock();
    }
  }
  res.end();
}
function createFetchHandler(getAddress, onError, onLoading) {
  return async (req, res) => {
    try {
      const address = getAddress();
      if (!address) {
        await onLoading(req, res);
        return;
      }
      const isWebSocketUpgrade = req.headers.upgrade?.toLowerCase() === "websocket";
      if (isWebSocketUpgrade) {
        res.statusCode = 426;
        res.setHeader("Connection", "close");
        res.end("Upgrade Required");
        return;
      }
      const webRequest = new NodeRequest({ req, res });
      const webResponse = await fetchAddress(address, webRequest);
      await sendWebResponse(res, webResponse);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      const isWebSocketError = errorMessage.toLowerCase().includes("websocket") || errorMessage.toLowerCase().includes("upgrade");
      if (!isWebSocketError) {
        console.error("Fetch handler error:", error);
      }
      if (!res.headersSent) {
        await onError(req, res);
      } else if (!res.writableEnded) {
        res.end();
      }
    }
  };
}

function connectToChildSocket(socketPath, req, clientSocket, head) {
  const childSocket = connect(socketPath);
  let isConnected = false;
  childSocket.on("error", (error) => {
    const errorMessage = error.message || "";
    if (!errorMessage.includes("ECONNRESET") && !errorMessage.includes("EPIPE") && !errorMessage.includes("premature close")) {
      console.error("Child socket connection error:", error);
    }
    if (!clientSocket.destroyed) {
      clientSocket.destroy();
    }
  });
  clientSocket.on("error", (error) => {
    const errorMessage = error.message || "";
    if (!errorMessage.includes("ECONNRESET") && !errorMessage.includes("EPIPE") && !isConnected) {
      console.error("Client socket error:", error);
    }
    if (!childSocket.destroyed) {
      childSocket.destroy();
    }
  });
  childSocket.on("connect", () => {
    isConnected = true;
    const requestLine = `${req.method} ${req.url} HTTP/${req.httpVersion}\r
`;
    const headers = Object.entries(req.headers).map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}: ${v}`).join("\r\n");
      }
      return `${key}: ${value}`;
    }).join("\r\n");
    const httpRequest = `${requestLine}${headers}\r
\r
`;
    childSocket.write(httpRequest);
    if (head && head.length > 0) {
      childSocket.write(head);
    }
    clientSocket.pipe(childSocket);
    childSocket.pipe(clientSocket);
  });
  const cleanup = () => {
    if (!clientSocket.destroyed) {
      clientSocket.destroy();
    }
    if (!childSocket.destroyed) {
      childSocket.destroy();
    }
  };
  clientSocket.on("close", cleanup);
  childSocket.on("close", cleanup);
}
function connectToChildNetwork(host, port, req, clientSocket, head) {
  const childSocket = connect(port, host);
  let isConnected = false;
  childSocket.on("error", (error) => {
    const errorMessage = error.message || "";
    if (!errorMessage.includes("ECONNRESET") && !errorMessage.includes("EPIPE") && !errorMessage.includes("premature close")) {
      console.error("Child network connection error:", error);
    }
    if (!clientSocket.destroyed) {
      clientSocket.destroy();
    }
  });
  clientSocket.on("error", (error) => {
    const errorMessage = error.message || "";
    if (!errorMessage.includes("ECONNRESET") && !errorMessage.includes("EPIPE") && !isConnected) {
      console.error("Client socket error:", error);
    }
    if (!childSocket.destroyed) {
      childSocket.destroy();
    }
  });
  childSocket.on("connect", () => {
    isConnected = true;
    const requestLine = `${req.method} ${req.url} HTTP/${req.httpVersion}\r
`;
    const headers = Object.entries(req.headers).map(([key, value]) => {
      if (Array.isArray(value)) {
        return value.map((v) => `${key}: ${v}`).join("\r\n");
      }
      return `${key}: ${value}`;
    }).join("\r\n");
    const httpRequest = `${requestLine}${headers}\r
\r
`;
    childSocket.write(httpRequest);
    if (head && head.length > 0) {
      childSocket.write(head);
    }
    clientSocket.pipe(childSocket);
    childSocket.pipe(clientSocket);
  });
  const cleanup = () => {
    if (!clientSocket.destroyed) {
      clientSocket.destroy();
    }
    if (!childSocket.destroyed) {
      childSocket.destroy();
    }
  };
  clientSocket.on("close", cleanup);
  childSocket.on("close", cleanup);
}

const startTime = Date.now();
const forkSupported = !isTest && (!isBun || isBunForkSupported());
const listhenArgs = getArgs();
const command = defineCommand({
  meta: {
    name: "dev",
    description: "Run Nuxt development server"
  },
  args: {
    ...cwdArgs,
    ...logLevelArgs,
    ...dotEnvArgs,
    ...legacyRootDirArgs,
    ...envNameArgs,
    ...extendsArgs,
    clear: {
      type: "boolean",
      description: "Clear console on restart",
      default: false
    },
    fork: {
      type: "boolean",
      description: forkSupported ? "Disable forked mode" : "Enable forked mode",
      negativeDescription: "Disable forked mode",
      default: forkSupported,
      alias: ["f"]
    },
    ...{
      ...listhenArgs,
      "port": {
        ...listhenArgs.port,
        description: "Port to listen on (default: `NUXT_PORT || NITRO_PORT || PORT || nuxtOptions.devServer.port`)",
        alias: ["p"]
      },
      "open": {
        ...listhenArgs.open,
        alias: ["o"],
        default: false
      },
      "host": {
        ...listhenArgs.host,
        alias: ["h"],
        description: "Host to listen on (default: `NUXT_HOST || NITRO_HOST || HOST || nuxtOptions.devServer?.host`)"
      },
      "clipboard": { ...listhenArgs.clipboard, default: false },
      "https.domains": {
        ...listhenArgs["https.domains"],
        description: "Comma separated list of domains and IPs, the autogenerated certificate should be valid for (https: true)"
      }
    },
    sslCert: {
      type: "string",
      description: "(DEPRECATED) Use `--https.cert` instead."
    },
    sslKey: {
      type: "string",
      description: "(DEPRECATED) Use `--https.key` instead."
    }
  },
  async run(ctx) {
    overrideEnv("development");
    const cwd = resolve(ctx.args.cwd || ctx.args.rootDir);
    const { loadNuxtConfig } = await loadKit(cwd);
    const nuxtOptions = await loadNuxtConfig({
      cwd,
      dotenv: { cwd, fileName: ctx.args.dotenv },
      envName: ctx.args.envName,
      // c12 will fall back to NODE_ENV
      overrides: {
        dev: true,
        logLevel: ctx.args.logLevel,
        ...ctx.args.extends && { extends: ctx.args.extends },
        ...ctx.data?.overrides
      }
    });
    showVersionsFromConfig(cwd, nuxtOptions);
    const listenOptions = resolveListenOptions(nuxtOptions, ctx.args);
    if (!ctx.args.fork) {
      const { listener, close: close2 } = await initialize({
        cwd,
        args: ctx.args,
        hostname: listenOptions.hostname,
        public: listenOptions.public,
        publicURLs: void 0,
        proxy: {
          https: listenOptions.https
        }
      }, { data: ctx.data }, listenOptions);
      return {
        listener,
        async close() {
          await close2();
          await listener.close();
        }
      };
    }
    const devHandler = await createDevHandler(cwd, nuxtOptions, listenOptions);
    const nuxtSocketEnv = process.env.NUXT_SOCKET ? process.env.NUXT_SOCKET === "1" : void 0;
    const useSocket = nuxtSocketEnv ?? (nuxtOptions._majorVersion === 4 && await isSocketSupported());
    const urls = await devHandler.listener.getURLs();
    const { onRestart, onReady, close } = await initialize({
      cwd,
      args: ctx.args,
      hostname: listenOptions.hostname,
      public: listenOptions.public,
      publicURLs: urls.map((r) => r.url),
      proxy: {
        url: devHandler.listener.url,
        urls,
        https: devHandler.listener.https,
        addr: devHandler.listener.address
      }
      // if running with nuxt v4 or `NUXT_SOCKET=1`, we use the socket listener
      // otherwise pass 'true' to listen on a random port instead
    }, {}, useSocket ? void 0 : true);
    onReady((address) => devHandler.setAddress(address));
    const fork2 = startSubprocess(cwd, ctx.args, ctx.rawArgs, listenOptions);
    onRestart(async (devServer) => {
      const [subprocess] = await Promise.all([
        fork2,
        devServer.close().catch(() => {
        })
      ]);
      await subprocess.initialize(devHandler, useSocket);
    });
    return {
      listener: devHandler.listener,
      async close() {
        await close();
        const subprocess = await fork2;
        subprocess.kill(0);
        await devHandler.listener.close();
      }
    };
  }
});
async function createDevHandler(cwd, nuxtOptions, listenOptions) {
  let loadingMessage = "Nuxt dev server is starting...";
  let error;
  let address;
  let loadingTemplate = nuxtOptions.devServer.loadingTemplate;
  const fetchHandler = createFetchHandler(
    () => {
      if (!address) {
        return void 0;
      }
      if (isSocketURL(address)) {
        const { socketPath } = parseSocketURL(address);
        return { socketPath };
      }
      try {
        const url = new URL(address);
        return {
          host: url.hostname,
          port: Number.parseInt(url.port) || 80
        };
      } catch {
        return void 0;
      }
    },
    // Error handler
    async (req, res) => {
      renderError(req, res, error);
    },
    // Loading handler
    async (req, res) => {
      if (res.headersSent) {
        if (!res.writableEnded) {
          res.end();
        }
        return;
      }
      res.statusCode = 503;
      res.setHeader("Content-Type", "text/html");
      res.setHeader("Cache-Control", "no-store");
      if (loadingTemplate) {
        res.end(loadingTemplate({ loading: loadingMessage }));
        return;
      }
      async function resolveLoadingMessage() {
        loadingTemplate = await resolveLoadingTemplate(cwd);
        res.end(loadingTemplate({ loading: loadingMessage }));
      }
      return resolveLoadingMessage();
    }
  );
  const listener = await listen(fetchHandler, listenOptions);
  listener.server.on("upgrade", (req, socket, head) => {
    if (!address) {
      if (!socket.destroyed) {
        socket.end();
      }
      return;
    }
    if (isSocketURL(address)) {
      const { socketPath } = parseSocketURL(address);
      connectToChildSocket(socketPath, req, socket, head);
    } else {
      try {
        const url = new URL(address);
        const host = url.hostname;
        const port = Number.parseInt(url.port) || 80;
        connectToChildNetwork(host, port, req, socket, head);
      } catch {
        if (!socket.destroyed) {
          socket.end();
        }
      }
    }
  });
  return {
    listener,
    setAddress: (_addr) => {
      address = _addr;
    },
    setLoadingMessage: (_msg) => {
      loadingMessage = _msg;
    },
    setError: (_error) => {
      error = _error;
    },
    clearError() {
      error = void 0;
    }
  };
}
async function startSubprocess(cwd, args, rawArgs, listenOptions) {
  let childProc;
  let devHandler;
  let ready;
  const kill = (signal) => {
    if (childProc) {
      childProc.kill(signal === 0 && isDeno ? "SIGTERM" : signal);
      childProc = void 0;
    }
  };
  async function initialize2(handler, socket) {
    devHandler = handler;
    const urls = await devHandler.listener.getURLs();
    await ready;
    childProc.send({
      type: "nuxt:internal:dev:context",
      socket,
      context: {
        cwd,
        args,
        hostname: listenOptions.hostname,
        public: listenOptions.public,
        publicURLs: urls.map((r) => r.url),
        proxy: {
          url: devHandler.listener.url,
          urls,
          https: devHandler.listener.https
        }
      }
    });
  }
  async function restart() {
    devHandler?.clearError();
    if (process.platform === "win32") {
      kill("SIGTERM");
    } else {
      kill("SIGHUP");
    }
    childProc = fork(globalThis.__nuxt_cli__.devEntry, rawArgs, {
      execArgv: ["--enable-source-maps", process.argv.find((a) => a.includes("--inspect"))].filter(Boolean),
      env: {
        ...process.env,
        __NUXT__FORK: "true"
      }
    });
    childProc.on("close", (errorCode) => {
      if (errorCode) {
        process.exit(errorCode);
      }
    });
    ready = new Promise((resolve2, reject) => {
      childProc.on("error", reject);
      childProc.on("message", (message) => {
        if (message.type === "nuxt:internal:dev:fork-ready") {
          resolve2();
        } else if (message.type === "nuxt:internal:dev:ready") {
          devHandler.setAddress(message.address);
          if (startTime) {
            logger.debug(`Dev server ready for connections in ${Date.now() - startTime}ms`);
          }
        } else if (message.type === "nuxt:internal:dev:loading") {
          devHandler.setAddress(void 0);
          devHandler.setLoadingMessage(message.message);
          devHandler.clearError();
        } else if (message.type === "nuxt:internal:dev:loading:error") {
          devHandler.setAddress(void 0);
          devHandler.setError(message.error);
        } else if (message.type === "nuxt:internal:dev:restart") {
          restart();
        } else if (message.type === "nuxt:internal:dev:rejection") {
          logger.info(`Restarting Nuxt due to error: \`${message.message}\``);
          restart();
        }
      });
    });
  }
  for (const signal of [
    "exit",
    "SIGTERM",
    "SIGINT",
    "SIGQUIT"
  ]) {
    process.once(signal, () => {
      kill(signal === "exit" ? 0 : signal);
    });
  }
  await restart();
  return {
    initialize: initialize2,
    restart,
    kill
  };
}
function resolveListenOptions(nuxtOptions, args) {
  const _port = args.port ?? args.p ?? process.env.NUXT_PORT ?? process.env.NITRO_PORT ?? process.env.PORT ?? nuxtOptions.devServer.port;
  const _hostname = typeof args.host === "string" ? args.host : args.host === true ? "" : process.env.NUXT_HOST ?? process.env.NITRO_HOST ?? process.env.HOST ?? (nuxtOptions.devServer?.host || void 0) ?? void 0;
  const _public = args.public ?? (_hostname && !["localhost", "127.0.0.1", "::1"].includes(_hostname)) ? true : void 0;
  const _httpsCert = args["https.cert"] || args.sslCert || process.env.NUXT_SSL_CERT || process.env.NITRO_SSL_CERT || typeof nuxtOptions.devServer.https !== "boolean" && nuxtOptions.devServer.https && "cert" in nuxtOptions.devServer.https && nuxtOptions.devServer.https.cert || "";
  const _httpsKey = args["https.key"] || args.sslKey || process.env.NUXT_SSL_KEY || process.env.NITRO_SSL_KEY || typeof nuxtOptions.devServer.https !== "boolean" && nuxtOptions.devServer.https && "key" in nuxtOptions.devServer.https && nuxtOptions.devServer.https.key || "";
  const _httpsPfx = args["https.pfx"] || typeof nuxtOptions.devServer.https !== "boolean" && nuxtOptions.devServer.https && "pfx" in nuxtOptions.devServer.https && nuxtOptions.devServer.https.pfx || "";
  const _httpsPassphrase = args["https.passphrase"] || typeof nuxtOptions.devServer.https !== "boolean" && nuxtOptions.devServer.https && "passphrase" in nuxtOptions.devServer.https && nuxtOptions.devServer.https.passphrase || "";
  const httpsEnabled = !!(args.https ?? nuxtOptions.devServer.https);
  const _listhenOptions = parseArgs({
    ...args,
    "open": args.o || args.open,
    "https": httpsEnabled,
    "https.cert": _httpsCert,
    "https.key": _httpsKey,
    "https.pfx": _httpsPfx,
    "https.passphrase": _httpsPassphrase
  });
  const httpsOptions = httpsEnabled && {
    ...nuxtOptions.devServer.https,
    ..._listhenOptions.https
  };
  return {
    ..._listhenOptions,
    port: _port,
    hostname: _hostname,
    public: _public,
    https: httpsOptions,
    baseURL: nuxtOptions.app.baseURL.startsWith("./") ? nuxtOptions.app.baseURL.slice(1) : nuxtOptions.app.baseURL
  };
}
function isBunForkSupported() {
  const bunVersion = globalThis.Bun.version;
  return satisfies(bunVersion, ">=1.2");
}

export { command as default };
