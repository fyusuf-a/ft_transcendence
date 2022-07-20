import { expect } from 'chai';
import { fetchAvatar } from '@/utils/avatar';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

describe('fetchAvatar', () => {
  it('exists', async () => {
    expect(fetchAvatar).to.exist;
  });

  it('takes an id as a parameter', async () => {
    const response = fetchAvatar('5');
    expect(response).to.exist;
  });

  it('returns image string if avatar found', async () => {
    const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
    mock.onGet('/users/5/avatar').reply(200, 'response');
    const convertBlob = () => 'success';

    const response = await fetchAvatar('5', convertBlob);
    mock.reset();
    expect(response).to.be.a('string');
    expect(response).to.equal('success');
  });

  it('returns default path if avatar not found', async () => {
    const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
    mock.onGet('/users/5/avatar').reply(204);

    const response = await fetchAvatar('5');
    mock.reset();
    expect(response).to.be.a('string');
    try {
      expect(response).to.equal('/img/king-pong.93322209.png');
    } catch {
      expect(response).to.equal(
        'data:image/png;base64,dmVyc2lvbiBodHRwczovL2dpdC1sZnMuZ2l0aHViLmNvbS9zcGVjL3YxCm9pZCBzaGEyNTY6NGZmMTQ2OTQ3NGUzYmJhNTEzYzQzNDMxZjg4ZWY4MDk3MTEyY2NjOGE1ZWZiZTViNWQ4MGRkNzY0Y2M2YjEzYwpzaXplIDExNjg4MQo=',
      );
    }
  });

  it('returns default path if user does not exist', async () => {
    const mock = new MockAdapter(axios, { onNoMatch: 'throwException' });
    mock.onGet('/users/5/avatar').reply(400);

    const response = await fetchAvatar('5');
    mock.reset();
    expect(response).to.be.a('string');
    try {
      expect(response).to.equal('/img/king-pong.93322209.png');
    } catch {
      expect(response).to.equal(
        'data:image/png;base64,dmVyc2lvbiBodHRwczovL2dpdC1sZnMuZ2l0aHViLmNvbS9zcGVjL3YxCm9pZCBzaGEyNTY6NGZmMTQ2OTQ3NGUzYmJhNTEzYzQzNDMxZjg4ZWY4MDk3MTEyY2NjOGE1ZWZiZTViNWQ4MGRkNzY0Y2M2YjEzYwpzaXplIDExNjg4MQo=',
      );
    }
  });
});
