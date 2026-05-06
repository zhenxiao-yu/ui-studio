import fs from "node:fs";

const normalizeReadlinkError = (error) => {
  if (error?.code === "EISDIR") {
    error.code = "EINVAL";
  }

  return error;
};

if (!fs.__uiStudioReadlinkPatch) {
  const readlink = fs.readlink.bind(fs);
  const readlinkSync = fs.readlinkSync.bind(fs);
  const readlinkPromise = fs.promises.readlink.bind(fs.promises);

  fs.readlink = (path, options, callback) => {
    if (typeof options === "function") {
      callback = options;
      options = undefined;
    }

    const onReadlink = (error, linkString) => {
      callback?.(normalizeReadlinkError(error), linkString);
    };

    return options === undefined
      ? readlink(path, onReadlink)
      : readlink(path, options, onReadlink);
  };

  fs.readlinkSync = (path, options) => {
    try {
      return readlinkSync(path, options);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };

  fs.promises.readlink = async (path, options) => {
    try {
      return await readlinkPromise(path, options);
    } catch (error) {
      throw normalizeReadlinkError(error);
    }
  };

  fs.__uiStudioReadlinkPatch = true;
}

const patchReadlinkApi = (target) => {
  if (!target || target.__uiStudioReadlinkPatch) return;

  if (typeof target.readlink === "function") {
    const readlink = target.readlink.bind(target);
    target.readlink = (path, options, callback) => {
      if (typeof options === "function") {
        callback = options;
        options = undefined;
      }

      const onReadlink = (error, linkString) => {
        callback?.(normalizeReadlinkError(error), linkString);
      };

      return options === undefined
        ? readlink(path, onReadlink)
        : readlink(path, options, onReadlink);
    };
  }

  if (typeof target.readlinkSync === "function") {
    const readlinkSync = target.readlinkSync.bind(target);
    target.readlinkSync = (path, options) => {
      try {
        return readlinkSync(path, options);
      } catch (error) {
        throw normalizeReadlinkError(error);
      }
    };
  }

  target.__uiStudioReadlinkPatch = true;
};

class NormalizeReadlinkEisdirPlugin {
  apply(compiler) {
    compiler.hooks.afterEnvironment.tap("NormalizeReadlinkEisdirPlugin", () => {
      patchReadlinkApi(compiler.inputFileSystem);
      patchReadlinkApi(compiler.inputFileSystem?.fileSystem);
    });
  }
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.symlinks = false;
    config.snapshot = {
      ...config.snapshot,
      managedPaths: [],
    };
    config.plugins.push(new NormalizeReadlinkEisdirPlugin());

    // Exclude certain modules from the webpack bundle
    config.externals.push({
      "utf-8-validate": "commonjs utf-8-validate",
      bufferutil: "commonjs bufferutil",
      canvas: "commonjs canvas",
    });

    // Uncomment the following line for debugging webpack cache issues
    // config.infrastructureLogging = { debug: /PackFileCache/ };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
};

export default nextConfig;
