declare namespace Cloudflare {
  interface Env {
    PUBLIC_SITE_URL?: string;
    DB?: D1Database;
    BUCKET?: R2Bucket;
  }
}
