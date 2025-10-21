import React, { useEffect, useState } from "react";
import { fetchUsers } from "../api/api";
import AppTable from "../components/AppTable";

export default function UserList({ refresh }) {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetchUsers().then(setUsers);
  }, [refresh]);

  return (
    <div className="users">
      <AppTable data={users} typeData={"users"} />
    </div>
  );
}
