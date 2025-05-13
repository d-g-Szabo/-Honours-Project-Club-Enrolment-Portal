import { Button } from "@/components/ui/button";
import React from "react";

export default function PaymentsPage() {
  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold">Payments</h1>
      <section>
        <h2 className="text-xl font-semibold mb-4">Outstanding Fees</h2>
        <table className="w-full mb-6 border rounded-lg overflow-hidden shadow">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Club</th>
              <th className="p-2 text-left">Due Date</th>
              <th className="p-2 text-left">Amount Due</th>
              <th className="p-2"></th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((id) => (
              <tr key={id} className="border-t">
                <td className="p-2">Club {id}</td>
                <td className="p-2">2024-07-0{id}</td>
                <td className="p-2">$100</td>
                <td className="p-2"><Button className="transition-transform hover:scale-105">Pay Now</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
      <section>
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        <table className="w-full border rounded-lg overflow-hidden shadow">
          <thead className="bg-muted">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2].map((id) => (
              <tr key={id} className="border-t">
                <td className="p-2">2024-06-0{id}</td>
                <td className="p-2">$100</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
} 