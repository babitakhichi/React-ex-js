const Dashboard = {
  totalCounts: {
    url: "/v1.0/admin/dashboard",
    method: "GET",
  },
  donutGraph: {
    url: "/v1.0/admin/dashboard/donut/graph",
    method: "GET",
  },
  lineGraph: (plan) => ({
    url: `/v1.0/admin/dashboard/line/graph/${plan}`,
    method: "GET",
  }),
};
export default Dashboard;
