import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';
import buildClient from '../../api/build-client';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/users/signup',
    method: 'post',
    body: { email, password },
    onSuccess: () => Router.push('/'),
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    // try {
    //   const response = await axios.post('/api/users/signup', {
    //     email,
    //     password,
    //   });
    //   console.log(response.data);
    // } catch (error) {
    //   console.log(error.response.data);
    //   setErrors(error.response.data.errors);
    // }
    await doRequest();
  };

  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <h1>Sign Up</h1>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Password</label>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            className="form-control"
          />
        </div>
        {errors}
        <button className="btn btn-primary mt-3">Sign Up</button>
      </form>
    </div>
  );
};

export default Signup;
