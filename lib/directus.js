import { createDirectus, authentication } from '@directus/sdk';
import { rest, login } from '@directus/sdk/rest';
import Cookies from 'js-cookie';

// odpalenie nmp run dev
let directus = createDirectus('http://127.0.0.1:8055/').with(rest());
// directus = directus.with(authentication('json'));


// console.log(token);
// const directus = createDirectus('http://127.0.0.1:8055/').with(authentication()).with(rest());
// const result = await directus.login('userek@gmail.com', 'Hasło123');

export default directus;