import { useState } from 'react';
import Router from 'next/router';

import useRequest from '../../hooks/useRequest';

const CreateTicket = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: { title, price },
    onSuccess: () => Router.push('/'),
  });

  const onBlur = (e) => {
    const value = parseFloat(price);

    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();

    doRequest();
  };

  return (
    <div className="container">
      <h1>Create A Ticket</h1>
      <form onSubmit={onSubmitHandler}>
        <div className="form-group">
          <label htmlFor="">Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="">Price</label>
          <input
            type="text"
            className="form-control"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button className="btn btn-primary mt-4">Submit</button>
      </form>
    </div>
  );
};

export default CreateTicket;
