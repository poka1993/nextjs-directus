import directus from '../lib/directus';
import { readItems, readMe } from '@directus/sdk/rest';
import { authentication } from '@directus/sdk';
import { cookies } from 'next/headers'

export const fetchCache = "force-no-store";

async function getGlobals(directusAuth) {
	let request = directusAuth ?? directus;
	return request.request(
		readItems('global'),		
	);
}

export default async function HomePage() {
	const cookiesList = cookies();
	let token = null;
	let directusAuth = null;
	const hasToken = cookiesList.has('token');
	if (hasToken) {
	  token = cookiesList.get('token').value;
	  directusAuth = directus.with(authentication('json'));
	  await directusAuth.setToken(token);    
	}
	const global = await getGlobals(directusAuth);
	return (
		<div>
			<h1>{global[0].title}</h1>
			<p>{global[0].description}</p>

			<a href="https://docs.directus.io/guides/headless-cms/build-static-website/next-13.html">Link do dokumentacji</a>
		</div>
	);
}