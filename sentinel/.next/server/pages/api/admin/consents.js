"use strict";(()=>{var e={};e.id=7738,e.ids=[7738],e.modules={145:e=>{e.exports=require("next/dist/compiled/next-server/pages-api.runtime.prod.js")},6005:e=>{e.exports=require("node:crypto")},6249:(e,t)=>{Object.defineProperty(t,"l",{enumerable:!0,get:function(){return function e(t,n){return n in t?t[n]:"then"in t&&"function"==typeof t.then?t.then(t=>e(t,n)):"function"==typeof t&&"default"===n?t:void 0}}})},390:(e,t,n)=>{n.r(t),n.d(t,{config:()=>c,default:()=>A,routeModule:()=>T});var r={};n.r(r),n.d(r,{default:()=>d});var a=n(1802),o=n(7153),i=n(6249),s=n(7936),E=n(4041);async function u(e){let t=function(e){let t=(e.headers.authorization||"").match(/^Bearer\s+(.+)$/i);return t?.[1]||""}(e);return t?(await (0,s.aj)(),(await (0,s.$d)(`
      SELECT u.id, u.email, u.name, u.role
      FROM app_session s
      INNER JOIN app_user u ON u.id = s.user_id
      WHERE s.token_hash = ?
        AND s.expires_at > NOW()
      ORDER BY s.created_at DESC
      LIMIT 1;
    `,[(0,E.mr)(t)])).rows[0]??null):null}async function d(e,t){if("GET"!==e.method)return t.status(405).json({ok:!1,error:"Method not allowed"});let n=await u(e);if(!n)return t.status(401).json({ok:!1,error:"Missing or invalid admin session"});if("admin"!==n.role)return t.status(403).json({ok:!1,error:"Admin access required"});await (0,s.aj)();let r=(await (0,s.$d)(`
    SELECT
      c.id,
      COALESCE(u.email, 'anonymous') as email,
      COALESCE(u.name, '') as name,
      COALESCE(u.role, 'user') as role,
      c.code_collection_point,
      c.payload,
      c.created_at
    FROM consent_submission c
    LEFT JOIN app_user u ON u.id = c.user_id
    ORDER BY c.created_at DESC
    LIMIT 500;
    `)).rows.map(e=>({id:e.id,email:e.email,name:e.name,role:"admin"===e.role?"admin":"user",code_collection_point:e.code_collection_point,payload:e.payload,created_at:String(e.created_at)}));return t.status(200).json({ok:!0,rows:r})}let A=(0,i.l)(r,"default"),c=(0,i.l)(r,"config"),T=new a.PagesAPIRouteModule({definition:{kind:o.x.PAGES_API,page:"/api/admin/consents",pathname:"/api/admin/consents",bundlePath:"",filename:""},userland:r})},4041:(e,t,n)=>{n.d(t,{JQ:()=>o,R:()=>s,mr:()=>i});var r=n(6005),a=n.n(r);function o(e=32){return a().randomBytes(e).toString("base64url")}function i(e){return a().createHash("sha256").update(e,"utf8").digest("hex")}function s(e){return e.trim().toLowerCase()}},7936:(e,t,n)=>{n.d(t,{$d:()=>u,aj:()=>d});let r=require("mysql2/promise");var a=n.n(r);let o=`
CREATE TABLE IF NOT EXISTS app_user (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) NOT NULL DEFAULT 'user',
  password_salt TEXT,
  password_hash TEXT,
  email_verified_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS email_verification_token (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  attempts INT NOT NULL DEFAULT 0,
  expires_at DATETIME NOT NULL,
  used_at DATETIME,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_verification_token_hash (token_hash),
  INDEX idx_email_verification_token_user_id (user_id),
  FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS app_session (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  token_hash VARCHAR(255) NOT NULL,
  expires_at DATETIME NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_app_session_token_hash (token_hash),
  FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS consent_collection_point (
  code VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  consents JSON NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS consent_submission (
  id VARCHAR(255) PRIMARY KEY,
  user_id VARCHAR(255),
  code_collection_point VARCHAR(255) NOT NULL,
  payload JSON NOT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_consent_submission_user_id (user_id),
  INDEX idx_consent_submission_created_at (created_at),
  FOREIGN KEY (user_id) REFERENCES app_user(id) ON DELETE SET NULL
);

INSERT IGNORE INTO consent_collection_point (code, name, consents, is_active)
VALUES (
  'cp_sentinel_demo_001',
  'Sentinel Demo Collection Point',
  '[
    {"code_consent":"MARKETING","label":"Marketing"},
    {"code_consent":"BIO_METRIK","label":"Bio Metrik"},
    {"code_consent":"DATA_ANAK","label":"Data Anak"}
  ]',
  true
);

UPDATE app_user
SET role = 'admin'
WHERE email = 'almira@gmail.com';
`,i=null,s=null;function E(e){return!!e&&["1","true","yes","on"].includes(e.toLowerCase())}async function u(e,t=[]){let[n]=await (i||(i=a().createPool(function(){let e={charset:"utf8mb4",connectionLimit:10,dateStrings:!0,enableKeepAlive:!0,queueLimit:0,supportBigNumbers:!0,timezone:"Z",waitForConnections:!0},t=process.env.DB_HOST,n=process.env.DB_NAME||process.env.DB_DATABASE,r=process.env.DB_USER||process.env.DB_USERNAME,a=process.env.DB_PASSWORD||"",o=Number(process.env.DB_PORT||"3306");if(t&&n&&r)return{...e,host:t,port:o,user:r,password:a,database:n,ssl:E(process.env.DB_SSL)?{rejectUnauthorized:!1}:void 0};let i=process.env.DATABASE_URL;if(i){let t=new URL(i);if(!["mysql:","mariadb:"].includes(t.protocol))throw Error("DATABASE_URL must use a mysql:// or mariadb:// connection string");let n=t.pathname.replace(/^\/+/,"");if(!n)throw Error("DATABASE_URL is missing the database name");return{...e,host:t.hostname,port:Number(t.port||"3306"),user:decodeURIComponent(t.username),password:decodeURIComponent(t.password),database:n,ssl:E(t.searchParams.get("ssl"))?{rejectUnauthorized:!1}:void 0}}throw Error("Missing database configuration. Set DB_HOST/DB_NAME/DB_USER or DATABASE_URL.")}())),i).query(e,t);return Array.isArray(n)?{rows:n,rowCount:n.length}:{rows:[],rowCount:n.affectedRows??0,insertId:n.insertId}}async function d(){s||(s=(async()=>{for(let e of o.split(";").map(e=>e.trim()).filter(Boolean))await u(e)})().catch(e=>{throw s=null,e})),await s}},7153:(e,t)=>{var n;Object.defineProperty(t,"x",{enumerable:!0,get:function(){return n}}),function(e){e.PAGES="PAGES",e.PAGES_API="PAGES_API",e.APP_PAGE="APP_PAGE",e.APP_ROUTE="APP_ROUTE"}(n||(n={}))},1802:(e,t,n)=>{e.exports=n(145)}};var t=require("../../../webpack-api-runtime.js");t.C(e);var n=t(t.s=390);module.exports=n})();