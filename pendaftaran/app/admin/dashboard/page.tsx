"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  PieChart,
  Pie,
  ResponsiveContainer,
  Cell,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

type Stats = {
  total: number;
  minatCount: {
    sangat_berminat: number;
    berminat: number;
    ragu: number;
    tidak_berminat: number;
  };
  statusCount: {
    aktif_kuliah: number;
    aktif_pembayaran: number;
    cuti: number;
  };
  kendalaFinansialCount: {
    ya: number;
    tidak: number;
  };
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    total: 0,
    minatCount: {
      sangat_berminat: 0,
      berminat: 0,
      ragu: 0,
      tidak_berminat: 0,
    },
    statusCount: {
      aktif_kuliah: 0,
      aktif_pembayaran: 0,
      cuti: 0,
    },
    kendalaFinansialCount: {
      ya: 0,
      tidak: 0,
    },
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: submissions } = await supabase
        .from("pra_pendaftaran")
        .select("*");

      if (submissions) {
        const minatCount = {
          sangat_berminat: 0,
          berminat: 0,
          ragu: 0,
          tidak_berminat: 0,
        };
        const statusCount = {
          aktif_kuliah: 0,
          aktif_pembayaran: 0,
          cuti: 0,
        };
        const kendalaFinansialCount = {
          ya: 0,
          tidak: 0,
        };

        submissions.forEach((sub) => {
          minatCount[sub.minat as keyof typeof minatCount]++;
          statusCount[sub.status as keyof typeof statusCount]++;
          kendalaFinansialCount[
            sub.kendala_finansial as keyof typeof kendalaFinansialCount
          ]++;
        });

        setStats({
          total: submissions.length,
          minatCount,
          statusCount,
          kendalaFinansialCount,
        });
      }
    };

    fetchStats();
  }, []);

  const minatData = Object.entries(stats.minatCount).map(([key, value]) => ({
    name:
      key === "sangat_berminat"
        ? "Sangat Berminat"
        : key === "berminat"
        ? "Berminat"
        : key === "ragu"
        ? "Ragu"
        : "Tidak Berminat",
    value,
  }));

  const statusData = Object.entries(stats.statusCount).map(([key, value]) => ({
    name:
      key === "aktif_kuliah"
        ? "Aktif Kuliah"
        : key === "aktif_pembayaran"
        ? "Aktif Pembayaran"
        : "Cuti",
    value,
  }));

  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Dashboard Admin</h1>
        <p className="text-muted-foreground">
          Total Pendaftar: {stats.total} mahasiswa
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Statistik Minat KKL</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={minatData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {minatData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status Mahasiswa</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#82ca9d"
                  label
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Kendala Finansial</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    {
                      name: "Ada Kendala",
                      value: stats.kendalaFinansialCount.ya,
                    },
                    {
                      name: "Tidak Ada Kendala",
                      value: stats.kendalaFinansialCount.tidak,
                    },
                  ]}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#ffc658"
                  label
                >
                  <Cell fill="#ff8042" />
                  <Cell fill="#00C49F" />
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
