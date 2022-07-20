import axios from 'axios';

export async function fetchAvatar(
  id?: string,
  convertBlob = URL.createObjectURL,
): Promise<string> {
  let avatar;
  try {
    if (id === undefined) throw 'No id given';
    const response = await axios.get('/users/' + id + '/avatar', {
      responseType: 'blob',
    });
    if (response.status === 204) throw 'No avatar found';
    const blob = new Blob([response.data]);
    return convertBlob(blob);
  } catch (error) {
    avatar = require('@/assets/images/king-pong.png');
  }
  return avatar;
}
