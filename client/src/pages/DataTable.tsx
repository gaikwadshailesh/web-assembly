import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { GithubUser } from "../lib/api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { fetchGithubUsers } from "../lib/api";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
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
  const { toast } = useToast();
  const { data, isLoading, error, isFetching } = useQuery({
    queryKey: ["github-users"],
    queryFn: fetchGithubUsers,
    refetchInterval: 60000, // Refetch every 60 seconds (1 minute)
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    retry: (failureCount, error) => {
      if (error instanceof Error && error.message.includes('rate limit')) {
        return false; // Don't retry rate limit errors
      }
      return failureCount < 3;
    },
    staleTime: 30000, // Consider data stale after 30 seconds
    gcTime: 120000, // Keep data in cache for 2 minutes
    select: (data: GithubUser[]) => data
  });

  // Show toast only when component mounts or when data length changes
  useEffect(() => {
    if (data) {
      toast({
        title: "Data Updated",
        description: `Found ${data.length} GitHub users`,
      });
    }
  }, [data?.length, toast]); // Only re-run if data length changes or toast function changes

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

  const filteredUsers = data?.filter((user) =>
    user.login.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <h2 className="text-3xl font-bold tracking-tight">GitHub Users</h2>
          {isFetching && (
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent" />
          )}
        </div>
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
        <Card className="p-6">
          <div className="text-destructive space-y-2">
            <h3 className="font-semibold">Error loading users</h3>
            <p className="text-sm text-muted-foreground">
              {error instanceof Error ? error.message : "An unexpected error occurred"}
            </p>
          </div>
        </Card>
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
