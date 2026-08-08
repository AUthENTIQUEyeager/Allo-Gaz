"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

export default function RevenueChart({ data }) {
  return (
    <div className="h-48 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#22221d0d" />
          <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#22221d80" }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: "#22221d80" }} axisLine={false} tickLine={false} width={30} />
          <Tooltip
            contentStyle={{ borderRadius: 12, border: "1px solid #22221d1a", fontSize: 12 }}
            formatter={(value, name) => [value, name === "commandes" ? "Commandes" : "Revenu (FCFA)"]}
          />
          <Bar dataKey="commandes" fill="#FF6B35" radius={[6, 6, 0, 0]} maxBarSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
