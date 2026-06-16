type LogLevel = "info" | "warn" | "error";

function log(level: LogLevel, message: string, meta?: object) {
  const timestamp = new Date().toISOString();
  const entry = { timestamp, level, message, ...meta };

  if (level === "error") {
    console.error(JSON.stringify(entry));
  } else if (level === "warn") {
    console.warn(JSON.stringify(entry));
  } else {
    console.log(JSON.stringify(entry));
  }
}

export const logger = {
  info(message: string, meta?: object) {
    log("info", message, meta);
  },
  warn(message: string, meta?: object) {
    log("warn", message, meta);
  },
  error(message: string, meta?: object) {
    log("error", message, meta);
  },
};
