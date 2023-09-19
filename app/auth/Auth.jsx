'use client'
import { createDirectus, authentication } from '@directus/sdk';
import directus from '@/lib/directus';
import { readItems, readMe } from '@directus/sdk/rest';
import {useState, use} from "react";
import Cookies from 'js-cookie';

export const fetchCache = "force-no-store";

export default function Auth(data) {
  let directusAuth = directus.with(authentication('json'));
  const [token, setToken] = useState(Boolean(data.token) ? data.token.value : null);
  const [isLogged, setIsLogged] = useState(false);
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(data.user);
  const [error, setError] = useState(null);
  
  if (token && !isLogged) {
    async function setAuth() {
      const result = await directus.request(
        readMe({
          fields: ['*'],
        })
      );
      setUser(result);
    }
    setIsLogged(true);
    setAuth();
  }

  async function getAuth(event) {
    event.preventDefault();

    try {
      const auth = await directusAuth.login(login, password);
      console.log(auth);
    } catch (error) {
      return setError('Błędny login lub hasło.');
    }

    const auth2 = await directusAuth.getToken('');
    const auth3 = await directusAuth.setToken(auth2);
    Cookies.set('token', auth2, { expires: 1 });

    const result = await directusAuth.request(
      readMe({
        fields: ['*'],
      })
    );
    setUser(result);
    // https://docs.directus.io/reference/system/users.html#users -- dokumentacja
  }

  async function logout() {
    setUser(null);
    setIsLogged(false);
    setToken(null);
    Cookies.remove('token');
    await directusAuth.logout();
  }

	return (
        Boolean(!user) ?
        <div className="min-h-full flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <form className="mt-8 space-y-6" method="post" onSubmit={(e) => getAuth(e)}>
            <input name="csrfToken" type="hidden" />
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email:
                </label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Email address"
                  onChange={(e) => setLogin(e.target.value)}
                  value={login}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Hasło:
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>
            </div>
            {error}
            <br />
            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Zaloguj się
              </button>
            </div>
          </form>
        </div>
      </div> :
      <div>Zalogowany jako {user.first_name}<br /><br />
        <button onClick={() => logout()}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Wyloguj się
        </button></div>
      
	);
}


// https://www.youtube.com/watch?v=A1LyDnwkiz8

// 6:45