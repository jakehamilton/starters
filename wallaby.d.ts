/**
 * This file is a fix for importing types into a JS file via JSDoc:
 * https://github.com/Microsoft/TypeScript/issues/8237
 **/

import wallabyjs from 'wallabyjs';

export = wallabyjs;
export as namespace wallabyjs;
