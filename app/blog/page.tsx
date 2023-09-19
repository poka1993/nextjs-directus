import directus from '@/lib/directus';
import { readItems } from '@directus/sdk/rest';
export const fetchCache = "force-no-store";
import { authentication } from '@directus/sdk';
import { cookies } from 'next/headers'

async function getPosts(directusAuth) {
    let request = directusAuth ?? directus;
	return request.request(
		readItems('posts', {
			fields: ['slug', 'title', 'publish_date', { author: ['name'] }],
			sort: ['-publish_date'],
		})
	);
}

export const metadata = {
    title: 'Blog',
  }

export default async function DynamicPage() {
    const cookiesList = cookies();
	let token = null;
	let directusAuth = null;
	const hasToken = cookiesList.has('token');
	if (hasToken) {
	  token = cookiesList.get('token').value;
	  directusAuth = directus.with(authentication('json'));
	  await directusAuth.setToken(token);    
	}
	const posts = await getPosts(directusAuth);
	return (
        <div>
            <h1>Blog</h1>
            <ul>
                {posts.map((post) => {
                    return (
                        <li key={post.slug}>
                            <a href={`/blog/${post.slug}`}>
                                <h2>{post.title}</h2>
                            </a>
                            <span>
                                {post.publish_date} &bull; {post.author.name}
                            </span>
                        </li>
                    );
                })}
            </ul>
        </div>
	);
}