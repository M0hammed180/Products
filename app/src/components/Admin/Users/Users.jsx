import React, { useEffect, useState } from "react";
import api from "../../api";
import Loading from "../../Elements/Loading";
import { Link } from "react-router-dom";
import { SearchNormal2 } from "reicon-react";
import { useSelector } from "react-redux";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    totalPages: 1,
    totalUsers: 0,
  });
  const { search, searchOrder } = useSelector((state) => state.page);

  const fetchUsers = async (requestedPage = page, requestedSearch = search) => {
    try {
      setLoading(true);
      const response = await api.get("user", {
        params: { page: requestedPage, search: requestedSearch },
      });
      setUsers(response.data.allUsers);
      setPagination(response.data.pagination);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, searchOrder]);

  const deleteUser = async (userId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this user? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      await api.delete(`user/${userId}`);
      fetchUsers();
    } catch (error) {
      console.log(error);
      window.alert("Unable to delete the user. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  // useEffect(() => {
  //   if (!search?.trim()) {
  //     fetchUsers(1, "");
  //   }
  // }, [search]);

  return (
    <div>
      <div className="flex flex-col">
        <div className="overflow-x-auto sm:mx-0.5 lg:mx-0.5">
          <div className="py-2 inline-block min-w-full ">
            <div className="overflow-hidden">
              <table className="min-w-full border-separate border-spacing-y-2">
                <thead className="border-b border-zinc-300 bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-950">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Avatar
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Phone
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Email
                    </th>{" "}
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-medium text-zinc-900 dark:text-zinc-100"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((p, index) => (
                    <tr
                      key={p._id}
                      className={`rounded-lg border-b border-zinc-600 text-zinc-100 transition hover:bg-zinc-600 ${
                        index % 2 === 0 ? "bg-zinc-700" : "bg-zinc-900"
                      }`}
                    >
                      <td className="whitespace-nowrap rounded-l-lg px-6 py-4 text-sm font-medium">
                        <Link to={`/edit_user/${p._id}`}>
                          <div className="flex gap-[0.5px]">
                            <img
                              src={p.avatar}
                              className="w-5 h-5 rounded-full"
                              alt=""
                            />{" "}
                          </div>
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        <Link
                          to={`/edit_user/${p._id}`}
                          className="font-medium hover:underline"
                        >
                          {p.name}
                        </Link>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        {p.phone}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        {p.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-light">
                        {p.role}
                      </td>
                      <td className="whitespace-nowrap rounded-r-lg px-6 py-4 text-sm font-light">
                        <div className="flex gap-2">
                          <Link
                            to={`/edit_user/${p._id}`}
                            className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200"
                          >
                            Edit
                          </Link>
                          <button
                            type="button"
                            className="rounded-md bg-red-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-700"
                            onClick={() => deleteUser(p._id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between px-4 py-4 text-sm text-zinc-700 dark:text-zinc-300">
        <span>
          Page {pagination.page} of {pagination.totalPages} (
          {pagination.totalUsers} users)
        </span>
        <div className="flex gap-2">
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((currentPage) => currentPage - 1)}
            className="rounded-md bg-zinc-200 px-4 py-2 font-medium text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-zinc-800 dark:text-white"
          >
            Previous
          </button>
          <button
            type="button"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((currentPage) => currentPage + 1)}
            className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 dark:bg-white dark:text-zinc-950"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
