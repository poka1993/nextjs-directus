import directus from '@/lib/directus';
import { notFound } from 'next/navigation';
import { readItem } from '@directus/sdk/rest';
import { authentication } from '@directus/sdk';
import { cookies } from 'next/headers'

async function getPage(slug, directusAuth) {
	try {
		let request = directusAuth ?? directus;
		const page = await request.request(readItem('pages', slug));
		return page;
	} catch (error) {
		notFound();
	}
}

export default async function DynamicPage({ params }) {
	const cookiesList = cookies();
	let token = null;
	let directusAuth = null;
	const hasToken = cookiesList.has('token');
	if (hasToken) {
	  token = cookiesList.get('token').value;
	  directusAuth = directus.with(authentication('json'));
	  await directusAuth.setToken(token);    
	}
	const page = await getPage(params.slug, directusAuth);
	return (
		<div>
			<h1>{page.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: page.content }}></div>
		</div>
	);
}