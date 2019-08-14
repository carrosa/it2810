class APIService {
  // Async signup
  async signUp(username, password) {
    const rawRes = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: `${username}`,
        password: `${password}`
      })
    }); // Returns success status and msg in response
    return await rawRes.json();
  }

  // Async signin
  async signIn(username, password) {
    const rawRes = await fetch('/api/auth/signin', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: `${username}`,
        password: `${password}`
      })
    }); // returns success status and token if successful, msg if not.
    return await rawRes.json();
  }

  // Async get page with memes
  async getMemesByPage(page) {
    const response = await fetch(`/api/memes/?page=${page}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  }

  async getMemes(query) {
    const response = await fetch(`/api/memes/search${query}`);
    const body = await response.json();
    if (response.status !== 200) throw Error(body.message);
    console.log(body);
    return body;
  }


  // Async get specific meme (For use when viewing comments/meme in full format)
  async getMeme(id) {
    const response = await fetch(`/api/memes/${id}`);
    const body = await response.json();
    if (response.status !== 200) {
      throw Error(body.message);
    }
    return body;
  }

  async vote(id, type, token) {
    const rawRes = await fetch(`/api/memes/${id}/vote`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({vote: type})
    });
    return await rawRes.json();
  }

  async postComment(memeid, token, comment) {
    const rawRes = await fetch(`/api/memes/${memeid}/create_comment`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify({comment: comment})
    });
    return await rawRes.json();
  }

  async editComment(token, user) {
    // TODO
  }
}

export default APIService;
