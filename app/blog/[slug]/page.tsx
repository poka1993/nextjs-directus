import directus from '@/lib/directus';
import { notFound } from 'next/navigation';
import { readItem } from '@directus/sdk/rest';
import { authentication } from '@directus/sdk';
import { cookies } from 'next/headers'

async function getPost(slug, directusAuth) {
	try {
		let request = directusAuth ?? directus;
		const post = await request.request(
			readItem('posts', slug, {
				fields: ['*', { relation: ['*'] }],
			})
		);

		return post;
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
	const post = await getPost(params.slug, directusAuth);
    console.log(post);
	return (
		<>
			<img src={`${directus.url}assets/${post.image}?width=600`} alt="" />
			<h1>{post.title}</h1>
			<div dangerouslySetInnerHTML={{ __html: post.content }}></div>
		</>
	);
}