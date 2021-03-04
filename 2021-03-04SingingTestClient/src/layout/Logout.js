

export default async function Logout() {
console.log('logout');


  const promiseFunc = async () => this.$http
    .post(`${process.env.VUE_APP_BASE_API}/api/auth/SignOut`, null, { timeout: 3000 }) // wait 3 sec only
    .then(response => response.data)
    .catch(error => console.warn(error));

  await promiseFunc();

  this.$cookies.keys().forEach((item) => {
    this.$cookies.remove(item); // prevent can't remove from server
  });

  this.$router.push('/login');
}
