export const getStaticProps = async () => {
  const url = process.env.NEXT_PUBLIC_API_DOMAIN || "http://127.0.0.1:8000";
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNzQ3ODMyMDI2LCJpYXQiOjE3NDc4Mjg0MjYsImp0aSI6ImNjOWU3NWU1ZGExNjQ4YTU4MzJmOGQxMmQ4NDVmMjRmIiwidXNlcl9pZCI6MX0.vLzRU6LGa6JvFNPm9NMVuamtRgvMo8DS5ly8J2-F0XI";

  try {
    console.log("Fetching from:", `${url}/core/users`);
    const res = await fetch(`${url}/core/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(
        `Fetch error: ${res.status} ${res.statusText} - ${errorText}`
      );
      return {
        props: {
          data: {
            parents: [],
            error: `Failed to fetch: ${res.status} ${errorText}`,
          },
        },
      };
    }

    const data = await res.json();
    console.log("Fetched parents:", data);

    return {
      props: {
        data: data || { parents: [], error: null },
      },
    };
  } catch (error) {
    console.error("Fetch failed:", error.message);
    return {
      props: {
        data: { parents: [], error: `Fetch error: ${error.message}` },
      },
    };
  }
};

const Test = ({ data = { parents: [], error: null } }) => {
  console.log("Props received:", data);

  return (
    <div>
      <h1>Test</h1>
      {data.error ? (
        <p style={{ color: "red" }}>Error: {data.error}</p>
      ) : (
        <p>Parents: {data.parents ? data.parents.length : 0}</p>
      )}
      <ul>
        {data.parents && data.parents.length > 0 ? (
          data.parents.map((parent, index) => (
            <li key={index}>{parent.username || "Unknown User"}</li>
          ))
        ) : (
          <li>No parents found</li>
        )}
      </ul>
    </div>
  );
};

export default Test;
