"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CacheKeys = exports.RedisKeys = void 0;
var RedisKeys;
(function (RedisKeys) {
    RedisKeys["AccessIp"] = "access_ip";
    RedisKeys["Like"] = "like";
    RedisKeys["Read"] = "read";
    RedisKeys["LoginRecord"] = "login_record";
    RedisKeys["MaxOnlineCount"] = "max_online_count";
    RedisKeys["IpInfoMap"] = "ip_info_map";
    RedisKeys["LikeSite"] = "like_site";
    RedisKeys["AdminPage"] = "admin_next_index_entry";
    RedisKeys["ConfigCache"] = "config_cache";
    RedisKeys["PTYSession"] = "pty_session";
    RedisKeys["HTTPCache"] = "http_cache";
    RedisKeys["SnippetCache"] = "snippet_cache";
    RedisKeys["ServerlessStorage"] = "serverless_storage";
    RedisKeys["JWTStore"] = "jwt_store";
})(RedisKeys = exports.RedisKeys || (exports.RedisKeys = {}));
var CacheKeys;
(function (CacheKeys) {
    CacheKeys["AggregateCatch"] = "mx-api-cache:aggregate_catch";
    CacheKeys["SiteMapCatch"] = "mx-api-cache:aggregate_sitemap_catch";
    CacheKeys["SiteMapXmlCatch"] = "mx-api-cache:aggregate_sitemap_xml_catch";
    CacheKeys["RSS"] = "mx-api-cache:rss";
    CacheKeys["RSSXmlCatch"] = "mx-api-cache:rss_xml_catch";
})(CacheKeys = exports.CacheKeys || (exports.CacheKeys = {}));
