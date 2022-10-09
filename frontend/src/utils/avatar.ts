import axios from 'axios';
import kingPongImg from '@/assets/images/king-pong.jpg';

export async function fetchAvatar(
  id: number,
  convertBlob = URL.createObjectURL,
): Promise<string> {
  let avatar;
  try {
    const response = await axios.get('/users/' + id + '/avatar', {
      responseType: 'blob',
    });
    if (response.status === 204) throw 'No avatar found';
    const blob = new Blob([response.data]);
    return convertBlob(blob);
  } catch (error) {
    avatar = kingPongImg;
  }
  return avatar;
}
