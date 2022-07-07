import Link from 'next/link';

const HomePage = ({ currentUser, tickets }) => {
  const ticketList = tickets.map((ticket) => {
    return (
      <tr key={ticket.id}>
        <td>{ticket.title}</td>
        <td>{ticket.price}</td>
        <td>
          <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
            <a className="btn btn-primary">View Details</a>
          </Link>
        </td>
      </tr>
    );
  });

  return (
    <div>
      <h2>Tickets</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Price</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>{ticketList}</tbody>
      </table>
    </div>
  );
};

HomePage.getInitialProps = async (context, client, currentUser) => {
  const { data } = await client.get('/api/tickets');

  return { tickets: data };
};

export default HomePage;

// export const getServerSideProps = async (context) => {
//   const client = buildClient(context);
//   const { data } = await client.get('/api/users/currentuser');
//   return { props: { currentUser: data.currentUser, client: client } };
// };
