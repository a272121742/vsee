import SHA1 from 'crypto-js/sha1';
import BASE64 from 'crypto-js/enc-base64';
import UTF8 from 'crypto-js/enc-utf8';
import AES from 'crypto-js/aes';
import { string2any, stringify } from '@util/data-helper.js';
import MD5 from 'crypto-js/md5';

const PRIVATE_KEY = '0F6A0E1480C044AD7B175872B7824829';

function sha1 (value) {
  return SHA1(value).toString();
}

function md5 (value) {
  return MD5(value, UTF8).toString();
}

function base64encode (value) {
  return BASE64.stringify(UTF8.parse(stringify(value))).toString();
}

function base64decode (value) {
  return string2any(BASE64.parse(value || '').toString(UTF8));
}

function aesEncode (value) {
  return AES.encrypt(stringify(value), PRIVATE_KEY).toString();
}

function aesDecode (value) {
  return string2any(AES.decrypt(value, PRIVATE_KEY).toString(UTF8));
}

export {
  sha1, md5, base64encode, base64decode, aesEncode, aesDecode,
};
