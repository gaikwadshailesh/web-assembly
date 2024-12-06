import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { fetchGithubUsers } from "../lib/api";
import { Skeleton } from "@/components/ui/skeleton";

export function DataTable() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["github-users"],
    queryFn: fetchGithubUsers,
  });

  const filteredUsers = data?.filter((user) =>
    user.login.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-3xl font-bold tracking-tight">GitHub Users</h2>
        <Input
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
      </div>

      {error ? (
        <div className="text-red-500">Error loading users</div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Avatar</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Profile URL</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading
                ? Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <Skeleton className="h-8 w-8 rounded-full" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-32" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-4 w-48" />
                        </TableCell>
                      </TableRow>
                    ))
                : filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <img
                          src={user.avatar_url}
                          alt={user.login}
                          className="h-8 w-8 rounded-full"
                        />
                      </TableCell>
                      <TableCell>{user.login}</TableCell>
                      <TableCell>
                        <a
                          href={user.html_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          {user.html_url}
                        </a>
                      </TableCell>
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
