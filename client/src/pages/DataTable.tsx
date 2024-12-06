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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export function DataTable() {
  const [search, setSearch] = useState("");
  const { data, isLoading, error } = useQuery({
    queryKey: ["github-users"],
    queryFn: fetchGithubUsers,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  const filteredUsers = data?.filter((user) =>
    user.login.toLowerCase().includes(search.toLowerCase()),
  );

  const prepareChartData = () => {
    if (!data) return { userTypes: [], followerRanges: [] };
    
    // Count user types (User vs Organization)
    const userTypes = [
      { name: 'Users', value: data.filter(user => !user.type || user.type === 'User').length },
      { name: 'Organizations', value: data.filter(user => user.type === 'Organization').length }
    ];

    // Create follower ranges
    const followerRanges = [
      { name: '0-100', value: data.filter(user => user.followers >= 0 && user.followers <= 100).length },
      { name: '101-500', value: data.filter(user => user.followers > 100 && user.followers <= 500).length },
      { name: '501+', value: data.filter(user => user.followers > 500).length }
    ];

    return { userTypes, followerRanges };
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  const { userTypes, followerRanges } = prepareChartData();

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

      {!error && !isLoading && (
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>User Types Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={userTypes}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userTypes.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Followers Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={followerRanges}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8">
                    {followerRanges.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

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
