import Cookies from 'js-cookie';
export default function getToken() {
  const token = Cookies.get('token');
  return token;
}
